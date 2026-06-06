"""
scoring.py
==========
Single source of truth for the PsyLearn Profiler questionnaire.

This module defines:
  * the 30 survey questions (grouped into 5 sections),
  * the Likert scale labels,
  * the 16 psychological sub-scores and how they are computed from the answers,
  * the ordered feature list used to train and query the ML model.

IMPORTANT (train/serve consistency):
The trainer (``train_model.py``) and the live API (``model_service.py``) both
import ``compute_scores`` and ``FEATURES`` from this file, so the features used
during training are *guaranteed* to be identical to the ones used at prediction
time.

This is an EDUCATIONAL prototype based on psychology course concepts
(learning, motivation, memory techniques, personality, stress). It is NOT a
clinical or diagnostic instrument.
"""

from __future__ import annotations

from typing import Dict, List

# --------------------------------------------------------------------------- #
# Likert scale
# --------------------------------------------------------------------------- #
LIKERT_MIN = 1
LIKERT_MAX = 5

LIKERT_LABELS: Dict[int, str] = {
    1: "Strongly disagree",
    2: "Disagree",
    3: "Neutral",
    4: "Agree",
    5: "Strongly agree",
}

# --------------------------------------------------------------------------- #
# Sections & questions
# --------------------------------------------------------------------------- #
SECTIONS: List[Dict[str, str]] = [
    {"id": "A", "title": "Motivation",
     "description": "Why you study and what drives you."},
    {"id": "B", "title": "Learning goals",
     "description": "What you focus on when you learn."},
    {"id": "C", "title": "Study style",
     "description": "How you actually study."},
    {"id": "D", "title": "Memory",
     "description": "How you best remember information."},
    {"id": "E", "title": "Personality and emotions",
     "description": "Your preferences, energy and stress."},
    {"id": "F", "title": "Real-life scenarios",
     "description": "Pick the picture that fits you best."},
]

