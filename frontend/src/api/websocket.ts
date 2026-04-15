import type { WsClientMessage, WsServerMessage } from '../types/metrics'

const WS_BASE = import.meta.env.VITE_WS_BASE ?? 'ws://localhost:8000'

export class WebSocketClient extends EventTarget {
  private ws: WebSocket | null = null
  readonly url: string

  constructor(path = '/ws/metrics') {
    super()
    this.url = `${WS_BASE}${path}`
  }

  connect(): void {
    this.ws = new WebSocket(this.url)

    this.ws.addEventListener('open', () => {
      this.dispatchEvent(new Event('open'))
    })

    this.ws.addEventListener('message', evt => {
      try {
        const msg: WsServerMessage = JSON.parse(evt.data as string)
        this.dispatchEvent(new CustomEvent<WsServerMessage>('message', { detail: msg }))
      } catch {
        // ignore malformed frames
      }
    })

    this.ws.addEventListener('close', () => {
      this.dispatchEvent(new CloseEvent('close'))
    })

    this.ws.addEventListener('error', () => {
      this.dispatchEvent(new Event('error'))
    })
  }

  send(msg: WsClientMessage): void {
    this.ws?.readyState === WebSocket.OPEN && this.ws.send(JSON.stringify(msg))
  }

  subscribe(categories: string[]): void {
    this.send({ action: 'subscribe', categories })
  }

  unsubscribe(categories: string[]): void {
    this.send({ action: 'unsubscribe', categories })
  }

  ping(): void {
    this.send({ action: 'ping' })
  }

  close(): void {
    this.ws?.close()
    this.ws = null
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }
}
