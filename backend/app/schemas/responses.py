from __future__ import annotations
from pydantic import BaseModel


class ApiResponse(BaseModel):
    code: int
    message: str
    data: object | None
    timestamp: str


class WebSocketMessage(BaseModel):
    type: str
    timestamp: str
    interval_ms: int | None = None
    data: dict[str, object] | None = None
    code: int | None = None
    message: str | None = None
