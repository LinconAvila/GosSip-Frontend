import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthStore {
  token: string | null
  refreshToken: string | null
  user: User | null
  setAuth: (token: string, refreshToken: string, user: User) => void
  setUser: (user: User) => void   
  clear: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token:        null,
      refreshToken: null,
      user:         null,

      setAuth: (token, refreshToken, user) =>
        set({ token, refreshToken, user }),

      setUser: (user) =>
        set({ user }),

      clear: () =>
        set({ token: null, refreshToken: null, user: null }),
    }),
    { name: 'chatroom-auth' }
  )
)