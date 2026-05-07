"""Read-only endpoints exposing decision-engine metadata to the frontend."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.domain.engine import DecisionEngine, UnknownPathwayError, get_decision_engine
from app.schemas.pathway_schemas import PathwaysListResponse, QuestionsListResponse

router = APIRouter(tags=["decision-engine"])


@router.get("/questions", response_model=QuestionsListResponse)
def list_questions(
    engine: DecisionEngine = Depends(get_decision_engine),
) -> QuestionsListResponse:
    """Return the 10 questionnaire questions with options + trace."""
    return QuestionsListResponse(questions=engine.get_questions())


@router.get("/pathways", response_model=PathwaysListResponse)
def list_pathways(
    engine: DecisionEngine = Depends(get_decision_engine),
) -> PathwaysListResponse:
    """Return the 10 terminal pathways (LCSA-P1..P10)."""
    return PathwaysListResponse(pathways=engine.list_pathways())


@router.get("/pathways/{pathway_id}")
def get_pathway(
    pathway_id: str,
    engine: DecisionEngine = Depends(get_decision_engine),
):
    try:
        return engine.get_pathway(pathway_id)
    except UnknownPathwayError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)
        ) from exc