# Each question: id ("q1".."q30"), section letter, and text.
QUESTIONS: List[Dict[str, str]] = [
    # Section A: Motivation (relatable, situational wording)
    {"id": "q1", "section": "A", "text": "Even when it won't be graded, I'll dig into a topic just because I'm curious."},
    {"id": "q2", "section": "A", "text": "A good grade is one of the biggest reasons I push myself."},
    {"id": "q3", "section": "A", "text": "Honestly, I get going mostly when someone's pushing me or a deadline looms."},
    {"id": "q4", "section": "A", "text": "I get excited about things I can actually use in real life."},
    {"id": "q5", "section": "A", "text": "If grades suddenly disappeared, I'd probably study a lot less."},
    {"id": "q6", "section": "A", "text": "Cracking a tough concept on my own gives me a real sense of satisfaction."},
    # Section B: Learning goals
    {"id": "q7", "section": "B", "text": "I'd rather truly understand something than just scrape a pass."},
    {"id": "q8", "section": "B", "text": "I worry that classmates might think I'm not capable."},
    {"id": "q9", "section": "B", "text": "It matters to me to do better than the people around me."},
    {"id": "q10", "section": "B", "text": "Mistakes don't really bother me — they're just part of learning."},
    {"id": "q11", "section": "B", "text": "When something gets hard, I tend to give up pretty quickly."},
    {"id": "q12", "section": "B", "text": "I actually enjoy a challenge, even when it's tough."},
    # Section C: Study style
    {"id": "q13", "section": "C", "text": "Let's be honest — I usually start studying at the last minute."},
    {"id": "q14", "section": "C", "text": "While studying, I make my own summaries, diagrams or notes."},
    {"id": "q15", "section": "C", "text": "Mostly I just reread the material a few times without analyzing it."},
    {"id": "q16", "section": "C", "text": "I try to link new information to things I already know."},
    {"id": "q17", "section": "C", "text": "I learn best from real examples and hands-on tasks."},
    {"id": "q18", "section": "C", "text": "I often get lost in the details and miss the main idea."},
    # Section D: Memory
    {"id": "q19", "section": "D", "text": "Things stick better when I tie them to images or places."},
    {"id": "q20", "section": "D", "text": "A story or a vivid association helps me remember."},
    {"id": "q21", "section": "D", "text": "For lists, I lean on first letters or little abbreviations."},
    {"id": "q22", "section": "D", "text": "If I read something just once without repeating it, I forget it."},
    {"id": "q23", "section": "D", "text": "Explaining something to someone else helps me remember it."},
    {"id": "q24", "section": "D", "text": "I need a clear visual order or structure to remember information."},
    # Section E: Personality and emotions
    {"id": "q25", "section": "E", "text": "Being around other people gives me energy."},
    {"id": "q26", "section": "E", "text": "I'd rather study alone, somewhere quiet."},
    {"id": "q27", "section": "E", "text": "I get anxious pretty easily before a test or exam."},
    {"id": "q28", "section": "E", "text": "When I've got a lot on my plate, I start to feel frustrated."},
    {"id": "q29", "section": "E", "text": "I'm usually organized and plan ahead."},
    {"id": "q30", "section": "E", "text": "Under stress, my focus tends to fall apart."},
    # Section F: Real-life scenarios (image-choice). Each option carries a value
    # (1-5) that feeds the same sub-scores as the Likert items.
    {"id": "q31", "section": "F", "type": "choice",
     "text": "When do you actually get your studying done?",
     "options": [
         {"value": 5, "label": "Mostly at the last minute, under pressure", "art": "alarm"},
         {"value": 3, "label": "A bit of both", "art": "balance"},
         {"value": 1, "label": "Early, on my own schedule", "art": "calendar"},
     ]},
    {"id": "q32", "section": "F", "type": "choice",
     "text": "What feels best after an exam?",
     "options": [
         {"value": 5, "label": "Scoring higher than others", "art": "trophy"},
         {"value": 3, "label": "A good grade for myself", "art": "medal"},
         {"value": 1, "label": "Finally understanding the topic", "art": "bulb"},
     ]},
    {"id": "q33", "section": "F", "type": "choice",
     "text": "With some free time, you would rather…",
     "options": [
         {"value": 5, "label": "Dive into a topic that fascinates you", "art": "compass"},
         {"value": 3, "label": "Review what class requires", "art": "book"},
         {"value": 1, "label": "Do something unrelated to studying", "art": "leaf"},
     ]},
    {"id": "q34", "section": "F", "type": "choice",
     "text": "Facing a hard chapter, you…",
     "options": [
         {"value": 5, "label": "Map how the ideas connect", "art": "nodes"},
         {"value": 3, "label": "Re-read it a few times", "art": "repeat"},
         {"value": 1, "label": "Highlight and memorize key lines", "art": "marker"},
     ]},
    {"id": "q35", "section": "F", "type": "choice",
     "text": "To remember directions or a list, you…",
     "options": [
         {"value": 5, "label": "Picture places or a mental map", "art": "mappin"},
         {"value": 3, "label": "Turn it into a rhyme or tune", "art": "note"},
         {"value": 1, "label": "Just repeat it until it sticks", "art": "repeat"},
     ]},
    {"id": "q36", "section": "F", "type": "choice",
     "text": "Your ideal place to study is…",
     "options": [
         {"value": 5, "label": "With a group or friends", "art": "group"},
         {"value": 3, "label": "With one study partner", "art": "pair"},
         {"value": 1, "label": "Alone, somewhere quiet", "art": "solo"},
     ]},
    {"id": "q37", "section": "F", "type": "choice",
     "text": "The night before a big exam, you feel…",
     "options": [
         {"value": 5, "label": "Very anxious and tense", "art": "pulse"},
         {"value": 3, "label": "A little nervous", "art": "wave"},
         {"value": 1, "label": "Calm and steady", "art": "leaf"},
     ]},
    {"id": "q38", "section": "F", "type": "choice",
     "text": "Your notes and study space are usually…",
     "options": [
         {"value": 5, "label": "Neatly organized and planned", "art": "grid"},
         {"value": 3, "label": "Somewhat tidy", "art": "folder"},
         {"value": 1, "label": "A bit chaotic", "art": "scatter"},
     ]},
    {"id": "q39", "section": "F", "type": "choice",
     "text": "When you make a mistake, you think…",
     "options": [
         {"value": 5, "label": "Great — now I'll learn from it", "art": "growth"},
         {"value": 3, "label": "Annoying, but it happens", "art": "neutral"},
         {"value": 1, "label": "Maybe I'm just not good at this", "art": "down"},
     ]},
    {"id": "q40", "section": "F", "type": "choice",
     "text": "New vocabulary sticks best when you…",
     "options": [
         {"value": 5, "label": "Build a story or vivid association", "art": "story"},
         {"value": 3, "label": "Write it out several times", "art": "pencil"},
         {"value": 1, "label": "Read the definition once", "art": "lines"},
     ]},
]

QUESTION_IDS: List[str] = [q["id"] for q in QUESTIONS]

# --------------------------------------------------------------------------- #
# Psychological sub-scores
# --------------------------------------------------------------------------- #
# Ordered feature list. The model is trained on these 16 values, in THIS order.
FEATURES: List[str] = [
    "intrinsic_motivation_score",
    "extrinsic_motivation_score",
    "pressure_motivation_score",
    "learning_goal_score",
    "performance_goal_score",
    "avoidance_goal_score",
    "deep_learning_score",
    "surface_learning_score",
    "last_minute_score",
    "memory_visual_score",
    "memory_association_score",
    "memory_repetition_score",
    "social_energy_score",
    "introversion_score",
    "stress_score",
    "organization_score",
]

