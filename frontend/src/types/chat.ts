export type NotifTab = 'for_you' | 'unreads'

export interface Notification {
  id: string
  type: 'friend_request' | 'group_invite' | 'mention'
  from_username: string
  from_avatar_color: string
  text: string
  time: string
  group_name?: string
}

export interface Reaction {
  emoji: string
  count: number
  reacted_by_me: boolean
}

export interface Message {
  id: string
  author_username: string
  author_name: string
  author_avatar_color: string
  content: string
  timestamp: string
  reactions: Reaction[]
  is_own?: boolean
  status?: UserStatus
}

export interface TypingUser {
  username: string
  color: string
}

export type UserStatus =
  | 'online'
  | 'idle'
  | 'offline'