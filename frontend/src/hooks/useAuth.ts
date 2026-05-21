import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import type { LoginRequest, SignupRequest } from '../types'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setAuth, clear, refreshToken } = useAuthStore()
  const navigate = useNavigate()

  const login = async (data: LoginRequest) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authApi.login(data)
      setAuth(res.access_token, res.refresh_token, res.user)
      navigate('/home')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? 'Erro ao fazer login'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const signup = async (data: SignupRequest) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authApi.signup(data)
      setAuth(res.access_token, res.refresh_token, res.user)
      return true
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? 'Erro ao criar conta'
      setError(msg)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (refreshToken) await authApi.logout(refreshToken)
    } finally {
      clear()
      navigate('/login')
    }
  }

  return { login, signup, logout, loading, error }
}