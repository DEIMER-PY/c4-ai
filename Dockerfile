# Multi-stage Dockerfile for C4 AI
FROM ghcr.io/astral-sh/uv:0.13.0 AS uv
FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_LINK_MODE=copy \
    C4_ENV=production

WORKDIR /app

# Copy uv from astral-sh image
COPY --from=uv /uv /uvx /bin/

# Install build dependencies
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project --no-dev

# Copy application code
COPY c4 ./c4
COPY apps/api ./apps/api
COPY datasets ./datasets
COPY scripts ./scripts

# Sync project
RUN uv sync --frozen --no-dev

EXPOSE 8000

CMD ["uv", "run", "c4-api", "--port", "8000"]
