# myDashBoard — Project Specification

## Overview

macOS System Monitoring Dashboard — a full-stack, local-running web dashboard that collects and visualizes real-time hardware and system resource information from the host Mac.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Frontend Charts | Recharts |
| Frontend CSS | Tailwind CSS |
| Backend | FastAPI (Python 3.11+) |
| ORM | SQLAlchemy 2.x |
| Database | SQLite3 |
| Data Collection | psutil, IOKit, SMC, subprocess |

## 1. System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  macOS System   │────▶│  FastAPI Backend │────▶│  React Frontend     │
│  (data sources) │     │  (port 8000)     │     │  (Vite, port 5173)  │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
                               │
                          SQLite DB
                      (historical snapshots)
```

### 1.1 Data Flow

1. **Backend** collects macOS metrics via `psutil`, `IOKit`, SMC calls, and shell commands (`sysctl`, `netstat`, `iostat`)
2. **Backend** exposes metrics via REST endpoints (one-shot) and WebSocket (streaming)
3. **Frontend** connects via WebSocket for real-time 2-second updates; uses REST for initial page load
4. **SQLite** persists time-series snapshots at 5-minute intervals for historical charts

### 1.2 Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Backend API | 8000 | `http://localhost:8000` |
| Backend WebSocket | 8000 | `ws://localhost:8000/ws/metrics` |
| Frontend Dev | 5173 | `http://localhost:5173` |

### 1.3 CORS

Backend allows CORS for `http://localhost:5173` (Vite dev server) and `http://localhost:5174` (Vite preview).

---

## 2. Directory Structure

```
myDashBoard/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application entry
│   │   ├── config.py            # Settings (PORT, CORS origins, snapshot interval)
│   │   ├── database.py          # SQLAlchemy engine + scoped session
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── metric_log.py   # metric_snapshots + system_info tables
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── cpu.py           # GET /api/v1/cpu
│   │   │   ├── memory.py        # GET /api/v1/memory
│   │   │   ├── disk.py          # GET /api/v1/disk
│   │   │   ├── gpu.py           # GET /api/v1/gpu
│   │   │   ├── network.py       # GET /api/v1/network
│   │   │   ├── battery.py       # GET /api/v1/battery
│   │   │   ├── sensors.py       # GET /api/v1/sensors
│   │   │   ├── system.py        # GET /api/v1/system
│   │   │   ├── processes.py     # GET /api/v1/processes
│   │   │   ├── all.py           # GET /api/v1/all
│   │   │   ├── history.py       # GET /api/v1/history
│   │   │   └── websocket.py     # WS /ws/metrics
│   │   ├── collectors/          # One collector per metric category
│   │   │   ├── __init__.py
│   │   │   ├── cpu_collector.py
│   │   │   ├── memory_collector.py
│   │   │   ├── disk_collector.py
│   │   │   ├── gpu_collector.py
│   │   │   ├── network_collector.py
│   │   │   ├── battery_collector.py
│   │   │   ├── sensor_collector.py
│   │   │   ├── system_collector.py
│   │   │   └── process_collector.py
│   │   └── schemas/
│   │       ├── __init__.py
│   │       └── responses.py     # Pydantic BaseModel response schemas
│   ├── data/
│   │   └── metrics.db           # SQLite database (gitignored)
│   ├── requirements.txt
│   └── run.py                   # uvicorn launcher script
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/
│   │   │   ├── client.ts         # fetch wrapper with base URL
│   │   │   ├── endpoints.ts      # Endpoint URL constants
│   │   │   └── websocket.ts      # WebSocket client class
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Dashboard.tsx # Main grid layout
│   │   │   │   └── Header.tsx    # Title bar with hostname + uptime
│   │   │   └── panels/           # One panel per metric category
│   │   │       ├── CpuPanel.tsx
│   │   │       ├── MemoryPanel.tsx
│   │   │       ├── DiskPanel.tsx
│   │   │       ├── GpuPanel.tsx
│   │   │       ├── NetworkPanel.tsx
│   │   │       ├── BatteryPanel.tsx
│   │   │       ├── SensorPanel.tsx
│   │   │       ├── SystemPanel.tsx
│   │   │       └── ProcessPanel.tsx
│   │   ├── hooks/
│   │   │   ├── useMetrics.ts     # WebSocket data subscription hook
│   │   │   └── useApi.ts         # REST polling hook (fallback)
│   │   ├── types/
│   │   │   └── metrics.ts        # TypeScript interfaces matching API responses
│   │   └── styles/
│   │       └── globals.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── CLAUDE.md
├── README.md
└── SPEC.md
```

---

## 3. Monitored Categories

