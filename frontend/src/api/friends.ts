import { api } from './auth'

export interface Friendship {
  id: string
  status: 'pending' | 'accepted' | 'blocked'
  sender_username: string
  recipient_username: string
  created_at: string
}

export const friendsApi = {
  getAll: (): Promise<Friendship[]> =>
    api.get('/friends').then((r) => r.data),

  getPending: (): Promise<Friendship[]> =>
    api.get('/friends/pending').then((r) => r.data),

  sendRequest: (username: string): Promise<Friendship> =>
    api.post('/friends/request', { username }).then((r) => r.data),

  updateStatus: (
    id: string,
    status: 'accepted' | 'declined' | 'blocked'
  ): Promise<Friendship> =>
    api.patch(`/friends/${id}`, { status }).then((r) => r.data),

  remove: (id: string): Promise<void> =>
    api.delete(`/friends/${id}`).then(() => undefined),
}