# Human-friendly labels for charts / UI.
SCORE_LABELS: Dict[str, str] = {
    "intrinsic_motivation_score": "Intrinsic motivation",
    "extrinsic_motivation_score": "Extrinsic motivation",
    "pressure_motivation_score": "Pressure motivation",
    "learning_goal_score": "Learning goal",
    "performance_goal_score": "Performance goal",
    "avoidance_goal_score": "Avoidance goal",
    "deep_learning_score": "Deep learning",
    "surface_learning_score": "Surface learning",
    "last_minute_score": "Last-minute studying",
    "memory_visual_score": "Visual / spatial memory",
    "memory_association_score": "Association memory",
    "memory_repetition_score": "Repetition memory",
    "social_energy_score": "Social energy",
    "introversion_score": "Introversion",
    "stress_score": "Stress",
    "organization_score": "Organization",
}


def _r(value: float, ndigits: int = 3) -> float:
    """Round helper that keeps JSON output tidy."""
    return round(float(value), ndigits)


def _mean(*values: float) -> float:
    return sum(values) / len(values)


def _rev(value: float) -> float:
    """Reverse-code a 1..5 Likert item (1<->5, 2<->4, 3 stays 3)."""
    return (LIKERT_MAX + LIKERT_MIN) - value


def compute_scores(answers: Dict[str, int]) -> Dict[str, float]:
    """Convert the 30 raw Likert answers into the 16 psychological sub-scores.

    Every score is kept on the original 1..5 scale (it is an average of Likert
    items, with some items reverse-coded), which makes the scores directly
    comparable and easy to chart.

    Parameters
    ----------
    answers:
        Mapping of question id ("q1".."q30") to an integer 1..5.

    Returns
    -------
    dict
        The 16 sub-scores (rounded to 3 decimals).
    """
    a = {qid: float(answers[qid]) for qid in QUESTION_IDS}

    scores: Dict[str, float] = {
        # --- Motivation (A) + scenarios (F) ------------------------------ #
        "intrinsic_motivation_score": _mean(a["q1"], a["q4"], a["q6"], a["q33"]),
        "extrinsic_motivation_score": _mean(a["q2"], a["q5"]),
        "pressure_motivation_score": _mean(a["q3"], a["q31"]),
        # --- Learning goals (B) + scenarios ------------------------------ #
        "learning_goal_score": _mean(a["q7"], a["q10"], a["q12"], a["q39"]),
        "performance_goal_score": _mean(a["q8"], a["q9"], a["q32"]),
        # avoidance = gives up easily + (reverse) dislikes challenges
        "avoidance_goal_score": _mean(a["q11"], _rev(a["q12"])),
        # --- Study style (C) + scenarios --------------------------------- #
        "deep_learning_score": _mean(a["q14"], a["q16"], a["q17"], a["q34"]),
        "surface_learning_score": _mean(a["q15"], a["q18"]),
        # last-minute = crams + (reverse) not organized
        "last_minute_score": _mean(a["q13"], _rev(a["q29"])),
        # --- Memory (D) + scenarios -------------------------------------- #
        "memory_visual_score": _mean(a["q19"], a["q24"], a["q35"]),
        "memory_association_score": _mean(a["q20"], a["q23"], a["q40"]),
        "memory_repetition_score": _mean(a["q21"], a["q22"]),
        # --- Personality & emotions (E) + scenarios ---------------------- #
        "social_energy_score": _mean(a["q25"], a["q36"]),
        "introversion_score": _mean(a["q26"], _rev(a["q25"])),
        "stress_score": _mean(a["q27"], a["q28"], a["q30"], a["q37"]),
        "organization_score": _mean(a["q29"], a["q38"]),
    }
    return {k: _r(v) for k, v in scores.items()}


def features_vector(scores: Dict[str, float]) -> List[float]:
    """Return the sub-scores as a list in the exact FEATURES order."""
    return [float(scores[name]) for name in FEATURES]


def memory_method_signals(answers: Dict[str, int]) -> Dict[str, float]:
    """Per-method memory signals derived directly from the answers.

    Used only for transparency / explanation in the UI. The actual
    ``recommended_memory_method`` prediction is produced by the ML model
    (see ``labeling.py`` for the rule the model learns).
    """
    a = {qid: float(answers[qid]) for qid in QUESTION_IDS}
    return {
        "method_of_loci": _r(_mean(a["q19"], a["q24"])),
        "association_method": _r(a["q20"]),
        "story_method": _r(_mean(a["q20"], a["q23"])),
        "first_letter_method": _r(a["q21"]),
        "repetition": _r(a["q22"]),
        "teach_someone_else": _r(a["q23"]),
    }
