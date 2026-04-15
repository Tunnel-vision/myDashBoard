from __future__ import annotations
from fastapi import APIRouter, Query

from app.database import get_snapshot_interval_secs
from app.routers.common import success_response
from app.utils import history_points

router = APIRouter(tags=["history"])


@router.get("/history")
def get_history(
    category: str = Query(default="all"),
    interval_secs: int = Query(default_factory=get_snapshot_interval_secs, ge=1),
) -> dict:
    if category not in {"all", "cpu", "memory", "disk", "network"}:
        return {
            "code": 40003,
            "message": "Invalid category query parameter",
            "data": None,
            "timestamp": success_response(None)["timestamp"],
        }

    base_values = {
        "all": 42.0,
        "cpu": 10.2,
        "memory": 62.5,
        "disk": 41.2,
        "network": 12.0,
    }
    data = {
        "category": category,
        "interval_secs": interval_secs,
        "points": history_points(base_values[category], interval_secs=interval_secs),
    }
    return success_response(data)
