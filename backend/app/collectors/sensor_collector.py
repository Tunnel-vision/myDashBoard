def get_sensor_metrics() -> dict:
    return {
        "cpu_temperature_celsius": 48.5,
        "cpu_proximity_celsius": 44.9,
        "motherboard_celsius": 39.1,
        "battery_temperature_celsius": 31.4,
        "gpu_temperature_celsius": 46.2,
        "fan_speeds_rpm": [
            {"fan": 0, "speed_rpm": 2156, "min_rpm": 1200, "max_rpm": 5500},
            {"fan": 1, "speed_rpm": 2012, "min_rpm": 1200, "max_rpm": 5500},
        ],
        "throttling": False,
    }
