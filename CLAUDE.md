# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

macOS System Monitoring Dashboard — a full-stack local web dashboard that collects and visualizes real-time hardware/system metrics from the host Mac.

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Recharts
- **Backend**: FastAPI (Python 3.11+) + SQLAlchemy 2.x + SQLite3
- **Architecture**: REST API + WebSocket for real-time streaming

## Commands

### Backend

```bash
# Install dependencies
cd backend && pip install -r requirements.txt

# Run development server
cd backend && python run.py

# Or directly via uvicorn
cd backend && uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
# Install dependencies
cd frontend && npm install

# Run development server (proxies /api/* and /ws to backend on :8000)
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview
```

### Run a Single Test

```bash
# Backend tests
cd backend && pytest

# Frontend tests
cd frontend && npm test
```

## Architecture Summary

### Backend Structure (`backend/app/`)

- **`collectors/`** — One Python module per metric category. Each collector is a stateless function that reads system data and returns a dict. Collectors use `psutil` (CPU, memory, disk, network, processes), `IOKit`/`SMC` (temperature, fans, battery), and `subprocess` for shell commands.
- **`routers/`** — One FastAPI router per category (`/api/v1/cpu`, `/api/v1/memory`, etc.). Each router depends on the corresponding collector. Also includes `websocket.py` (`/ws/metrics`) and `all.py` (batch endpoint).
- **`schemas/responses.py`** — Pydantic `BaseModel` schemas matching the API contract defined in `API.md`.
- **`models/metric_log.py`** — SQLAlchemy models: `metric_snapshots` (time-series history, 5-min snapshots) and `system_info` (machine identity).
- **`main.py`** — FastAPI app factory. Registers routers, configures CORS, manages WebSocket connections, starts the snapshot scheduler.

### Frontend Structure (`frontend/src/`)

- **`types/metrics.ts`** — TypeScript interfaces for every API response shape. Must stay in sync with `API.md`.
- **`api/client.ts`** — Base fetch wrapper with automatic JSON parsing and error handling.
- **`api/websocket.ts`** — WebSocket client class managing connect/subscribe/broadcast lifecycle.
- **`hooks/useMetrics.ts`** — React hook that manages WebSocket lifecycle and exposes reactive metric state.
- **`components/panels/`** — One panel component per metric category. Each receives its data slice from `useMetrics` and renders charts with Recharts.

### Data Flow

1. Frontend loads → fetches `GET /api/v1/all` for initial data
2. Frontend opens WebSocket `ws://localhost:8000/ws/metrics`
3. Backend broadcasts all subscribed categories every 2 seconds
4. Frontend `useMetrics` hook updates React state on each WebSocket message
5. Panels re-render with new data; Recharts animates transitions

## Key Files

| File | Purpose |
|------|---------|
| `SPEC.md` | Full project specification |
| `API.md` | REST + WebSocket interface contracts |
| `backend/app/main.py` | FastAPI application entry point |
| `backend/app/collectors/*.py` | System metric collection logic |
| `frontend/src/types/metrics.ts` | TypeScript interfaces for all API responses |
| `frontend/src/hooks/useMetrics.ts` | WebSocket data subscription hook |

## Implementation Status

- [x] SPEC.md and API.md documentation
- [ ] Phase 1: Backend skeleton (stub routers with mock data)
- [ ] Phase 2: Backend collectors (real psutil/IOKit/SMC implementation)
- [ ] Phase 3: WebSocket streaming
- [ ] Phase 4: Frontend skeleton (Vite + Tailwind + Recharts + types)
- [ ] Phase 5: Frontend panels (all 9 metric panels)
- [ ] Phase 6: Polish (responsive layout, README, CLAUDE.md finalization)
