"""
explanations.py
===============
Maps each predicted label to a short, plain-language explanation grounded in the
psychology course concepts (motivation, learning goals, study strategies, memory
techniques, personality, stress).

The language is deliberately educational and non-clinical.
"""

from __future__ import annotations

from typing import Dict

EXPLANATIONS: Dict[str, Dict[str, str]] = {
    "motivation_type": {
        "intrinsic": "You are mainly motivated by interest, understanding and personal growth.",
        "extrinsic": "You are mainly motivated by grades, rewards or external evaluation.",
        "mixed": "You combine internal interest with external goals.",
        "pressure_based": "You are strongly influenced by pressure, deadlines or control.",
    },
    "learning_orientation": {
        "learning_goal_oriented": "You focus on understanding, improvement and learning from mistakes.",
        "performance_goal_oriented": "You focus on grades, comparison and external performance.",
        "avoidance_oriented": "You may avoid difficult tasks because of fear of failure.",
        "mixed_orientation": "You show a combination of learning and performance motives.",
    },
    "study_style": {
        "deep_learner": "You connect concepts, analyze material and try to understand meaning.",
        "surface_learner": "You rely more on rereading and memorization without deeper processing.",
        "last_minute_learner": "You tend to study under time pressure.",
        "mixed_learner": "You use a combination of strategies.",
    },
    "recommended_memory_method": {
        "method_of_loci": "Best when you benefit from spatial or visual organization.",
        "association_method": "Best when you remember through connections and associations.",
        "story_method": "Best when you remember sequences through narrative structure.",
        "first_letter_method": "Best when you need to remember ordered lists or terms.",
        "repetition": "Best when you need repeated exposure and practice.",
        "teach_someone_else": "Best when you remember by explaining material.",
    },
    "personality_profile": {
        "introvert": "You prefer independent study and quieter environments.",
        "ambivert": "You can work both independently and socially depending on context.",
        "extrovert": "You gain energy from interaction and may benefit from group learning.",
    },
    "stress_risk": {
        "low": "You report relatively stable concentration and low frustration.",
        "moderate": "You sometimes experience stress that may affect learning.",
        "high": "You report stress, frustration or anxiety that can reduce concentration.",
    },
}

# Friendly display names for each memory method (used by the UI).
MEMORY_METHOD_TITLES: Dict[str, str] = {
    "method_of_loci": "Method of Loci (Memory Palace)",
    "association_method": "Association Method",
    "story_method": "Story Method",
    "first_letter_method": "First-Letter Method",
    "repetition": "Spaced Repetition",
    "teach_someone_else": "Teach Someone Else",
}


def explain(predictions: Dict[str, str]) -> Dict[str, str]:
    """Return one explanation per predicted target.

    Unknown labels fall back to an empty string rather than raising, so the API
    stays robust even if the label space ever changes.
    """
    result: Dict[str, str] = {}
    for target, label in predictions.items():
        result[target] = EXPLANATIONS.get(target, {}).get(label, "")
    return result
