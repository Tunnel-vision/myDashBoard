from fastapi import APIRouter

from app.collectors.battery_collector import get_battery_metrics
from app.routers.common import success_response

router = APIRouter(tags=["battery"])


@router.get("/battery")
def get_battery() -> dict:
    return success_response(get_battery_metrics())
