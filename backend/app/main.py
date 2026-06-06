"""
main.py
=======
FastAPI application exposing the PsyLearn Profiler API.

Endpoints
---------
  GET  /health                  service + model status
  GET  /questions               the 30 questions grouped by section
  POST /predict                 score answers and predict the profile
  GET  /analytics/summary       headline aggregate analytics
  GET  /analytics/distributions full label distributions + average scores
  POST /feedback                store anonymous feedback

CORS is configured from the ALLOWED_ORIGINS environment variable
(comma-separated list, or "*" to allow any origin in development).
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from . import __version__, database
from .benchmarks import get_world_benchmark
from .explanations import MEMORY_METHOD_TITLES
from .labeling import TARGETS
from .model_service import DISCLAIMER, load_metadata, model_service
from .scoring import LIKERT_LABELS, QUESTIONS, SCORE_LABELS, SECTIONS
from .schemas import (
    AnalyticsDistributions,
    AnalyticsSummary,
    FeedbackRequest,
    FeedbackResponse,
    HealthResponse,
    PredictRequest,
    PredictResponse,
    QuestionsResponse,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize the database and load the ML model once at startup."""
    database.init_db()
    try:
        model_service.load()
    except Exception as exc:  # noqa: BLE001
        # The app still starts so /health can report the problem clearly.
        app.state.model_error = str(exc)
    else:
        app.state.model_error = None
    yield


app = FastAPI(
    title="PsyLearn Profiler API",
    version=__version__,
    description=(
        "Educational psychology + ML prototype. Converts a 30-item Likert "
        "questionnaire into learning-psychology sub-scores and predicts six "
        "educational profiles. NOT a clinical or diagnostic tool."
    ),
    lifespan=lifespan,
)


def _configure_cors(application: FastAPI) -> None:
    raw = os.environ.get("ALLOWED_ORIGINS", "*").strip()
    if raw == "*" or raw == "":
        origins = ["*"]
    else:
        origins = [o.strip() for o in raw.split(",") if o.strip()]
    application.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )


_configure_cors(app)


# --------------------------------------------------------------------------- #
# Routes
# --------------------------------------------------------------------------- #
@app.get("/", tags=["meta"])
def root() -> dict:
    return {
        "name": "PsyLearn Profiler API",
        "version": __version__,
        "docs": "/docs",
        "disclaimer": DISCLAIMER,
    }


@app.get("/health", response_model=HealthResponse, tags=["meta"])
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        model_loaded=model_service.is_loaded,
        version=__version__,
        targets=model_service.targets,
    )


@app.get("/questions", response_model=QuestionsResponse, tags=["survey"])
def get_questions() -> QuestionsResponse:
    """Return the 30 questions grouped into their five sections."""
    by_section = {s["id"]: [] for s in SECTIONS}
    for q in QUESTIONS:
        by_section[q["section"]].append(q)

    sections = [
        {
            "id": s["id"],
            "title": s["title"],
            "description": s["description"],
            "questions": by_section[s["id"]],
        }
        for s in SECTIONS
    ]
    return QuestionsResponse(
        likert_labels=LIKERT_LABELS,
        sections=sections,
        total_questions=len(QUESTIONS),
    )


@app.post("/predict", response_model=PredictResponse, tags=["survey"])
def predict(payload: PredictRequest) -> PredictResponse:
    """Score the answers and predict the educational-psychology profile."""
    if not model_service.is_loaded:
        raise HTTPException(
            status_code=503,
            detail=(
                "Model is not loaded. Run `python train_model.py` in the backend "
                "folder, then restart the server."
            ),
        )
    try:
        result = model_service.predict(payload.answers)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")
    return PredictResponse(**result)


@app.get("/analytics/summary", response_model=AnalyticsSummary, tags=["analytics"])
def analytics_summary() -> AnalyticsSummary:
    """Headline aggregate analytics across all anonymous submissions."""
    avg = database.average_scores()
    return AnalyticsSummary(
        total_surveys=database.count_surveys(),
        motivation_type_distribution=database.distribution("motivation_type"),
        study_style_distribution=database.distribution("study_style"),
        stress_risk_distribution=database.distribution("stress_risk"),
        avg_intrinsic_motivation_score=avg["intrinsic_motivation_score"],
        avg_extrinsic_motivation_score=avg["extrinsic_motivation_score"],
        avg_deep_learning_score=avg["deep_learning_score"],
        avg_surface_learning_score=avg["surface_learning_score"],
        most_recommended_memory_method=database.most_common("recommended_memory_method"),
    )


@app.get("/analytics/distributions", response_model=AnalyticsDistributions, tags=["analytics"])
def analytics_distributions() -> AnalyticsDistributions:
    """Full label distributions and average sub-scores for the dashboard."""
    distributions = {target: database.distribution(target) for target in TARGETS}
    return AnalyticsDistributions(
        total_surveys=database.count_surveys(),
        distributions=distributions,
        average_scores=database.average_scores(),
    )


@app.get("/model/insights", tags=["model"])
def model_insights() -> dict:
    """Expose the trained model's metrics, feature importances and confusion
    matrices (read from model_metadata.json) for the Model Insights page."""
    metadata = load_metadata()
    if not metadata:
        raise HTTPException(
            status_code=503,
            detail="Model metadata not available. Run `python train_model.py` first.",
        )
    return metadata


@app.get("/benchmark/world", tags=["analytics"])
def benchmark_world() -> dict:
    """Real-world Big Five norms (public-domain dataset) + the sub-score mapping,
    used to compare a user's scores against a real population."""
    data = get_world_benchmark()
    if not data:
        raise HTTPException(
            status_code=503,
            detail="World norms not available. Run `python build_world_norms.py` first.",
        )
    return data


@app.get("/analytics/correlations", tags=["analytics"])
def analytics_correlations() -> dict:
    """Pearson correlation matrix of the 16 sub-scores across all stored surveys."""
    import numpy as np

    rows = database.fetch_all_scores()
    features = database.SCORE_COLUMNS
    labels = [SCORE_LABELS.get(f, f) for f in features]
    if len(rows) < 3:
        return {"features": features, "labels": labels, "matrix": [], "n": len(rows)}

    arr = np.array(rows, dtype=float)
    with np.errstate(invalid="ignore", divide="ignore"):
        corr = np.corrcoef(arr, rowvar=False)
    corr = np.nan_to_num(corr)
    matrix = [[round(float(v), 2) for v in row] for row in corr]
    return {"features": features, "labels": labels, "matrix": matrix, "n": len(rows)}


@app.post("/feedback", response_model=FeedbackResponse, tags=["meta"])
def submit_feedback(payload: FeedbackRequest) -> FeedbackResponse:
    """Store anonymous feedback about the experience (no personal data)."""
    try:
        database.insert_feedback(payload.rating, payload.comment, payload.helpful)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Could not save feedback: {exc}")
    return FeedbackResponse(status="ok", message="Thank you for your feedback!")


@app.get("/meta/labels", tags=["meta"])
def label_metadata() -> dict:
    """Expose label spaces and display labels (handy for the frontend)."""
    return {
        "targets": TARGETS,
        "score_labels": SCORE_LABELS,
        "memory_method_titles": MEMORY_METHOD_TITLES,
        "likert_labels": LIKERT_LABELS,
    }
