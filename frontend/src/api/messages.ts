import { api } from './auth'

export interface Reaction {
  emoji: string
  count: number
  reacted_by_me: boolean
}

export interface Message {
  id: string
  room_id: string
  sender_username: string | null
  content: string
  created_at: string
  reactions: Reaction[]
}

export const messagesApi = {
  getHistory: (roomId: string, limit = 50, offset = 0): Promise<Message[]> =>
    api
      .get(`/rooms/${roomId}/history`, { params: { limit, offset } })
      .then((r) => r.data),
}