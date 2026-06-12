# Root Dockerfile — builds the PsyLearn Profiler BACKEND API.
# Convenient single-service deploy target for Render / Railway / Fly.io:
# point the platform at this repository root with no extra configuration.
#
# (The frontend has its own Dockerfile in ./frontend, and docker-compose.yml
#  orchestrates both services for local use.)
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY backend/ .

# Produce model artifacts + seed demo analytics at build time.
RUN python train_model.py && python seed_data.py

EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
