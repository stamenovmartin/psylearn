"""
model_service.py
================
Loads the trained model bundle once and turns a set of answers into a full
profile (scores + predictions + explanations + recommendations).

The model bundle (``artifacts/model.joblib``) is a dict produced by
``train_model.py``:

    {
        "models":   {target: fitted sklearn classifier, ...},
        "features": [...ordered feature names...],
        "targets":  [...target names...],
        "classes":  {target: [class labels...]},
        "model_type": "RandomForestClassifier",
        "version": "...",
        ...
    }
"""

from __future__ import annotations

import os
from typing import Dict, List, Optional

import joblib

from . import database
from .explanations import explain
from .recommendations import build_recommendations
from .scoring import FEATURES, compute_scores, features_vector, memory_method_signals

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "artifacts")
MODEL_PATH = os.environ.get("MODEL_PATH", os.path.join(ARTIFACTS_DIR, "model.joblib"))
METADATA_PATH = os.environ.get(
    "MODEL_METADATA_PATH", os.path.join(ARTIFACTS_DIR, "model_metadata.json")
)


def load_metadata() -> dict:
    """Read the saved model metadata (metrics, feature importances, etc.)."""
    import json

    if not os.path.exists(METADATA_PATH):
        return {}
    try:
        with open(METADATA_PATH, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}

DISCLAIMER = (
    "This result is produced by a lightweight machine-learning model trained on "
    "synthetic educational data. It is an educational prototype based on psychology "
    "course concepts — not a clinical assessment, diagnosis or professional evaluation."
)


class ModelService:
    """Holds the loaded model bundle and serves predictions."""

    def __init__(self) -> None:
        self._bundle: Optional[dict] = None

    # -- lifecycle -------------------------------------------------------- #
    def load(self) -> None:
        """Load the model bundle from disk. Safe to call once at startup."""
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model artifact not found at '{MODEL_PATH}'. "
                f"Run `python train_model.py` in the backend folder first."
            )
        bundle = joblib.load(MODEL_PATH)
        # Sanity check: the saved feature order must match the current code.
        if list(bundle.get("features", [])) != list(FEATURES):
            raise ValueError(
                "Feature mismatch between saved model and scoring.py. "
                "Retrain the model with `python train_model.py`."
            )
        self._bundle = bundle

    @property
    def is_loaded(self) -> bool:
        return self._bundle is not None

    @property
    def targets(self) -> List[str]:
        if not self._bundle:
            return []
        return list(self._bundle["targets"])

    @property
    def metadata(self) -> Dict:
        if not self._bundle:
            return {}
        return {
            "model_type": self._bundle.get("model_type"),
            "version": self._bundle.get("version"),
            "trained_at": self._bundle.get("trained_at"),
            "n_samples": self._bundle.get("n_samples"),
        }

    # -- inference -------------------------------------------------------- #
    def predict(self, answers: Dict[str, int], persist: bool = True) -> Dict:
        """Run the full pipeline for one questionnaire submission."""
        if not self._bundle:
            raise RuntimeError("Model is not loaded.")

        scores = compute_scores(answers)
        x = [features_vector(scores)]

        predictions: Dict[str, str] = {}
        for target in self._bundle["targets"]:
            clf = self._bundle["models"][target]
            predictions[target] = str(clf.predict(x)[0])

        explanations = explain(predictions)
        recommendations = build_recommendations(predictions, scores)
        signals = memory_method_signals(answers)

        if persist:
            try:
                database.insert_survey_result(scores, predictions)
            except Exception:  # noqa: BLE001 - persistence must never break a prediction
                # Storing analytics is best-effort; a DB hiccup should not stop
                # the user from getting their result.
                pass

        return {
            "scores": scores,
            "predictions": predictions,
            "explanations": explanations,
            "recommendations": recommendations,
            "memory_signals": signals,
            "disclaimer": DISCLAIMER,
        }


# Module-level singleton, loaded at app startup.
model_service = ModelService()
