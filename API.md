# myDashBoard — API Reference

**Base URL**: `http://localhost:8000`
**WebSocket URL**: `ws://localhost:8000/ws/metrics`
**API Version**: v1
**Timestamp Format**: ISO 8601 (e.g., `2026-04-14T10:30:00.000Z`)

---

## Standard Response Format

All REST endpoints return a unified wrapper:

```json
{
  "code": 0,
  "message": "success",
  "data": { ... },
  "timestamp": "2026-04-14T10:30:00.000Z"
}
```

### Error Response

```json
{
  "code": 40001,
  "message": "Sensor not available on this hardware",
  "data": null,
  "timestamp": "2026-04-14T10:30:00.000Z"
}
```

---

## REST Endpoints

### `GET /api/v1/cpu`

CPU processor information and usage.

**Response `data`:**

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `model` | string | — | CPU model name (e.g., "Apple M3 Pro") |
| `core_count` | integer | — | Total core count (performance + efficiency) |
| `cores` | array | — | Per-core usage |
| `cores[].index` | integer | — | Core index, 0-based |
| `cores[].usage_percent` | float | % | Usage for this core, 0–100 |
| `total_usage_percent` | float | % | Aggregate CPU usage, 0–100 |
| `temperature_celsius` | float | °C | CPU die temperature (null if unavailable) |
| `fan_speed_rpm` | integer[] | RPM | Fan speeds; empty array on fanless Macs |

