from __future__ import annotations
import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.collectors import ALL_CATEGORIES, CATEGORY_COLLECTORS
from app.config import settings
from app.utils import isoformat_utc

router = APIRouter(tags=["websocket"])


def build_metrics_message(categories: tuple[str, ...] | list[str]) -> dict:
    return {
        "type": "metrics",
        "timestamp": isoformat_utc(),
        "interval_ms": settings.websocket_interval_ms,
        "data": {category: CATEGORY_COLLECTORS[category]() for category in categories if category in CATEGORY_COLLECTORS},
    }


@router.websocket("/ws/metrics")
async def metrics_websocket(websocket: WebSocket) -> None:
    await websocket.accept()
    subscribed_categories: tuple[str, ...] | list[str] = ALL_CATEGORIES
    await websocket.send_json(build_metrics_message(subscribed_categories))

    try:
        while True:
            message = await websocket.receive_text()
            payload = json.loads(message)
            action = payload.get("action")
            categories = payload.get("categories") or ["all"]

            if action == "ping":
                await websocket.send_json({"type": "pong", "timestamp": isoformat_utc()})
                continue

            if "all" in categories:
                subscribed_categories = ALL_CATEGORIES
            else:
                subscribed_categories = [category for category in categories if category in CATEGORY_COLLECTORS]

            if action in {"subscribe", "unsubscribe"}:
                await websocket.send_json(build_metrics_message(subscribed_categories))
            else:
                await websocket.send_json(
                    {"type": "error", "code": 50001, "message": "Unsupported websocket action"}
                )
    except WebSocketDisconnect:
        return
