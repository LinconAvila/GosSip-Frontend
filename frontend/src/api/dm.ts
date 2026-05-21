import { api } from './auth'

export interface DmConversation {
  with_username: string
  last_message: string
  unread_count: number
}

export interface DmMessage {
  id: string
  sender_username: string
  recipient_username: string
  content: string
  read_at: string | null
  created_at: string
}

export const dmApi = {
  getConversations: (): Promise<DmConversation[]> =>
    api.get('/dm/conversations').then((r) => r.data),

  getHistory: (username: string, limit = 50, offset = 0): Promise<DmMessage[]> =>
    api
      .get(`/dm/${username}/history`, { params: { limit, offset } })
      .then((r) => r.data),

 
  markRead: (username: string): Promise<void> =>
    api.post(`/dm/${username}/read`).then(() => undefined),
}
