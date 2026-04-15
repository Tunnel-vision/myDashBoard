const BASE = '/api/v1'

export const Endpoints = {
  cpu: `${BASE}/cpu`,
  memory: `${BASE}/memory`,
  disk: `${BASE}/disk`,
  gpu: `${BASE}/gpu`,
  network: `${BASE}/network`,
  battery: `${BASE}/battery`,
  sensors: `${BASE}/sensors`,
  system: `${BASE}/system`,
  processes: `${BASE}/processes`,
  all: `${BASE}/all`,
  history: `${BASE}/history`,
} as const
