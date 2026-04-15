from fastapi import APIRouter

from app.collectors.disk_collector import get_disk_metrics
from app.routers.common import success_response

router = APIRouter(tags=["disk"])


@router.get("/disk")
def get_disk() -> dict:
    return success_response(get_disk_metrics())
