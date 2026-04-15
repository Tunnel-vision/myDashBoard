from __future__ import annotations
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import all as all_router
from app.routers import battery, cpu, disk, gpu, history, memory, network, processes, sensors, system, websocket

app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def healthcheck() -> dict:
    return {"status": "ok"}


app.include_router(cpu.router, prefix=settings.api_prefix)
app.include_router(memory.router, prefix=settings.api_prefix)
app.include_router(disk.router, prefix=settings.api_prefix)
app.include_router(gpu.router, prefix=settings.api_prefix)
app.include_router(network.router, prefix=settings.api_prefix)
app.include_router(battery.router, prefix=settings.api_prefix)
app.include_router(sensors.router, prefix=settings.api_prefix)
app.include_router(system.router, prefix=settings.api_prefix)
app.include_router(processes.router, prefix=settings.api_prefix)
app.include_router(all_router.router, prefix=settings.api_prefix)
app.include_router(history.router, prefix=settings.api_prefix)
app.include_router(websocket.router)
