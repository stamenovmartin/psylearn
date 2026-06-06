"""
recommendations.py
==================
Turns the predicted profile (plus a few raw sub-scores) into a list of concrete,
actionable study recommendations.

The recommendations are intentionally practical and encouraging. They are study
tips, not psychological advice.
"""

from __future__ import annotations

from typing import Dict, List

# Recommendations keyed by (target, label). Each entry is a list of tips.
_RULES: Dict[str, Dict[str, List[str]]] = {
    "motivation_type": {
        "intrinsic": [
            "Keep feeding your curiosity: pick one extra 'why' question for each topic.",
            "Use your interest as fuel by teaching or discussing what you learn.",
        ],
        "extrinsic": [
            "Try to connect the material with personal goals, not only grades.",
            "Set one internal learning goal before each study session.",
        ],
        "mixed": [
            "Balance grade goals with curiosity goals in the same study plan.",
            "Before studying, write one thing you want to *understand*, not just pass.",
        ],
        "pressure_based": [
            "Create gentle structure (a simple weekly plan) so you depend less on last-minute pressure.",
            "Reward small, self-set milestones to build motivation that does not rely on external control.",
        ],
    },
    "learning_orientation": {
        "learning_goal_oriented": [
            "Keep treating mistakes as feedback — review what each error teaches you.",
            "Set 'mastery' targets (e.g. 'I can explain this') rather than only score targets.",
        ],
        "performance_goal_oriented": [
            "Focus on progress and understanding, not only comparison with others.",
            "Use mistakes as feedback rather than proof of inability.",
        ],
        "avoidance_oriented": [
            "Break difficult tasks into very small steps so they feel less threatening.",
            "Start with a tiny win to build confidence before the harder parts.",
        ],
        "mixed_orientation": [
            "Notice when comparison helps you and when it stresses you, and adjust.",
            "Pair each performance goal with a learning goal for the same topic.",
        ],
    },
    "study_style": {
        "deep_learner": [
            "Keep linking new ideas to what you already know with concept maps.",
            "Challenge yourself to explain topics from memory without notes.",
        ],
        "surface_learner": [
            "Replace passive rereading with active recall.",
            "After reading, close the material and explain the concept in your own words.",
            "Use examples and concept maps.",
        ],
        "last_minute_learner": [
            "Split studying into smaller sessions across several days.",
            "Use spaced repetition instead of one long session before the exam.",
        ],
        "mixed_learner": [
            "Lean on your deep-learning habits for hard topics and quick review for easy ones.",
            "Plan a little earlier so you are not forced into last-minute sessions.",
        ],
    },
    "recommended_memory_method": {
        "method_of_loci": [
            "Place concepts in familiar locations and mentally walk through them.",
            "Use rooms, routes or objects as memory anchors.",
        ],
        "association_method": [
            "Connect new concepts with images, examples or previous knowledge.",
            "Build vivid mental links between a new term and something you already know.",
        ],
        "story_method": [
            "Turn lists or sequences into a short, memorable story.",
            "Give each item a role in the narrative so the order sticks.",
        ],
        "first_letter_method": [
            "Build acronyms or first-letter cues for ordered lists and terms.",
            "Group items into small chunks and make a cue for each chunk.",
        ],
        "repetition": [
            "Review material in spaced sessions rather than one long block.",
            "Use flashcards and self-testing to make repetition active.",
        ],
        "teach_someone_else": [
            "Explain each topic out loud to a friend, classmate, or even to yourself.",
            "Prepare a 2-minute 'mini-lesson' for the hardest concept.",
        ],
    },
    "personality_profile": {
        "introvert": [
            "Protect quiet, focused study blocks where you do your best thinking.",
            "Use short written reflections to consolidate what you learned.",
        ],
        "ambivert": [
            "Mix solo deep-work with occasional study groups depending on the task.",
            "Switch to discussion when energy dips and solo work when you need focus.",
        ],
        "extrovert": [
            "Use study groups or discussion to stay energized and engaged.",
            "Explain material aloud — talking through ideas helps you remember.",
        ],
    },
    "stress_risk": {
        "low": [
            "Keep your healthy routine — steady, regular study sessions work well for you.",
        ],
        "moderate": [
            "Add short breaks and breathing pauses between study blocks.",
            "Plan ahead a little more to keep stress from building before deadlines.",
        ],
        "high": [
            "Use shorter study blocks.",
            "Start with easier tasks to reduce frustration.",
            "Take breaks and avoid studying only under pressure.",
            "Remember: this app is an educational tool, not a mental-health service. "
            "If stress feels overwhelming, talk to someone you trust or a counselor.",
        ],
    },
}


def build_recommendations(
    predictions: Dict[str, str],
    scores: Dict[str, float],
) -> List[str]:
    """Assemble a de-duplicated, ordered list of personalized recommendations.

    We pull tips for every predicted label and add a couple of score-driven
    extras, then remove duplicates while preserving order.
    """
    tips: List[str] = []

    for target, label in predictions.items():
        tips.extend(_RULES.get(target, {}).get(label, []))

    # A few extra, score-driven nudges that complement the label-based tips.
    if scores.get("organization_score", 3) <= 2:
        tips.append("Try a simple weekly study planner — small structure goes a long way.")
    if scores.get("deep_learning_score", 3) >= 4 and scores.get("surface_learning_score", 0) >= 4:
        tips.append("You use many strategies — pick the one that fits each task instead of all at once.")
    if scores.get("memory_repetition_score", 0) >= 4:
        tips.append("You clearly benefit from review — schedule spaced repetition sessions in advance.")

    # De-duplicate while keeping order.
    seen = set()
    unique: List[str] = []
    for tip in tips:
        if tip not in seen:
            seen.add(tip)
            unique.append(tip)
    return unique
