# Dev-only image. Production hardening is out of scope for Sprint 1.
FROM python:3.12-alpine

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Build deps for psutil/uvloop and other native wheels (cheap on alpine).
RUN apk add --no-cache build-base libffi-dev

COPY pyproject.toml ./
COPY app ./app
COPY tests ./tests
COPY README.md ./

RUN pip install -e ".[dev]"

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
