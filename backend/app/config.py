from __future__ import annotations
from dataclasses import dataclass, field


@dataclass
class Settings:
    app_name: str = "myDashBoard API"
    api_prefix: str = "/api/v1"
    backend_port: int = 8000
    cors_origins: list = field(default_factory=lambda: ["http://localhost:5173", "http://localhost:5174"])
    websocket_interval_ms: int = 2000
    history_default_interval_secs: int = 300


settings = Settings()
