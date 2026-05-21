import { useEffect, useRef, useCallback } from 'react'
import { usePresenceStore, type PresenceStatus } from '../store/presenceStore'
import { api } from '../api/auth'
import { useAuthStore } from '../store/authStore'



const IDLE_TIMEOUT_MS  = 5 * 60 * 1000 
const IDLE_EVENTS      = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const



interface PresenceEntry {
  username: string
  status: PresenceStatus
  room_id: string | null
}

export function usePresence(
  sendStatusFn: ((payload: object) => void) | null,
  peerUsernames: string[] = [],
) {
  const myStatus      = usePresenceStore((s) => s.myStatus)
  const manualStatus  = usePresenceStore((s) => s.manualStatus)
  const setMyStatusIdle   = usePresenceStore((s) => s.setMyStatusIdle)
  const setMyStatusActive = usePresenceStore((s) => s.setMyStatusActive)
  const setMyStatus       = usePresenceStore((s) => s.setMyStatus)
  const setBulkPresence   = usePresenceStore((s) => s.setBulkPresence)
  const setPresence       = usePresenceStore((s) => s.setPresence)

  const currentUser   = useAuthStore((s) => s.user)
  const idleTimer     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSentStatus = useRef<PresenceStatus | null>(null)

  

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)

    
    setMyStatusActive()

    idleTimer.current = setTimeout(() => {
      
      setMyStatusIdle()
    }, IDLE_TIMEOUT_MS)
  }, [setMyStatusActive, setMyStatusIdle])

  useEffect(() => {
    IDLE_EVENTS.forEach((e) => window.addEventListener(e, resetIdleTimer, { passive: true }))
    resetIdleTimer() 

    return () => {
      IDLE_EVENTS.forEach((e) => window.removeEventListener(e, resetIdleTimer))
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [resetIdleTimer])

  

  useEffect(() => {
    if (!sendStatusFn) return
    if (lastSentStatus.current === myStatus) return

    lastSentStatus.current = myStatus
    sendStatusFn({ type: 'status', status: myStatus })
  }, [myStatus, sendStatusFn])

  

  useEffect(() => {
    if (!peerUsernames.length) return

    const names = peerUsernames
      .filter((u) => u !== currentUser?.username)
      .join(',')

    if (!names) return

    api
      .get<PresenceEntry[]>('/users/presence', { params: { usernames: names } })
      .then((r) => {
        setBulkPresence(
          r.data.map((e) => ({
            username: e.username,
            status: e.status,
            roomId: e.room_id,
          }))
        )
      })
      .catch(() => {
        
      })
  
  }, [peerUsernames.join(',')])

  

  const handlePresenceEvent = useCallback(
    (data: { username: string; status: string; room_id: string | null; room_name?: string | null }) => {
      
      
      setPresence(
        data.username,
        (data.status as PresenceStatus) || 'offline',
        data.room_id,
        data.room_name 
      )
    },
    [currentUser?.username, setPresence]
  )

  

  return {
    myStatus,
    manualStatus,
    setMyStatus,
    handlePresenceEvent,
  }
}

export function useUserPresence(username: string | null) {
  const presence = usePresenceStore(
    (s) => (username ? s.presences[username] : null)
  )
  return {
    status: (presence?.status ?? 'offline') as PresenceStatus,
    roomId: presence?.roomId ?? null,
  }
}