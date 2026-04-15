from __future__ import annotations
from fastapi import APIRouter

from app.collectors import ALL_CATEGORIES, CATEGORY_COLLECTORS
from app.routers.common import success_response

router = APIRouter(tags=["all"])


@router.get("/all")
def get_all() -> dict:
    return success_response({category: CATEGORY_COLLECTORS[category]() for category in ALL_CATEGORIES})
