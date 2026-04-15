from fastapi import APIRouter

from app.collectors.gpu_collector import get_gpu_metrics
from app.routers.common import success_response

router = APIRouter(tags=["gpu"])


@router.get("/gpu")
def get_gpu() -> dict:
    return success_response(get_gpu_metrics())
