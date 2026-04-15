from fastapi import APIRouter

from app.collectors import CATEGORY_COLLECTORS
from app.utils import isoformat_utc

router = APIRouter(prefix="/api/v1")


def success_response(data: object) -> dict:
    return {
        "code": 0,
        "message": "success",
        "data": data,
        "timestamp": isoformat_utc(),
    }


def collect_category(category: str) -> dict:
    return CATEGORY_COLLECTORS[category]()
