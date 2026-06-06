"""
database.py
===========
Thin SQLite persistence layer.

We store ONLY anonymous, aggregate-friendly data: the 16 computed sub-scores and
the 6 predicted labels for each completed survey. No names, emails, IP addresses
or any other personal identifier is ever stored.

A new connection is opened per operation (SQLite handles this well for the
prototype's load) so the module is safe to use from FastAPI's worker threads.
"""

from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from typing import Dict, Iterator, List, Optional

from .labeling import TARGET_NAMES
from .scoring import FEATURES

# DB location is configurable for deployment; defaults next to the backend.
DB_PATH = os.environ.get(
    "DB_PATH",
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "psylearn.db"),
)

SCORE_COLUMNS: List[str] = list(FEATURES)          # 16 numeric columns
PREDICTION_COLUMNS: List[str] = list(TARGET_NAMES)  # 6 text columns


@contextmanager
def _connect() -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    """Create tables if they do not yet exist."""
    score_cols_sql = ",\n            ".join(f"{c} REAL NOT NULL" for c in SCORE_COLUMNS)
    pred_cols_sql = ",\n            ".join(f"{c} TEXT NOT NULL" for c in PREDICTION_COLUMNS)

    with _connect() as conn:
        conn.execute(
            f"""
            CREATE TABLE IF NOT EXISTS survey_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            {score_cols_sql},
            {pred_cols_sql}
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                rating INTEGER NOT NULL,
                helpful INTEGER,
                comment TEXT
            )
            """
        )


def insert_survey_result(scores: Dict[str, float], predictions: Dict[str, str]) -> int:
    """Insert one anonymous survey result. Returns the new row id."""
    columns = SCORE_COLUMNS + PREDICTION_COLUMNS
    placeholders = ", ".join(["?"] * len(columns))
    values = [float(scores[c]) for c in SCORE_COLUMNS] + [
        str(predictions[c]) for c in PREDICTION_COLUMNS
    ]
    with _connect() as conn:
        cur = conn.execute(
            f"INSERT INTO survey_results ({', '.join(columns)}) VALUES ({placeholders})",
            values,
        )
        return int(cur.lastrowid)


def insert_feedback(rating: int, comment: Optional[str], helpful: Optional[bool]) -> int:
    with _connect() as conn:
        cur = conn.execute(
            "INSERT INTO feedback (rating, comment, helpful) VALUES (?, ?, ?)",
            (int(rating), comment, None if helpful is None else int(helpful)),
        )
        return int(cur.lastrowid)


def count_surveys() -> int:
    with _connect() as conn:
        row = conn.execute("SELECT COUNT(*) AS n FROM survey_results").fetchone()
        return int(row["n"])


def distribution(column: str) -> Dict[str, int]:
    """Count of each distinct value in a prediction column (e.g. stress_risk)."""
    if column not in PREDICTION_COLUMNS:
        raise ValueError(f"Unknown prediction column: {column}")
    with _connect() as conn:
        rows = conn.execute(
            f"SELECT {column} AS value, COUNT(*) AS n "
            f"FROM survey_results GROUP BY {column} ORDER BY n DESC"
        ).fetchall()
        return {row["value"]: int(row["n"]) for row in rows}


def average_scores() -> Dict[str, float]:
    """Average of every numeric sub-score across all stored surveys."""
    if count_surveys() == 0:
        return {c: 0.0 for c in SCORE_COLUMNS}
    avg_sql = ", ".join(f"AVG({c}) AS {c}" for c in SCORE_COLUMNS)
    with _connect() as conn:
        row = conn.execute(f"SELECT {avg_sql} FROM survey_results").fetchone()
        return {c: round(float(row[c]), 3) for c in SCORE_COLUMNS}


def most_common(column: str) -> Optional[str]:
    dist = distribution(column)
    if not dist:
        return None
    return max(dist.items(), key=lambda kv: kv[1])[0]


def fetch_all_scores() -> List[List[float]]:
    """Return every stored survey's 16 sub-scores as rows (SCORE_COLUMNS order)."""
    cols = ", ".join(SCORE_COLUMNS)
    with _connect() as conn:
        rows = conn.execute(f"SELECT {cols} FROM survey_results").fetchall()
        return [[float(row[c]) for c in SCORE_COLUMNS] for row in rows]
