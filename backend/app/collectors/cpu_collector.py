def get_cpu_metrics() -> dict:
    return {
        "model": "Apple M3 Pro",
        "core_count": 11,
        "cores": [
            {"index": 0, "usage_percent": 12.5},
            {"index": 1, "usage_percent": 8.3},
            {"index": 2, "usage_percent": 14.7},
            {"index": 3, "usage_percent": 10.1},
        ],
        "total_usage_percent": 10.2,
        "temperature_celsius": 48.5,
        "fan_speed_rpm": [2156, 2012],
    }
