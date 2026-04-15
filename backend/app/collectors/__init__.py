from .battery_collector import get_battery_metrics
from .cpu_collector import get_cpu_metrics
from .disk_collector import get_disk_metrics
from .gpu_collector import get_gpu_metrics
from .memory_collector import get_memory_metrics
from .network_collector import get_network_metrics
from .process_collector import get_process_metrics
from .sensor_collector import get_sensor_metrics
from .system_collector import get_system_metrics


CATEGORY_COLLECTORS = {
    "cpu": get_cpu_metrics,
    "memory": get_memory_metrics,
    "disk": get_disk_metrics,
    "gpu": get_gpu_metrics,
    "network": get_network_metrics,
    "battery": get_battery_metrics,
    "sensors": get_sensor_metrics,
    "system": get_system_metrics,
    "processes": get_process_metrics,
}


ALL_CATEGORIES = tuple(CATEGORY_COLLECTORS.keys())
