from fastapi import APIRouter

from app.collectors.system_collector import get_system_metrics
from app.routers.common import success_response

router = APIRouter(tags=["system"])


@router.get("/system")
def get_system() -> dict:
    return success_response(get_system_metrics())
