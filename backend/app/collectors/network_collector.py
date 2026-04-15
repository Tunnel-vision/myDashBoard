def get_network_metrics() -> dict:
    return {
        "interfaces": [
            {
                "name": "en0",
                "type": "wifi",
                "ip_internal": "192.168.1.20",
                "ip_external": "203.0.113.10",
                "download_bytes_per_sec": 1258291,
                "upload_bytes_per_sec": 262144,
                "signal_dbm": -58,
                "link_speed_mbps": 1200,
            },
            {
                "name": "lo0",
                "type": "loopback",
                "ip_internal": "127.0.0.1",
                "ip_external": None,
                "download_bytes_per_sec": 0,
                "upload_bytes_per_sec": 0,
                "signal_dbm": None,
                "link_speed_mbps": None,
            },
        ],
        "total_download_bytes_per_sec": 1258291,
        "total_upload_bytes_per_sec": 262144,
    }
