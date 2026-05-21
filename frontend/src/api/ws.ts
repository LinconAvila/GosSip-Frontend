// src/src/api/ws.ts

import { useAuthStore } from '../store/authStore'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080'

export type WsStatus = 'connecting' | 'connected' | 'disconnected'

export interface WsMessageEvent {
  type: 'message'
  room_id?: string
  content: string
  sender: string
  recipient?: string
  msg_id: string
}

export interface WsHistoryEvent {
  type: 'history'
  messages: WsHistoryMessage[]
}

export interface WsHistoryMessage {
  id: string
  content: string
  sender: string
  created_at: string
}

export interface WsTypingEvent {
  type: 'typing'
  username: string
  is_typing: boolean
}

export interface WsReactEvent {
  type: 'react'
  msg_id: string
  emoji: string
  username: string
}

export interface WsJoinLeaveEvent {
  type: 'join' | 'leave'
  username: string
}

export interface WsErrorEvent {
  type: 'error'
  code: string
  detail: string
}

export interface WsNotificationEvent {
  type: 'notification'
}

export interface WsPresenceEvent {
  type: 'presence'
  username: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  room_id: string | null
}

export interface WsOnlineCountEvent {
  type: 'online_count'
  count: number
  event: 'join' | 'leave'
  username: string
}
export type WsEvent =
  | WsMessageEvent
  | WsHistoryEvent
  | WsTypingEvent
  | WsReactEvent
  | WsJoinLeaveEvent
  | WsErrorEvent
  |  WsNotificationEvent
  | WsPresenceEvent
  | WsOnlineCountEvent 
  | { type: 'pong' }

export interface WsHandlers {
  onMessage?: (e: WsMessageEvent) => void
  onHistory?: (messages: WsHistoryMessage[]) => void
  onTyping?: (isTyping: boolean, username: string) => void 
  onReact?: (msgId: string, emoji: string) => void
  onJoin?: (username: string) => void
  onLeave?: (username: string) => void
  onError?: (e: WsErrorEvent) => void
  onNotification?: () => void
  onPresence?: (e: WsPresenceEvent) => void
  onStatusChange?: (status: WsStatus) => void
  onOnlineCount?: (count: number) => void
}

export class WsClient {
  ws: WebSocket | null = null
  private stopped = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private pingInterval: ReturnType<typeof setInterval> | null = null

  constructor(
    private readonly path: string,
    private readonly handlers: WsHandlers,
  ) {}

  private get token(): string | null {
    return useAuthStore.getState().token
  }

  private buildUrl(): string {
    const token = this.token
    return `${WS_URL}/ws/${this.path}?token=${token}`
  }

  connect(): void {
    if (!this.token) {
      console.warn('[WsClient] Sem token — conexão abortada')
      return
    }

    this.stopped = false
    this.handlers.onStatusChange?.('connecting')

    const ws = new WebSocket(this.buildUrl())
    this.ws = ws

    ws.onopen = () => {
      this.handlers.onStatusChange?.('connected')
      this.startPing()
    }

    ws.onmessage = (event: MessageEvent) => {
      let data: WsEvent
      try {
        data = JSON.parse(event.data as string) as WsEvent
      } catch {
        console.warn('[WsClient] Payload inválido:', event.data)
        return
      }
      this.dispatch(data)
    }

    ws.onclose = (event: CloseEvent) => {
      this.stopPing()
      this.handlers.onStatusChange?.('disconnected')

      if (event.code === 1008) {
        console.error('[WsClient] Acesso negado. Não vai reconectar.')
        return
      }

      if (!this.stopped) {
        this.reconnectTimer = setTimeout(() => this.connect(), 3_000)
      }
    }

    ws.onerror = () => {}
  }

  disconnect(): void {
    this.stopped = true
    this.stopPing()
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.ws?.close()
    this.ws = null
  }

  send(payload: object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload))
    }
  }

  sendStatus(status: 'online' | 'idle' | 'dnd'): void {
    this.send({ type: 'status', status })
  }

  sendMessage(content: string): void {
    this.send({ type: 'message', content })
  }

  sendTyping(isTyping: boolean): void {
    this.send({ type: 'typing', is_typing: isTyping })
  }

  sendReact(msgId: string, emoji: string): void {
    this.send({ type: 'react', msg_id: msgId, emoji })
  }

  // ─── Internos (Distribuição de Eventos) ──────────────────────────────────

  private dispatch(data: WsEvent): void {
      switch (data.type) {
        case 'message':      this.handlers.onMessage?.(data);                          break
        case 'history':      this.handlers.onHistory?.(data.messages);                 break
        case 'typing':       this.handlers.onTyping?.(data.is_typing, data.username);  break
        case 'react':        this.handlers.onReact?.(data.msg_id, data.emoji);         break
        case 'join':         this.handlers.onJoin?.(data.username);                    break
        case 'leave':        this.handlers.onLeave?.(data.username);                   break
        case 'error':        this.handlers.onError?.(data);                            break
        case 'notification': this.handlers.onNotification?.();                         break
        case 'presence':     this.handlers.onPresence?.(data);                         break
        case 'online_count': this.handlers.onOnlineCount?.(data.count);        break // 🔥 PONTE PLUGADA AQUI!
      case 'pong':                                                                   break
      }
    }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' })
    }, 30_000)
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }
}