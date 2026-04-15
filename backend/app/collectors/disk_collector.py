def get_disk_metrics() -> dict:
    return {
        "partitions": [
            {
                "mountpoint": "/",
                "filesystem": "apfs",
                "total_bytes": 1000204886016,
                "used_bytes": 412316860416,
                "free_bytes": 587888025600,
                "usage_percent": 41.2,
            }
        ],
        "io_stats": {
            "read_bytes_per_sec": 5242880,
            "write_bytes_per_sec": 3145728,
            "read_ops_per_sec": 128,
            "write_ops_per_sec": 97,
        },
    }
