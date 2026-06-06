"""
labeling.py
===========
Transparent, rule-based label assignment.

The ML model in this project does NOT invent labels from nowhere. We generate a
synthetic dataset of questionnaire answers, compute the 16 sub-scores, and then
assign each of the 6 target labels using the *explicit, human-readable rules*
below. The RandomForest classifier then learns to reproduce these rules from the
sub-scores.

Keeping the rules in one place means:
  * the training labels are reproducible and auditable,
  * a professor can read exactly how each profile is defined,
  * the behaviour is defensible as an *educational* (not clinical) tool.

All sub-scores are on a 1..5 scale.
"""

from __future__ import annotations

from typing import Dict, List

# The 6 prediction targets and their allowed classes. Order of classes matters
# only for documentation; the model stores its own class order.
TARGETS: Dict[str, List[str]] = {
    "motivation_type": ["intrinsic", "extrinsic", "mixed", "pressure_based"],
    "learning_orientation": [
        "learning_goal_oriented",
        "performance_goal_oriented",
        "avoidance_oriented",
        "mixed_orientation",
    ],
    "study_style": [
        "deep_learner",
        "surface_learner",
        "last_minute_learner",
        "mixed_learner",
    ],
    "recommended_memory_method": [
        "method_of_loci",
        "association_method",
        "story_method",
        "first_letter_method",
        "repetition",
        "teach_someone_else",
    ],
    "personality_profile": ["introvert", "ambivert", "extrovert"],
    "stress_risk": ["low", "moderate", "high"],
}

TARGET_NAMES: List[str] = list(TARGETS.keys())

# Tuning thresholds (kept as named constants so they are easy to read/adjust).
_DOMINANCE = 0.5     # how much one score must exceed another to "win"
_HIGH = 3.5          # a score this high counts as clearly elevated
_PERSONALITY_GAP = 1.0
_STRESS_HIGH = 3.5
_STRESS_LOW = 2.5


def label_motivation_type(s: Dict[str, float]) -> str:
    intrinsic = s["intrinsic_motivation_score"]
    extrinsic = s["extrinsic_motivation_score"]
    pressure = s["pressure_motivation_score"]

    # Pressure dominates when it is high AND at least as strong as the others.
    if pressure >= _HIGH and pressure >= intrinsic and pressure >= extrinsic:
        return "pressure_based"
    if intrinsic - extrinsic >= _DOMINANCE:
        return "intrinsic"
    if extrinsic - intrinsic >= _DOMINANCE:
        return "extrinsic"
    return "mixed"


def label_learning_orientation(s: Dict[str, float]) -> str:
    learning = s["learning_goal_score"]
    performance = s["performance_goal_score"]
    avoidance = s["avoidance_goal_score"]

    if avoidance >= _HIGH and avoidance >= learning and avoidance >= performance:
        return "avoidance_oriented"
    if learning - performance >= _DOMINANCE:
        return "learning_goal_oriented"
    if performance - learning >= _DOMINANCE:
        return "performance_goal_oriented"
    return "mixed_orientation"


def label_study_style(s: Dict[str, float]) -> str:
    deep = s["deep_learning_score"]
    surface = s["surface_learning_score"]
    last_minute = s["last_minute_score"]

    if last_minute >= _HIGH and last_minute >= deep and last_minute >= surface:
        return "last_minute_learner"
    if deep - surface >= _DOMINANCE:
        return "deep_learner"
    if surface - deep >= _DOMINANCE:
        return "surface_learner"
    return "mixed_learner"


def label_recommended_memory_method(s: Dict[str, float]) -> str:
    """Pick a memory technique from the three memory sub-scores.

    The dominant memory channel decides the family of techniques; secondary
    scores refine the exact method so that all six methods are reachable and
    the rule is fully derivable from the model's features.
    """
    visual = s["memory_visual_score"]
    association = s["memory_association_score"]
    repetition = s["memory_repetition_score"]

    dominant = max(visual, association, repetition)

    if dominant == visual:
        # Strong visual / spatial memory -> mental "places".
        return "method_of_loci"

    if dominant == repetition:
        # Rehearsal-oriented. Organized learners do well with structured,
        # list-like mnemonics (first letters); otherwise plain repetition.
        if s["organization_score"] >= _HIGH:
            return "first_letter_method"
        return "repetition"

    # dominant == association -> elaborative family.
    if s["social_energy_score"] >= _HIGH:
        return "teach_someone_else"
    if s["deep_learning_score"] >= _HIGH:
        return "story_method"
    return "association_method"


def label_personality_profile(s: Dict[str, float]) -> str:
    diff = s["social_energy_score"] - s["introversion_score"]
    if diff >= _PERSONALITY_GAP:
        return "extrovert"
    if diff <= -_PERSONALITY_GAP:
        return "introvert"
    return "ambivert"


def label_stress_risk(s: Dict[str, float]) -> str:
    stress = s["stress_score"]
    if stress >= _STRESS_HIGH:
        return "high"
    if stress >= _STRESS_LOW:
        return "moderate"
    return "low"


def assign_labels(scores: Dict[str, float]) -> Dict[str, str]:
    """Apply all six rules and return the full label set."""
    return {
        "motivation_type": label_motivation_type(scores),
        "learning_orientation": label_learning_orientation(scores),
        "study_style": label_study_style(scores),
        "recommended_memory_method": label_recommended_memory_method(scores),
        "personality_profile": label_personality_profile(scores),
        "stress_risk": label_stress_risk(scores),
    }
