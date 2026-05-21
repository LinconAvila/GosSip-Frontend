

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PresenceStatus = 'online' | 'idle' | 'dnd' | 'offline'

export interface PeerPresence {
  status: PresenceStatus
  roomId: string | null
  roomName: string | null
}

interface PresenceState {
  presences: Record<string, PeerPresence>
  myStatus: PresenceStatus
  
  
  manualStatus: PresenceStatus | null

  setPresence: (username: string, status: PresenceStatus, roomId: string | null, roomName?: string | null) => void
  setBulkPresence: (entries: Array<{ username: string; status: PresenceStatus; roomId: string | null }>) => void
  clearPresence: (username: string) => void

  setMyStatus: (status: PresenceStatus) => void
  setMyStatusIdle: () => void
  setMyStatusActive: () => void
  reset: () => void
}

export const usePresenceStore = create<PresenceState>()(
  persist(
    (set, get) => ({
      presences: {},
      myStatus: 'online',
      manualStatus: null,

      setPresence: (username, status, roomId, roomName) =>
        set((s) => ({
          presences: {
            ...s.presences,
            [username]: { status, roomId, roomName: roomName || null }, 
          },
        })),

      setBulkPresence: (entries) =>
        set((s) => {
          const next = { ...s.presences }
          for (const e of entries) {
            next[e.username] = { status: e.status, roomId: e.roomId }
          }
          return { presences: next }
        }),

      clearPresence: (username) =>
        set((s) => {
          const next = { ...s.presences }
          delete next[username]
          return { presences: next }
        }),

      
      setMyStatus: (status) => {
        if (status === 'online') {
          
          set({ myStatus: 'online', manualStatus: null })
        } else {
          
          set({ myStatus: status, manualStatus: status })
        }
      },

      setMyStatusIdle: () => {
        const { manualStatus } = get()
        
        if (manualStatus === null) {
          set({ myStatus: 'idle' })
        }
      },

      setMyStatusActive: () => {
        const { manualStatus, myStatus } = get()
        
        if (manualStatus === null && myStatus === 'idle') {
          set({ myStatus: 'online' })
        }
      },

      reset: () =>
        set({
          presences: {},
          myStatus: 'online',
          manualStatus: null,
        }),
    }),
    {
      name: 'chatroom-presence',
      partialize: (s) => ({
        myStatus: s.manualStatus ? s.manualStatus : 'online',
        manualStatus: s.manualStatus,
      }),
    }
  )
)

export const selectPeerPresence = (username: string) =>
  (s: PresenceState): PeerPresence =>
    s.presences[username] ?? { status: 'offline', roomId: null }

export const selectPeerStatus = (username: string) =>
  (s: PresenceState): PresenceStatus =>
    s.presences[username]?.status ?? 'offline'

export const selectPeerRoom = (username: string) =>
  (s: PresenceState): string | null =>
    s.presences[username]?.roomId ?? null