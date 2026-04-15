from fastapi import APIRouter

from app.collectors.network_collector import get_network_metrics
from app.routers.common import success_response

router = APIRouter(tags=["network"])


@router.get("/network")
def get_network() -> dict:
    return success_response(get_network_metrics())
