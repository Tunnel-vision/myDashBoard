import type { ApiResponse } from '../types/metrics'
import { MockData } from './mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' // default true
const API_BASE = import.meta.env.VITE_API_BASE ?? ''

const MOCK_DELAY_MS = 100

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function apiFetch<T>(endpoint: string): Promise<ApiResponse<T>> {
  if (USE_MOCK && MockData[endpoint]) {
    await delay(MOCK_DELAY_MS)
    return MockData[endpoint]() as ApiResponse<T>
  }
  const res = await fetch(`${API_BASE}${endpoint}`)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API ${endpoint} failed ${res.status}: ${body}`)
  }
  return res.json() as Promise<ApiResponse<T>>
}
