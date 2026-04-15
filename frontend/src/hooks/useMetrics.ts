import { useCallback, useEffect, useRef, useState } from 'react'
import { WebSocketClient } from '../api/websocket'
import { apiFetch } from '../api/client'
import { Endpoints } from '../api/endpoints'
import type {
  AllMetricsData,
  ConnectionStatus,
  MetricsState,
  WsMetricsMessage,
  WsServerMessage,
} from '../types/metrics'

const RECONNECT_DELAY_MS = 3000
const PING_INTERVAL_MS = 30000

export interface UseMetricsReturn {
  metrics: MetricsState
  status: ConnectionStatus
}

export function useMetrics(): UseMetricsReturn {
  const [metrics, setMetrics] = useState<MetricsState>({})
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const wsRef = useRef<WebSocketClient | null>(null)
  const pingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load initial snapshot via REST
  const loadInitial = useCallback(async () => {
    try {
      const res = await apiFetch<AllMetricsData>(Endpoints.all)
      if (res.code === 0 && res.data) {
        setMetrics(res.data)
      }
    } catch {
      // non-fatal — WS may still connect
    }
  }, [])

  // Merge incremental WS update into state
  const applyUpdate = useCallback((msg: WsMetricsMessage) => {
    setMetrics(prev => ({ ...prev, ...msg.data }))
  }, [])

  const connect = useCallback(() => {
    setStatus('connecting')
    const ws = new WebSocketClient()
    wsRef.current = ws

    ws.addEventListener('open', () => {
      setStatus('connected')
      ws.subscribe(['all'])
      // Heartbeat
      pingRef.current = setInterval(() => ws.ping(), PING_INTERVAL_MS)
    })

    ws.addEventListener('message', ((evt: MessageEvent) => {
      try {
        const msg: WsServerMessage = JSON.parse(evt.data as string)
        if (msg.type === 'metrics') {
          applyUpdate(msg as WsMetricsMessage)
        }
      } catch {
        // ignore malformed frames
      }
    }) as EventListener)

    ws.addEventListener('close', () => {
      setStatus('reconnecting')
      if (pingRef.current) clearInterval(pingRef.current)
      reconnectRef.current = setTimeout(connect, RECONNECT_DELAY_MS)
    })

    ws.addEventListener('error', () => {
      setStatus('reconnecting')
    })

    ws.connect()
  }, [applyUpdate])

  useEffect(() => {
    loadInitial()
    connect()
    return () => {
      wsRef.current?.close()
      if (pingRef.current) clearInterval(pingRef.current)
      if (reconnectRef.current) clearTimeout(reconnectRef.current)
    }
  }, [connect, loadInitial])

  return { metrics, status }
}