**Example:**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "model": "Apple M3 Pro",
    "core_count": 11,
    "cores": [
      { "index": 0, "usage_percent": 12.5 },
      { "index": 1, "usage_percent": 8.3 }
    ],
    "total_usage_percent": 10.2,
    "temperature_celsius": 48.5,
    "fan_speed_rpm": [2156, 2012]
  },
  "timestamp": "2026-04-14T10:30:00.000Z"
}
```

---

### `GET /api/v1/memory`

Physical memory and swap usage.

**Response `data`:**

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `total_bytes` | integer | bytes | Total physical memory |
| `used_bytes` | integer | bytes | Currently in use |
| `free_bytes` | integer | bytes | Truly free memory |
| `usage_percent` | float | % | Used / Total × 100 |
| `pressure` | string | — | Memory pressure level: "normal", "warn", or "critical" |
| `swap_total_bytes` | integer | bytes | Total swap space |
| `swap_used_bytes` | integer | bytes | Swap currently consumed |
| `swap_free_bytes` | integer | bytes | Free swap space |
| `swap_usage_percent` | float | % | Swap usage percentage |

---

### `GET /api/v1/disk`

Disk partitions and I/O statistics.

**Response `data`:**

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `partitions` | array | — | List of mounted partitions |
| `partitions[].mountpoint` | string | — | Mount path (e.g., "/", "/Volumes/Data") |
| `partitions[].filesystem` | string | — | Filesystem type (apfs, hfs, ext4, ntfs, etc.) |
| `partitions[].total_bytes` | integer | bytes | Total capacity |
| `partitions[].used_bytes` | integer | bytes | Used space |
| `partitions[].free_bytes` | integer | bytes | Free space |
| `partitions[].usage_percent` | float | % | Used / Total × 100 |
| `io_stats` | object | — | Aggregate disk I/O counters |
| `io_stats.read_bytes_per_sec` | integer | B/s | Current read throughput |
| `io_stats.write_bytes_per_sec` | integer | B/s | Current write throughput |
| `io_stats.read_ops_per_sec` | integer | ops/s | Read operations per second |
| `io_stats.write_ops_per_sec` | integer | ops/s | Write operations per second |

---

### `GET /api/v1/gpu`

GPU utilization and memory. Supports Apple Silicon and Intel discrete GPUs.

**Response `data`:**

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `name` | string | — | GPU name (e.g., "Apple M3 Pro GPU") |
| `type` | string | — | "integrated" or "discrete" |
| `usage_percent` | float | % | GPU utilization, 0–100 |
| `memory_total_bytes` | integer | bytes | Total GPU memory |
| `memory_used_bytes` | integer | bytes | In-use GPU memory |
| `memory_usage_percent` | float | % | GPU memory utilization |
| `temperature_celsius` | float | °C | GPU temperature (null if unavailable) |
| `core_count` | integer | — | GPU core / shader count |

---

### `GET /api/v1/network`

Network interfaces and real-time throughput.

**Response `data`:**

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `interfaces` | array | — | All active network interfaces |
| `interfaces[].name` | string | — | Interface name (en0, en1, lo0…) |
| `interfaces[].type` | string | — | "wifi", "ethernet", or "loopback" |
| `interfaces[].ip_internal` | string | — | LAN IP address (null if unavailable) |
| `interfaces[].ip_external` | string | — | Public IP address (null if unavailable) |
| `interfaces[].download_bytes_per_sec` | integer | B/s | Current download speed |
| `interfaces[].upload_bytes_per_sec` | integer | B/s | Current upload speed |
| `interfaces[].signal_dbm` | integer | dBm | Wi-Fi RSSI signal strength (Wi-Fi only, null otherwise) |
| `interfaces[].link_speed_mbps` | integer | Mbps | Wi-Fi link rate (Wi-Fi only, null otherwise) |
| `total_download_bytes_per_sec` | integer | B/s | Sum of all interfaces' download speeds |
| `total_upload_bytes_per_sec` | integer | B/s | Sum of all interfaces' upload speeds |

---

### `GET /api/v1/battery`

Battery status and health (MacBook only; returns `is_present: false` on desktop Macs).

**Response `data`:**

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `is_present` | boolean | — | Whether battery hardware exists |
| `charge_percent` | integer | % | Current charge level, 0–100 |
| `is_charging` | boolean | — | Currently charging |
| `is_plugged_in` | boolean | — | AC power connected |
| `health_percent` | integer | % | `max_capacity_mah / design_capacity_mah × 100` |
| `cycle_count` | integer | — | Total charge cycles |
| `time_remaining_secs` | integer | s | Estimated runtime on battery (null if plugged in or unknown) |
| `time_to_full_secs` | integer | s | Estimated time to full charge (null if not charging) |
| `design_capacity_mah` | integer | mAh | Original design capacity |
| `max_capacity_mah` | integer | mAh | Current maximum capacity |
| `current_capacity_mah` | integer | mAh | Current charge level in mAh |
| `temperature_celsius` | float | °C | Battery surface temperature |
| `power_source` | string | — | "Battery", "AC Power", or "Unknown" |

---

### `GET /api/v1/sensors`

Thermal sensors and fan speeds via IOKit/SMC.

**Response `data`:**

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `cpu_temperature_celsius` | float | °C | CPU die temperature |
| `cpu_proximity_celsius` | float | °C | CPU proximity sensor reading |
| `motherboard_celsius` | float | °C | Motherboard/chipset temperature |
| `battery_temperature_celsius` | float | °C | Battery surface temperature |
| `gpu_temperature_celsius` | float | °C | GPU temperature |
| `fan_speeds_rpm` | array | — | Per-fan speed objects |
| `fan_speeds_rpm[].fan` | integer | — | Fan index (0-based) |
| `fan_speeds_rpm[].speed_rpm` | integer | RPM | Current speed |
| `fan_speeds_rpm[].min_rpm` | integer | RPM | Minimum rated speed |
| `fan_speeds_rpm[].max_rpm` | integer | RPM | Maximum rated speed |
| `throttling` | boolean | — | Whether CPU thermal throttling is active |

All temperature fields may be `null` if the sensor is unavailable on the current hardware.

---

### `GET /api/v1/system`

Operating system and machine identity.

**Response `data`:**

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `hostname` | string | — | System hostname |
| `os_version` | string | — | Full OS name + version (e.g., "macOS 14.4 (Sonoma)") |
| `kernel_version` | string | — | Darwin kernel version |
| `uptime_secs` | integer | s | Seconds elapsed since last boot |
| `load_avg_1m` | float | — | 1-minute system load average |
| `load_avg_5m` | float | — | 5-minute system load average |
| `load_avg_15m` | float | — | 15-minute system load average |
| `platform` | string | — | Always "darwin" on macOS |
| `arch` | string | — | CPU architecture: "arm64" or "x86_64" |
| `boot_time` | string | ISO8601 | Boot timestamp |

---

### `GET /api/v1/processes`

Top processes ranked by CPU and memory usage.

**Response `data`:**

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `cpu_top` | array | — | Top 10 processes by CPU usage |
| `cpu_top[].pid` | integer | — | Process ID |
| `cpu_top[].name` | string | — | Process executable name |
| `cpu_top[].cpu_percent` | float | % | Process CPU usage, 0–100×num_cores |
| `cpu_top[].memory_bytes` | integer | bytes | Resident memory (RSS) |
| `memory_top` | array | — | Top 10 processes by memory usage |
| `memory_top[].pid` | integer | — | Process ID |
| `memory_top[].name` | string | — | Process executable name |
| `memory_top[].cpu_percent` | float | % | Process CPU usage |
| `memory_top[].memory_bytes` | integer | bytes | Resident memory (RSS) |

---

### `GET /api/v1/all`

Returns all categories in a single response. Used for initial page load to avoid sequential requests.

**Response `data`:** An object containing all 9 category response objects: `cpu`, `memory`, `disk`, `gpu`, `network`, `battery`, `sensors`, `system`, `processes`.

---

### `GET /api/v1/history`

Query persisted time-series snapshots for historical charts.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | string | all | Target category: cpu, memory, disk, network |
| `from` | ISO8601 | 1 hour ago | Start of time range |
| `to` | ISO8601 | now | End of time range |
| `interval_secs` | integer | 300 | Minimum gap between returned points (seconds) |

**Response `data`:**

| Field | Type | Description |
|-------|------|-------------|
| `category` | string | The queried category |
| `interval_secs` | integer | The applied sampling interval |
| `points` | array | Time-series data points |
| `points[].timestamp` | string | ISO8601 timestamp |
| `points[].value` | float | Metric value at this point |

---

## WebSocket Endpoint

**Path**: `ws://localhost:8000/ws/metrics`

