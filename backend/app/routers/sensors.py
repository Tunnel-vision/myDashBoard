from fastapi import APIRouter

from app.collectors.sensor_collector import get_sensor_metrics
from app.routers.common import success_response

router = APIRouter(tags=["sensors"])


@router.get("/sensors")
def get_sensors() -> dict:
    return success_response(get_sensor_metrics())
