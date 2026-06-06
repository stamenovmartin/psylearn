"""
schemas.py
==========
Pydantic v2 request/response models for the PsyLearn Profiler API.

These models give us automatic input validation (every answer must be an integer
1..5 and all 30 questions must be present) and self-documenting OpenAPI schemas.
"""

from __future__ import annotations

from typing import Dict, List, Optional

from pydantic import BaseModel, Field, field_validator

from .scoring import LIKERT_MAX, LIKERT_MIN, QUESTION_IDS

_QUESTION_SET = set(QUESTION_IDS)


# --------------------------------------------------------------------------- #
# /questions
# --------------------------------------------------------------------------- #
class OptionOut(BaseModel):
    value: int
    label: str
    art: str


class QuestionOut(BaseModel):
    id: str
    section: str
    text: str
    type: str = "likert"
    options: Optional[List[OptionOut]] = None


class SectionOut(BaseModel):
    id: str
    title: str
    description: str
    questions: List[QuestionOut]


class QuestionsResponse(BaseModel):
    likert_labels: Dict[int, str]
    sections: List[SectionOut]
    total_questions: int


# --------------------------------------------------------------------------- #
# /predict
# --------------------------------------------------------------------------- #
class PredictRequest(BaseModel):
    """The 30 Likert answers, keyed q1..q30, each an integer 1..5."""

    answers: Dict[str, int] = Field(
        ...,
        description="Mapping of question id (q1..q40) to a value 1..5.",
        examples=[{f"q{i}": 3 for i in range(1, 41)}],
    )

    @field_validator("answers")
    @classmethod
    def _validate_answers(cls, value: Dict[str, int]) -> Dict[str, int]:
        keys = set(value.keys())
        missing = _QUESTION_SET - keys
        unknown = keys - _QUESTION_SET
        if missing:
            raise ValueError(
                f"Missing answers for: {', '.join(sorted(missing))}."
            )
        if unknown:
            raise ValueError(
                f"Unknown question ids: {', '.join(sorted(unknown))}."
            )
        for qid, val in value.items():
            if not isinstance(val, int) or val < LIKERT_MIN or val > LIKERT_MAX:
                raise ValueError(
                    f"Answer for {qid} must be an integer between "
                    f"{LIKERT_MIN} and {LIKERT_MAX}."
                )
        return value


class PredictResponse(BaseModel):
    scores: Dict[str, float]
    predictions: Dict[str, str]
    explanations: Dict[str, str]
    recommendations: List[str]
    memory_signals: Dict[str, float]
    disclaimer: str


# --------------------------------------------------------------------------- #
# /feedback
# --------------------------------------------------------------------------- #
class FeedbackRequest(BaseModel):
    """Anonymous feedback about the app experience (no personal identifiers)."""

    rating: int = Field(..., ge=1, le=5, description="1..5 star rating.")
    comment: Optional[str] = Field(
        default=None, max_length=1000, description="Optional free-text comment."
    )
    helpful: Optional[bool] = Field(
        default=None, description="Did the user find the result helpful?"
    )


class FeedbackResponse(BaseModel):
    status: str
    message: str


# --------------------------------------------------------------------------- #
# /health
# --------------------------------------------------------------------------- #
class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str
    targets: List[str]


# --------------------------------------------------------------------------- #
# /analytics
# --------------------------------------------------------------------------- #
class AnalyticsSummary(BaseModel):
    total_surveys: int
    motivation_type_distribution: Dict[str, int]
    study_style_distribution: Dict[str, int]
    stress_risk_distribution: Dict[str, int]
    avg_intrinsic_motivation_score: float
    avg_extrinsic_motivation_score: float
    avg_deep_learning_score: float
    avg_surface_learning_score: float
    most_recommended_memory_method: Optional[str]


class AnalyticsDistributions(BaseModel):
    total_surveys: int
    distributions: Dict[str, Dict[str, int]]
    average_scores: Dict[str, float]
