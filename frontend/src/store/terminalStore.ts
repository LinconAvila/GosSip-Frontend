

import { create } from 'zustand'
import { fetchDebugLogs } from '../api/debug_terminal'

interface TerminalState {
  logs: string[]
  error: string | null
  isPolling: boolean
  autoScroll: boolean
  
  
  addLogs: (newLogs: string[]) => void
  setError: (error: string | null) => void
  setAutoScroll: (enabled: boolean) => void
  startPolling: () => void
  stopPolling: () => void
  fetch: () => Promise<void>
}

let pollInterval: ReturnType<typeof setInterval> | null = null

export const useTerminalStore = create<TerminalState>((set, get) => ({
  logs: [],
  error: null,
  isPolling: false,
  autoScroll: true,

  addLogs: (incoming) => {
    set((state) => {
      const current = state.logs
      if (incoming.length === 0) return state

      
      let overlap = 0
      const maxCheck = Math.min(current.length, incoming.length)
      
      for (let i = maxCheck; i > 0; i--) {
        const suffix = current.slice(-i)
        const prefix = incoming.slice(0, i)
        if (suffix.every((val, index) => val === prefix[index])) {
          overlap = i
          break
        }
      }

      const uniqueNew = incoming.slice(overlap)
      if (uniqueNew.length === 0) return state

      
      return { logs: [...current, ...uniqueNew].slice(-1000) }
    })
  },

  setError: (error) => set({ error }),
  setAutoScroll: (autoScroll) => set({ autoScroll }),

  fetch: async () => {
    try {
      const data = await fetchDebugLogs()
      get().addLogs(data)
      set({ error: null })
    } catch (e) {
      set({ error: 'Erro ao buscar logs' })
    }
  },

  startPolling: () => {
    if (get().isPolling) return
    
    set({ isPolling: true })
    get().fetch()
    
    pollInterval = setInterval(() => {
      get().fetch()
    }, 2000) 
  },

  stopPolling: () => {
    if (pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
    set({ isPolling: false })
  }
}))
