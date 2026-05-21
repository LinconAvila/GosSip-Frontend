// src/api/inbox.ts
import { api } from './auth'

export interface InboxItem {
  id: string
  type: 'friend_request' | 'room_invite'
  sender: string
  room_id: string | null
  room_name: string | null                // ← campo adicionado (backend já retorna)
  status: string
  created_at: string
}

export interface SentRoomInviteItem {
  id: string
  room_id: string
  room_name: string | null
  recipient_username: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
}

export const inboxApi = {
  getInbox: (): Promise<InboxItem[]> =>
    api.get('/inbox').then((r) => r.data),

  getSentRoomInvites: (): Promise<SentRoomInviteItem[]> =>
    api.get('/rooms/invites/sent').then((r) => r.data),

  cancelRoomInvite: (inviteId: string): Promise<void> =>
    api.delete(`/rooms/invites/${inviteId}`).then((r) => r.data),
}