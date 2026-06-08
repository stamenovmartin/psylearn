"""
train_model.py
==============
Generate a synthetic dataset, train the PsyLearn Profiler models, evaluate them
and persist the artifacts.

Pipeline
--------
1. Generate >= 2,000 synthetic respondents with realistic 1..5 Likert answers.
2. Compute the 16 psychological sub-scores (using the SAME code the API uses).
3. Assign the 6 target labels with transparent rule-based logic.
4. Train one RandomForestClassifier per target.
5. Train/test split + print accuracy, precision, recall, F1 and confusion matrix.
6. Save:
     artifacts/model.joblib          (all six fitted models + metadata)
     artifacts/model_metadata.json   (metrics, classes, distributions)
     artifacts/features.json         (ordered feature list)

NOTE
----
The data is SYNTHETIC and the labels come from explicit rules, so the models
learn to reproduce those rules and accuracy is expected to be high. This is an
*educational* prototype, not a model trained on real psychological measurements.

Run from the backend folder:
    python train_model.py
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timezone

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split

# Make the `app` package importable when run as a script.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import __version__  # noqa: E402
from app.labeling import TARGET_NAMES, TARGETS, assign_labels  # noqa: E402
from app.scoring import FEATURES, QUESTION_IDS, compute_scores, features_vector  # noqa: E402

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #
N_SAMPLES = 3000          # well above the required 2,000
TEST_SIZE = 0.2
RANDOM_STATE = 42
NOISE_SD = 0.6            # Likert answer noise around each latent trait
N_ESTIMATORS = 200

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts")

# Map each question to the latent construct that drives its answer. Sampling a
# latent value per construct (instead of pure random answers) produces realistic,
# internally-consistent respondents and good coverage of every label class.
QUESTION_LATENT = {
    "q1": "intrinsic", "q4": "intrinsic", "q6": "intrinsic",
    "q2": "extrinsic", "q5": "extrinsic",
    "q3": "pressure",
    "q7": "learning", "q10": "learning", "q12": "learning",
    "q8": "performance", "q9": "performance",
    "q11": "avoidance",
    "q13": "lastminute",
    "q14": "deep", "q16": "deep", "q17": "deep",
    "q15": "surface", "q18": "surface",
    "q19": "visual", "q24": "visual",
    "q20": "association",
    "q21": "repetition", "q22": "repetition",
    "q23": "teach",
    "q25": "social",
    "q26": "introvert",
    "q27": "stress", "q28": "stress", "q30": "stress",
    "q29": "organization",
    # Section F scenarios (image-choice) feed the same constructs.
    "q31": "pressure", "q32": "performance", "q33": "intrinsic",
    "q34": "deep", "q35": "visual", "q36": "social",
    "q37": "stress", "q38": "organization", "q39": "learning",
    "q40": "association",
}
LATENT_CONSTRUCTS = sorted(set(QUESTION_LATENT.values()))


# --------------------------------------------------------------------------- #
# Synthetic data generation
# --------------------------------------------------------------------------- #
def generate_answers(n: int, rng: np.random.Generator) -> list[dict]:
    """Generate `n` respondents as dicts of {q1..q30: int in 1..5}."""
    # One latent trait per construct per respondent, uniform across the scale so
    # the full range of profiles is represented.
    latents = {
        c: rng.uniform(1.0, 5.0, size=n) for c in LATENT_CONSTRUCTS
    }
    answers_list: list[dict] = []
    for i in range(n):
        answers = {}
        for qid in QUESTION_IDS:
            base = latents[QUESTION_LATENT[qid]][i]
            val = base + rng.normal(0.0, NOISE_SD)
            answers[qid] = int(np.clip(round(val), 1, 5))
        answers_list.append(answers)
    return answers_list


def build_dataset(n: int):
    """Return (X, y_dict, scores_list, labels_list)."""
    rng = np.random.default_rng(RANDOM_STATE)
    answers_list = generate_answers(n, rng)

    x_rows, scores_list, labels_list = [], [], []
    y = {t: [] for t in TARGET_NAMES}

    for answers in answers_list:
        scores = compute_scores(answers)
        labels = assign_labels(scores)
        x_rows.append(features_vector(scores))
        scores_list.append(scores)
        labels_list.append(labels)
        for t in TARGET_NAMES:
            y[t].append(labels[t])

    X = np.array(x_rows, dtype=float)
    return X, y, scores_list, labels_list


# --------------------------------------------------------------------------- #
# Training & evaluation
# --------------------------------------------------------------------------- #
def class_distribution(values: list[str]) -> dict:
    out: dict = {}
    for v in values:
        out[v] = out.get(v, 0) + 1
    return dict(sorted(out.items(), key=lambda kv: kv[1], reverse=True))


def print_confusion(target: str, labels: list[str], cm: np.ndarray) -> None:
    width = max(len(l) for l in labels + ["pred->"]) + 2
    header = "".ljust(width) + "".join(l[:width - 1].ljust(width) for l in labels)
    print(f"  Confusion matrix ({target}) [rows = true, cols = predicted]:")
    print("    " + header)
    for i, row_label in enumerate(labels):
        row = row_label.ljust(width) + "".join(str(int(v)).ljust(width) for v in cm[i])
        print("    " + row)


def main() -> None:
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    print("=" * 70)
    print("PsyLearn Profiler — model training")
    print("=" * 70)
    print(f"Generating {N_SAMPLES} synthetic respondents...")

    X, y, _scores, _labels = build_dataset(N_SAMPLES)
    print(f"Feature matrix: {X.shape[0]} rows x {X.shape[1]} features")
    print(f"Features (order): {FEATURES}")
    print()

    # Shared train/test split (same rows for every target).
    idx = np.arange(X.shape[0])
    idx_train, idx_test = train_test_split(
        idx, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )
    X_train, X_test = X[idx_train], X[idx_test]
    print(f"Train rows: {len(idx_train)} | Test rows: {len(idx_test)}")
    print()

    models: dict = {}
    classes: dict = {}
    metrics: dict = {}
    distributions: dict = {}
    feature_importances: dict = {}

    for target in TARGET_NAMES:
        y_all = np.array(y[target])
        y_train, y_test = y_all[idx_train], y_all[idx_test]

        clf = RandomForestClassifier(
            n_estimators=N_ESTIMATORS,
            random_state=RANDOM_STATE,
            class_weight="balanced",
            n_jobs=-1,
        )
        clf.fit(X_train, y_train)
        y_pred = clf.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average="macro", zero_division=0)
        rec = recall_score(y_test, y_pred, average="macro", zero_division=0)
        f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)
        label_order = TARGETS[target]
        # Keep only labels that actually appear, in the documented order.
        present = [l for l in label_order if l in set(y_all)]
        cm = confusion_matrix(y_test, y_pred, labels=present)

        models[target] = clf
        classes[target] = list(clf.classes_)
        distributions[target] = class_distribution(list(y_all))
        feature_importances[target] = {
            feat: round(float(imp), 4)
            for feat, imp in zip(FEATURES, clf.feature_importances_)
        }
        metrics[target] = {
            "accuracy": round(float(acc), 4),
            "precision_macro": round(float(prec), 4),
            "recall_macro": round(float(rec), 4),
            "f1_macro": round(float(f1), 4),
            "labels": present,
            "confusion_matrix": cm.tolist(),
        }

        print("-" * 70)
        print(f"TARGET: {target}")
        print(f"  classes          : {present}")
        print(f"  full distribution: {distributions[target]}")
        print(f"  accuracy : {acc:.4f}")
        print(f"  precision: {prec:.4f} (macro)")
        print(f"  recall   : {rec:.4f} (macro)")
        print(f"  f1-score : {f1:.4f} (macro)")
        print_confusion(target, present, cm)
        print()

    # ------------------------------------------------------------------- #
    # Persist artifacts
    # ------------------------------------------------------------------- #
    trained_at = datetime.now(timezone.utc).isoformat()
    bundle = {
        "models": models,
        "features": list(FEATURES),
        "targets": list(TARGET_NAMES),
        "classes": classes,
        "model_type": "RandomForestClassifier",
        "version": __version__,
        "trained_at": trained_at,
        "n_samples": N_SAMPLES,
    }
    model_path = os.path.join(ARTIFACTS_DIR, "model.joblib")
    joblib.dump(bundle, model_path)

    metadata = {
        "model_type": "RandomForestClassifier",
        "version": __version__,
        "trained_at": trained_at,
        "n_samples": N_SAMPLES,
        "n_train": int(len(idx_train)),
        "n_test": int(len(idx_test)),
        "n_estimators": N_ESTIMATORS,
        "features": list(FEATURES),
        "targets": list(TARGET_NAMES),
        "classes": classes,
        "metrics": metrics,
        "feature_importances": feature_importances,
        "label_distributions": distributions,
        "data_note": (
            "Models are trained on SYNTHETIC data with rule-based labels. This is "
            "an educational prototype based on psychology course concepts, not a "
            "clinical or diagnostic instrument."
        ),
    }
    with open(os.path.join(ARTIFACTS_DIR, "model_metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    with open(os.path.join(ARTIFACTS_DIR, "features.json"), "w", encoding="utf-8") as f:
        json.dump({"features": list(FEATURES)}, f, indent=2)

    print("=" * 70)
    print("Saved artifacts:")
    print(f"  {model_path}")
    print(f"  {os.path.join(ARTIFACTS_DIR, 'model_metadata.json')}")
    print(f"  {os.path.join(ARTIFACTS_DIR, 'features.json')}")
    mean_acc = np.mean([metrics[t]["accuracy"] for t in TARGET_NAMES])
    print(f"Mean accuracy across all targets: {mean_acc:.4f}")
    print("Done.")


if __name__ == "__main__":
    main()
