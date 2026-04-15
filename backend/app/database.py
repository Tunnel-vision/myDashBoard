from __future__ import annotations
from .config import settings


class InMemoryDatabase:
    def __init__(self) -> None:
        self.history: list[dict] = []


database = InMemoryDatabase()


def get_history() -> list[dict]:
    return database.history


def get_snapshot_interval_secs() -> int:
    return settings.history_default_interval_secs
