"""
build_world_norms.py
====================
Compute REAL Big Five population norms from the public-domain Open-Source
Psychometrics Project dataset (IPIP Big-Five Factor Markers, ~19,719 real
respondents) and save them to ``artifacts/world_norms.json``.

These norms power the "How you compare to the world" feature: the user's
sub-scores are compared against this real population (NOT synthetic data).

The script downloads the raw dataset (≈0.5 MB) on first run, applies the
standard IPIP-50 scoring keys (reverse-keying the negatively-worded items),
computes each respondent's trait score on the per-item 1–5 scale, then stores
the population mean and standard deviation per trait.

Run from the backend folder:
    python build_world_norms.py
"""

from __future__ import annotations

import io
import json
import os
import urllib.request
import zipfile

import numpy as np
import pandas as pd

DATA_URL = "https://openpsychometrics.org/_rawdata/BIG5.zip"
ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts")
OUT_PATH = os.path.join(ARTIFACTS_DIR, "world_norms.json")

TRAIT_NAMES = {
    "E": "Extraversion",
    "N": "Neuroticism",
    "A": "Agreeableness",
    "C": "Conscientiousness",
    "O": "Openness",
}

# Standard IPIP-50 reverse-keyed item numbers (negatively worded items).
REVERSE = {
    "E": {2, 4, 6, 8, 10},
    "N": {2, 4},
    "A": {1, 3, 5, 7},
    "C": {2, 4, 6, 8},
    "O": {2, 4, 6},
}


def load_dataframe() -> pd.DataFrame:
    print(f"Downloading dataset: {DATA_URL}")
    with urllib.request.urlopen(DATA_URL, timeout=120) as resp:
        raw = resp.read()
    with zipfile.ZipFile(io.BytesIO(raw)) as zf:
        csv_name = next(n for n in zf.namelist() if n.endswith("data.csv"))
        with zf.open(csv_name) as f:
            df = pd.read_csv(f, sep="\t")
    print(f"Loaded {len(df):,} respondents.")
    return df


def main() -> None:
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    df = load_dataframe()

    traits: dict = {}
    n_used = 0
    for letter, name in TRAIT_NAMES.items():
        cols = [f"{letter}{i}" for i in range(1, 11)]
        block = df[cols].apply(pd.to_numeric, errors="coerce")
        # 0 means "missing answer" in this dataset.
        block = block.where((block >= 1) & (block <= 5))
        # Reverse-key the negatively worded items (1<->5).
        for i in REVERSE[letter]:
            col = f"{letter}{i}"
            block[col] = 6 - block[col]
        # Per-respondent trait score = mean of the 10 keyed items.
        scores = block.mean(axis=1, skipna=True).dropna()
        traits[name] = {
            "mean": round(float(scores.mean()), 3),
            "sd": round(float(scores.std(ddof=1)), 3),
        }
        n_used = max(n_used, int(scores.shape[0]))
        print(f"  {name:18s} mean={traits[name]['mean']:.3f}  sd={traits[name]['sd']:.3f}")

    payload = {
        "source": "Open-Source Psychometrics Project — IPIP Big-Five Factor Markers",
        "source_url": "https://openpsychometrics.org/_rawdata/",
        "license": "Public Domain",
        "n_respondents": int(len(df)),
        "n_scored": n_used,
        "scale": "Per-item 1-5 agreement (reverse-keyed items inverted)",
        "note": (
            "Means and standard deviations computed directly from real respondents "
            "by build_world_norms.py — not synthetic. Big Five traits are used as an "
            "approximate real-world benchmark for the app's related sub-scores."
        ),
        "traits": traits,
    }
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    print(f"Saved real-world norms to {OUT_PATH}")


if __name__ == "__main__":
    main()
