"""
seed_data.py
============
Populate the SQLite database with anonymous synthetic survey results so the
Analytics dashboard is not empty on first run.

It generates realistic respondents (the same way the trainer does), runs them
through the *trained model* and stores the results — exactly what would happen if
real users completed the survey, but with synthetic input.

Run from the backend folder (after train_model.py):
    python seed_data.py            # seed up to the default target count
    python seed_data.py 250        # seed a specific number of new rows
    python seed_data.py --force    # seed even if data already exists
"""

from __future__ import annotations

import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import database  # noqa: E402
from app.model_service import model_service  # noqa: E402
from train_model import generate_answers  # noqa: E402

DEFAULT_TARGET = 180
SEED = 2025  # different from the training seed for fresh variety


def main(argv: list[str]) -> None:
    force = "--force" in argv
    count_args = [a for a in argv if a.isdigit()]
    n_new = int(count_args[0]) if count_args else DEFAULT_TARGET

    database.init_db()
    model_service.load()

    existing = database.count_surveys()
    if existing >= DEFAULT_TARGET and not force and not count_args:
        print(
            f"Database already has {existing} survey results; nothing to seed. "
            f"Use --force or pass a number to add more."
        )
        return

    print(f"Seeding {n_new} synthetic survey results (existing: {existing})...")
    rng = np.random.default_rng(SEED)
    answers_list = generate_answers(n_new, rng)

    for answers in answers_list:
        # persist=True stores the row via the normal prediction pipeline.
        model_service.predict(answers, persist=True)

    total = database.count_surveys()
    print(f"Done. Database now contains {total} anonymous survey results.")
    print("Motivation type distribution:", database.distribution("motivation_type"))
    print("Study style distribution   :", database.distribution("study_style"))
    print("Stress risk distribution   :", database.distribution("stress_risk"))


if __name__ == "__main__":
    main(sys.argv[1:])