### Connection

Connect once on page load. The server begins broadcasting immediately after connection is established.

### Client → Server Messages

**Subscribe to categories:**
```json
{ "action": "subscribe", "categories": ["cpu", "memory", "network"] }
```

**Unsubscribe from categories:**
```json
{ "action": "unsubscribe", "categories": ["battery"] }
```

**Ping (keepalive):**
```json
{ "action": "ping" }
```

### Server → Client Messages

**Metrics broadcast (every 2 seconds):**
```json
{
  "type": "metrics",
  "timestamp": "2026-04-14T10:30:00.000Z",
  "interval_ms": 2000,
  "data": {
    "cpu": { ... },
    "memory": { ... },
    "network": { ... }
  }
}
```

**Pong response:**
```json
{ "type": "pong", "timestamp": "2026-04-14T10:30:00.000Z" }
```

**Error message:**
```json
{
  "type": "error",
  "code": 50001,
  "message": "GPU metrics unavailable on this system"
}
```

### Subscription Notes

- If no `subscribe` message is sent, the server broadcasts **all** categories.
- Sending `categories: ["all"]` subscribes to everything.
- The server remembers the subscription per WebSocket connection.
- If a subscribed category's data cannot be collected (e.g., no battery on desktop Mac), it is omitted from the broadcast with no error.

---

## Byte/Number Formatting Convention

All byte values are returned as raw integers in **bytes** (not KiB, MiB, GiB). Frontend is responsible for formatting:
- `< 1 KB`: show as `XXX B`
- `1–1023 KB`: show as `XXX.X KB`
- `≥ 1 MB`: show as `XXX.X MB` (or `XX.X GB` for large values)

Speed values (`bytes_per_sec`) use the same convention.

Temperature is always in **Celsius** with 1 decimal place.

Timestamps are always **UTC** ISO 8601 strings.
