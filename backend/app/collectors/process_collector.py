def get_process_metrics() -> dict:
    return {
        "cpu_top": [
            {"pid": 120, "name": "Xcode", "cpu_percent": 48.2, "memory_bytes": 2147483648},
            {"pid": 341, "name": "Google Chrome", "cpu_percent": 31.6, "memory_bytes": 1717986918},
            {"pid": 812, "name": "node", "cpu_percent": 18.9, "memory_bytes": 536870912},
        ],
        "memory_top": [
            {"pid": 120, "name": "Xcode", "cpu_percent": 48.2, "memory_bytes": 2147483648},
            {"pid": 341, "name": "Google Chrome", "cpu_percent": 31.6, "memory_bytes": 1717986918},
            {"pid": 77, "name": "WindowServer", "cpu_percent": 7.4, "memory_bytes": 805306368},
        ],
    }
