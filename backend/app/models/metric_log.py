from __future__ import annotations
from dataclasses import dataclass


@dataclass
class MetricSnapshot:
    category: str
    metric_name: str
    value: float
    metadata: dict | None = None


@dataclass
class SystemInfo:
    hostname: str
    cpu_model: str
    total_memory_bytes: int
    os_version: str
    arch: str
    first_seen_at: str
