

import { useState, useCallback, useEffect, useRef } from 'react'
import { WsClient } from '../api/ws'
import type { Message } from '../types'
import { useAuthStore } from '../store/authStore'
import type { PresenceStatus } from '../store/presenceStore'
import { usePresenceStore } from '../store/presenceStore'


function colorFromName(name: string): string {
  const palette = ['#247BA0','#3090BA','#63ABD1','#F25F5C','#F2803A','#FFE066','#5ba665','#8a5ba6','#a65b8a']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}


function toggleRoomReactionHelper(
  messages: Message[], 
  msgId: string, 
  emoji: string, 
  username: string, 
  currentUsername?: string
) {
  return messages.map((m) => {
    if (m.id !== msgId) return m

    const isMe = username === currentUsername
    const reactions = m.reactions ? [...m.reactions] : []
    const idx = reactions.findIndex((r) => r.emoji === emoji)

    if (idx === -1) {
      return { 
        ...m, 
        reactions: [...reactions, { emoji, count: 1, reacted_by_me: isMe, users: [username] } as any] 
      }
    }

    const target = reactions[idx]
    const usersList = (target as any).users || []
    
    if (usersList.includes(username)) {
      const updatedUsers = usersList.filter((u: string) => u !== username)
      
      if (updatedUsers.length === 0) {
        return { ...m, reactions: reactions.filter((r) => r.emoji !== emoji) }
      }
      
      reactions[idx] = { 
        ...target, 
        count: target.count - 1, 
        reacted_by_me: isMe ? false : target.reacted_by_me, 
        users: updatedUsers 
      } as any
    } else {
      reactions[idx] = { 
        ...target, 
        count: target.count + 1, 
        reacted_by_me: isMe ? true : target.reacted_by_me, 
        users: [...usersList, username] 
      } as any
    }

    return { ...m, reactions }
  })
}

export function useWsRoom(roomId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set()) 
  
  
  const [broadcastCount, setBroadcastCount] = useState<number | null>(null)
  
  const wsRef = useRef<WsClient | null>(null)
  
  const setPresence = usePresenceStore((s) => s.setPresence)

  const currentUser = useAuthStore((state) => state.user)
  const currentUsername = currentUser?.username

  const usernameRef = useRef(currentUsername)
  useEffect(() => {
    usernameRef.current = currentUsername
  }, [currentUsername])

  useEffect(() => {
    if (!roomId) {
      setMessages([])
      setOnlineUsers(new Set())
      setTypingUsers(new Set())
      setBroadcastCount(null) 
      return
    }

    setLoading(true)
    const ws = new WsClient(`rooms/${roomId}`, {
      onMessage: (e) => {
        
        if (e && (e.type === 'online_count' || e.count !== undefined)) {
          setBroadcastCount(e.count)
          return 
        }

        setMessages((prev) => [...prev, {
          id: e.msg_id,
          author_username: e.sender,
          author_name: e.sender, 
          author_avatar_color: colorFromName(e.sender), 
          content: e.content,
          timestamp: new Date().toISOString(),
          reactions: [],
          is_own: e.sender === usernameRef.current
        }])
      },
      onHistory: (history) => {
        const formatted: Message[] = history.map(m => ({
          id: m.id,
          author_username: m.sender,
          author_name: m.sender,
          author_avatar_color: colorFromName(m.sender), 
          content: m.content,
          timestamp: m.created_at,
          reactions: [],
          is_own: m.sender === usernameRef.current
        }))
        setMessages(formatted)
        setLoading(false)
      },
      onJoin: (username) => {
        setOnlineUsers(prev => new Set(prev).add(username))
      },
      onLeave: (username) => {
        setOnlineUsers(prev => {
          const next = new Set(prev)
          next.delete(username)
          return next
        })
      },
      onTyping: (isTyping, username) => {
        
        if (username === usernameRef.current) return 

        setTypingUsers(prev => {
          const next = new Set(prev)
          if (isTyping) next.add(username)
          else next.delete(username)
          return next
        })
      },
      onReact: (msgId, emoji, username) => {
        setMessages((prev) => toggleRoomReactionHelper(prev, msgId, emoji, username, usernameRef.current))
      },
      onPresence: (e) => {
        setPresence(e.username, e.status as PresenceStatus, e.room_id)
      },
      onStatusChange: (status) => {
        console.log(`[useWsRoom] Status (${roomId}): ${status}`)
      },
      
      onOnlineCount: (count: number) => {
        setBroadcastCount(count)
      }
    } as any)

    ws.connect()
    wsRef.current = ws

    return () => {
      ws.disconnect()
      wsRef.current = null
    }
  }, [roomId]) 

  const sendMessage = useCallback((content: string) => {
    wsRef.current?.sendMessage(content)
  }, [])

  const sendReact = useCallback((msgId: string, emoji: string) => {
    wsRef.current?.sendReact(msgId, emoji)
  }, [])

  const sendTheme = useCallback((isTyping: boolean) => {
    wsRef.current?.sendTyping(isTyping)
  }, [])

  
  const formattedTypingUsers = Array.from(typingUsers).map(u => ({
    username: u,
    color: colorFromName(u)
  }))

  return {
    messages,
    loading,
    
    onlineCount: broadcastCount !== null ? broadcastCount : (onlineUsers.size > 0 ? onlineUsers.size : 1),
    onlineUsers: Array.from(onlineUsers),
    typingUsers: formattedTypingUsers, 
    sendMessage,
    sendReact,
    sendTyping: sendTheme,
    wsRef,
  }
}