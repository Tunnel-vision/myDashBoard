from fastapi import APIRouter

from app.collectors.cpu_collector import get_cpu_metrics
from app.routers.common import success_response

router = APIRouter(tags=["cpu"])


@router.get("/cpu")
def get_cpu() -> dict:
    return success_response(get_cpu_metrics())
