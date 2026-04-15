from __future__ import annotations
from datetime import datetime, timedelta, timezone


ISO_TIMESTAMP_FORMAT = "%Y-%m-%dT%H:%M:%S.%f"


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def isoformat_utc(value: datetime | None = None) -> str:
    current = value or now_utc()
    return current.astimezone(timezone.utc).strftime(ISO_TIMESTAMP_FORMAT)[:-3] + "Z"


def history_points(base_value: float, count: int = 12, interval_secs: int = 300) -> list[dict[str, float | str]]:
    start = now_utc() - timedelta(seconds=interval_secs * (count - 1))
    points: list[dict[str, float | str]] = []
    for index in range(count):
        timestamp = start + timedelta(seconds=interval_secs * index)
        delta = ((index % 5) - 2) * 1.7
        points.append(
            {
                "timestamp": isoformat_utc(timestamp),
                "value": round(max(base_value + delta, 0.0), 1),
            }
        )
    return points