| Category | Refresh | Data Source |
|----------|---------|-------------|
| CPU | 2s (WS) | `psutil.cpu_percent()`, per-core via `_psutil_cpu_percent_per_cpu()` |
| Memory | 2s (WS) | `psutil.virtual_memory()`, `psutil.swap_memory()` |
| Disk | 10s (WS) | `psutil.disk_usage()`, `psutil.disk_io_counters()` |
| GPU | 5s (WS) | `IOKit` / `SMC` (Apple Silicon); `nvml` (Intel discrete) |
| Network | 2s (WS) | `psutil.net_io_counters()`, `netstat`, external IP via HTTP |
| Battery | 5s (WS) | `IOKit` / SMC battery SMC keys |
| Sensors | 5s (WS) | `IOKit` SMC temperature/fan keys |
| System | 30s (WS) | `platform`, `os`, `socket.gethostname()`, `os.getloadavg()` |
| Processes | 5s (WS) | `psutil.process_iter()` sorted by cpu_percent / memory_bytes |

---

## 4. Database Schema

### Table: `metric_snapshots`

Persisted every 5 minutes. Used for historical chart queries. Not used for real-time display.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | Integer | PRIMARY KEY AUTOINCREMENT |
| `created_at` | DateTime | NOT NULL, indexed |
| `category` | String(32) | NOT NULL, indexed |
| `metric_name` | String(64) | NOT NULL |
| `value` | Float | NOT NULL |
| `metadata` | JSON | Nullable — stores core index, interface name, etc. |

Unique constraint on `(category, metric_name, created_at)` prevents duplicate snapshots.

### Table: `system_info`

One row per unique machine (identified by hostname + boot_time). Updated on each app start.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | Integer | PRIMARY KEY AUTOINCREMENT |
| `hostname` | String(256) | NOT NULL |
| `cpu_model` | String(256) | NOT NULL |
| `total_memory_bytes` | BigInteger | NOT NULL |
| `os_version` | String(128) | NOT NULL |
| `arch` | String(32) | NOT NULL |
| `first_seen_at` | DateTime | NOT NULL |

---

## 5. Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| 0 | 200 | Success |
| 40001 | 404 | Resource not found (e.g., no battery on desktop Mac) |
| 40002 | 503 | Sensor data unavailable on this hardware |
| 40003 | 400 | Invalid query parameter |
| 50001 | 500 | Internal metric collection error |
| 50002 | 500 | WebSocket broadcast error |

---

## 6. Implementation Phases

### Phase 1: Backend Skeleton
- Initialize FastAPI app with CORS, health check endpoint
- Create all router stubs returning structured mock data matching API.md
- Verify: `uvicorn app.main:app --reload --port 8000` starts without errors

### Phase 2: Backend Collectors
- Implement all 9 collectors using `psutil`, `IOKit`, `SMC`, and subprocess
- Replace router mock data with real collector calls
- Add SQLite snapshot persistence on a background scheduler (5-min interval)

### Phase 3: WebSocket
- Implement `/ws/metrics` endpoint with category subscribe/unsubscribe
- Background task collects and broadcasts all metrics every 2 seconds

### Phase 4: Frontend Skeleton
- `npm create vite@latest frontend -- --template react-ts`
- Install: `axios`, `zustand`, `recharts`, `tailwindcss`, `clsx`
- Configure Tailwind CSS
- Create `src/types/metrics.ts` with all TypeScript interfaces
- Build `src/api/client.ts`, `endpoints.ts`, `websocket.ts`

### Phase 5: Frontend Panels
- Implement 9 panel components, each consuming data from the WebSocket hook
- Use Recharts: `AreaChart` for CPU/memory trends, `PieChart` for disk usage, `BarChart` for process rankings, `RadialBarChart` for battery gauge

### Phase 6: Polish
- Responsive full-screen grid layout
- Dark theme matching a "监控大屏" aesthetic
- Update `README.md` and `CLAUDE.md` with real commands

---

## 7. Verification

| Check | Command | Expected |
|-------|---------|---------|
| Backend starts | `cd backend && python run.py` | No errors, `Uvicorn running on http://localhost:8000` |
| REST API | `curl http://localhost:8000/api/v1/all` | JSON with all 9 categories, `code: 0` |
| WebSocket | Browser DevTools → `ws://localhost:8000/ws/metrics` | Receives messages every ~2s |
| Frontend build | `cd frontend && npm run build` | Zero TypeScript errors |
| Frontend loads | `http://localhost:5173` | Dashboard renders with live data |
| Historical data | `curl "http://localhost:8000/api/v1/history?category=cpu"` | Time-series points returned |
