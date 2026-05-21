import { api } from './auth'
import type {
  User,
  UpdateProfilePayload,
  UpdatePasswordPayload,
} from '../types'


export const getMe = (): Promise<User> =>
  api.get<User>('/auth/me').then(r => r.data)

export const updateProfile = (
  payload: UpdateProfilePayload,
): Promise<User> =>
  api.patch<User>('/users/me', payload).then(r => r.data)

export const updatePassword = (
  payload: UpdatePasswordPayload,
): Promise<void> =>
  api.patch('/users/me/password', payload).then(() => undefined)

export const deleteAccount = (): Promise<void> =>
  api.delete('/users/me').then(() => undefined)


export interface UserSearchResult {
  id: string; 
  username: string
  name: string
  avatar_color: string
}

export const searchUsers = (query: string): Promise<UserSearchResult[]> =>
  api.get(`/users?q=${query}`).then(r => r.data)