import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import type { AuthResponse, LoginRequest, SignupRequest } from '../types'


export const api = axios.create({
  baseURL: `${import.meta.env.VITE_PRIMARY_URL ?? 'http://localhost:8080'}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})


api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  signup: (data: SignupRequest) =>
    api.post<AuthResponse>('/auth/signup', data).then((r) => r.data),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refresh_token: refreshToken }),

  me: () => api.get('/auth/me').then((r) => r.data),
}
