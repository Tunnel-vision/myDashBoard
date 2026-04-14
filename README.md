# myDashBoard

macOS System Monitoring Dashboard — a local, full-stack web dashboard that collects and visualizes real-time hardware and system resource information from your Mac.

![Dashboard Preview](https://via.placeholder.com/1200x400?text=myDashBoard+Preview)

## Features

**9 monitoring categories, all live:**

| Category | Metrics |
|----------|---------|
| **CPU** | Total usage, per-core usage, temperature, fan speed |
| **Memory** | Used/free/total, memory pressure, swap usage |
| **Disk** | Partition capacity, I/O read/write throughput, IOPS |
| **GPU** | Utilization, memory usage, temperature (Apple Silicon & Intel) |
| **Network** | Real-time upload/download speed, LAN/WAN IPs, Wi-Fi signal |
| **Battery** | Charge %, health, cycle count, time remaining (MacBook) |
| **Sensors** | CPU/GPU/motherboard/battery temperatures, fan RPMs, throttling |
| **System** | Hostname, OS version, uptime, load averages (1/5/15 min) |
| **Processes** | Top 10 by CPU, top 10 by memory |

**Real-time streaming** via WebSocket (2-second intervals), with REST API fallback.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | FastAPI + SQLAlchemy 2.x |
| Database | SQLite3 |
| Data Collection | psutil, IOKit, SMC |

## Prerequisites

- macOS (dashboard is macOS-specific due to data sources)
- Python 3.11+
- Node.js 18+

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Backend starts at `http://localhost:8000`. Verify it's running:

```bash
curl http://localhost:8000/api/v1/all
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`.

Open `http://localhost:5173` in your browser. The dashboard connects to the backend via WebSocket and begins displaying live metrics.

## Project Structure

```
myDashBoard/
├── backend/
│   ├── app/
│   │   ├── collectors/   # One collector per metric category
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routers/       # FastAPI routers (/api/v1/*, /ws/metrics)
│   │   └── schemas/        # Pydantic response models
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/           # HTTP client + WebSocket client
│   │   ├── components/   # Panel components + layout
│   │   ├── hooks/         # useMetrics (WebSocket), useApi (REST)
│   │   └── types/         # TypeScript interfaces
│   └── package.json
├── SPEC.md                # Full project specification
├── API.md                 # API reference documentation
└── CLAUDE.md              # Claude Code development guide
```

## API Documentation

Full API reference including all endpoints, request/response schemas, WebSocket protocol, and field definitions is available in [API.md](API.md).

## Supported Hardware

| Hardware | Data Source | Notes |
|----------|-------------|-------|
| Apple Silicon (M-series) | IOKit / SMC | Temperature via SMC keys |
| Intel Mac | IOKit / SMC + NVML | Discrete GPU via NVIDIA driver |
| MacBook Battery | IOKit SMC keys | `is_present: false` on desktop Macs |
| Intel Desktop Mac | Limited | No battery sensor; fan data varies |

## Development

See [CLAUDE.md](CLAUDE.md) for detailed development commands and architecture guidance.

## License

MIT
