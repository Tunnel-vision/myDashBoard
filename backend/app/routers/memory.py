from fastapi import APIRouter

from app.collectors.memory_collector import get_memory_metrics
from app.routers.common import success_response

router = APIRouter(tags=["memory"])


@router.get("/memory")
def get_memory() -> dict:
    return success_response(get_memory_metrics())
