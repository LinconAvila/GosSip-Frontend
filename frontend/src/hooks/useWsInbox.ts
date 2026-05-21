

import { useEffect, useRef } from 'react'
import { WsClient } from '../api/ws'
import type { WsPresenceEvent } from '../api/ws'

import { usePresenceStore } from '../store/presenceStore'
import { useAuthStore } from '../store/authStore'
import type { PresenceStatus } from '../store/presenceStore'

export function useWsInbox(
  onNotification: () => void,
  onPresenceEvent?: (data: WsPresenceEvent) => void,
) {
  const wsRef = useRef<WsClient | null>(null)
  const setPresence = usePresenceStore((s) => s.setPresence)
  const currentUser = useAuthStore((s) => s.user)
 
  
  const onNotificationRef = useRef(onNotification)
  const onPresenceEventRef = useRef(onPresenceEvent)
 
  
  useEffect(() => {
    onNotificationRef.current = onNotification
    onPresenceEventRef.current = onPresenceEvent
  }, [onNotification, onPresenceEvent])
 
  useEffect(() => {
    const ws = new WsClient('inbox', {
      onNotification: () => {
        console.log('🔔 Nova notificação recebida via WebSocket!')
        onNotificationRef.current() 
      },
      
      
      onMessage: (msg) => {
        console.log('✉️ Nova mensagem/DM recebida em background!', msg)
        onNotificationRef.current() 
      },
      onPresence: (e) => {
        
        if (e.username === currentUser?.username) return
 
        setPresence(e.username, e.status as PresenceStatus, e.room_id)
 
        
        onPresenceEventRef.current?.(e) 
      },
    })

    ws.connect()
    wsRef.current = ws

    return () => {
      ws.disconnect()
      wsRef.current = null
    }
  }, [currentUser?.username, setPresence]) 

  return wsRef
}