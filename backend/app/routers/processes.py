from fastapi import APIRouter

from app.collectors.process_collector import get_process_metrics
from app.routers.common import success_response

router = APIRouter(tags=["processes"])


@router.get("/processes")
def get_processes() -> dict:
    return success_response(get_process_metrics())
