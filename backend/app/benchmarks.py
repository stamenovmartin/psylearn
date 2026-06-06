"""
benchmarks.py
=============
Real-world benchmark layer.

The app's own model is trained on synthetic data (clearly disclosed), but the
"How you compare to the world" feature compares the user's sub-scores against a
REAL, public-domain dataset: the Open-Source Psychometrics Project's IPIP
Big-Five Factor Markers (~19,719 real respondents).

Norms are pre-computed by ``build_world_norms.py`` into
``artifacts/world_norms.json``. Several of our learning-psychology sub-scores map
naturally onto Big Five traits, so those traits serve as an approximate but
genuine real-world reference distribution.
"""

from __future__ import annotations

import json
import os
from typing import Dict, List

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "artifacts")
NORMS_PATH = os.environ.get("WORLD_NORMS_PATH", os.path.join(ARTIFACTS_DIR, "world_norms.json"))

# Which app sub-score maps to which Big Five trait (same 1-5 agreement scale).
# The mapping is approximate and clearly labelled as such in the UI.
MAPPING: List[Dict[str, str]] = [
    {"score_key": "social_energy_score", "trait": "Extraversion",
     "label": "Social energy", "blurb": "how outgoing and energized by people you are"},
    {"score_key": "organization_score", "trait": "Conscientiousness",
     "label": "Organization", "blurb": "how organized and disciplined you are"},
    {"score_key": "stress_score", "trait": "Neuroticism",
     "label": "Stress sensitivity", "blurb": "how strongly you react to pressure"},
    {"score_key": "intrinsic_motivation_score", "trait": "Openness",
     "label": "Curiosity", "blurb": "how drawn you are to ideas and understanding"},
]


def load_norms() -> dict:
    if not os.path.exists(NORMS_PATH):
        return {}
    try:
        with open(NORMS_PATH, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def get_world_benchmark() -> dict:
    """Return the real-world norms plus the sub-score → trait mapping (with the
    trait mean/sd inlined for convenience)."""
    norms = load_norms()
    if not norms:
        return {}
    traits = norms.get("traits", {})
    mapping = []
    for m in MAPPING:
        trait = traits.get(m["trait"])
        if not trait:
            continue
        mapping.append({
            **m,
            "trait_mean": trait["mean"],
            "trait_sd": trait["sd"],
        })
    return {
        "source": norms.get("source"),
        "source_url": norms.get("source_url"),
        "license": norms.get("license"),
        "n_respondents": norms.get("n_respondents"),
        "scale": norms.get("scale"),
        "note": norms.get("note"),
        "traits": traits,
        "mapping": mapping,
    }
