import { useState, useCallback, useEffect, useRef } from 'react'
import { dmApi } from '../api/dm'
import { WsClient } from '../api/ws'
import type { DmMessage } from '../api/dm'
import { useAuthStore } from '../store/authStore'
import type { Message } from '../types'

function colorFromName(name: string): string {
  const palette = ['#247BA0','#3090BA','#63ABD1','#F25F5C','#F2803A','#FFE066','#5ba665','#8a5ba6','#a65b8a']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

export interface DmMessageWithReactions extends DmMessage {
  reactions?: { emoji: string; count: number; reacted_by_me: boolean; users: string[] }[]
}

export function useWsDm(peerUsername: string | null) {
  
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const wsRef = useRef<WsClient | null>(null)

  
  const currentUser = useAuthStore((state) => state.user)
  const currentUsername = currentUser?.username

  useEffect(() => {
    if (!peerUsername) {
      setMessages([])
      return
    }

    setLoading(true)
    const ws = new WsClient(`dm/${peerUsername}`, {
    onMessage: (msg) => {
        setMessages((prev) => [...prev, {
          id: msg.msg_id,
          content: msg.content,
          author_username: msg.sender,                 
          author_name: msg.sender,                     
          author_avatar_color: colorFromName(msg.sender), 
          timestamp: new Date().toISOString(),         
          is_own: msg.sender === currentUsername,      
          reactions: [] 
        }])
      },
      onHistory: (history) => {
        const formatted: Message[] = history.map(m => ({
          id: m.id,
          content: m.content,
          author_username: m.sender,                 
          author_name: m.sender,                     
          author_avatar_color: colorFromName(m.sender), 
          timestamp: m.created_at,                   
          is_own: m.sender === currentUsername,      
          reactions: [] 
        }))
        setMessages(formatted)
        setLoading(false)
      },
      onTyping: (typing) => {
        setIsTyping(typing)
      },

      onReact: (msgId, emoji, username) => {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== msgId) return m;

            const isMe = username === currentUsername; 
            const reactions = m.reactions ? [...m.reactions] : [];
            const idx = reactions.findIndex((r) => r.emoji === emoji);

            if (idx >= 0) {
              const target = reactions[idx];
              const usersList = target.users || [];
              const hasUserReacted = usersList.includes(username);

              if (hasUserReacted) {
                
                const updatedUsers = usersList.filter((u) => u !== username);
                const newCount = Math.max(0, target.count - 1);

                if (newCount === 0) {
                  return { 
                    ...m, 
                    reactions: reactions.filter((r) => r.emoji !== emoji) 
                  };
                }

                reactions[idx] = {
                  ...target,
                  count: newCount,
                  reacted_by_me: isMe ? false : target.reacted_by_me,
                  users: updatedUsers,
                };
              } else {
                
                reactions[idx] = {
                  ...target,
                  count: target.count + 1,
                  reacted_by_me: isMe ? true : target.reacted_by_me,
                  users: [...usersList, username],
                };
              }
            } else {
              
              reactions.push({
                emoji,
                count: 1,
                reacted_by_me: isMe,
                users: [username],
              });
            }

            return { ...m, reactions };
          })
        );
      },
      onStatusChange: (status) => {
        console.log(`[useWsDm] Status: ${status}`)
      }
    })

    ws.connect()
    wsRef.current = ws

    
    dmApi.markRead(peerUsername).catch(() => undefined)

    return () => {
      ws.disconnect()
      wsRef.current = null
    }
  }, [peerUsername, currentUsername])

  const sendMessage = useCallback((content: string) => {
    wsRef.current?.sendMessage(content)
  }, [])

  const sendTyping = useCallback((typing: boolean) => {
    wsRef.current?.sendTyping(typing)
  }, [])

  const sendReact = useCallback((msgId: string, emoji: string) => {
    wsRef.current?.sendReact(msgId, emoji)
  }, [])

  
  const loadMore = useCallback(async () => {
    if (!peerUsername) return
    try {
      const older = await dmApi.getHistory(peerUsername, 50, messages.length)
      
      
      const formattedOlder: Message[] = older.map(m => ({
        id: m.id,
        content: m.content,
        author_username: m.sender,
        author_name: m.sender,
        author_avatar_color: colorFromName(m.sender),
        timestamp: m.created_at,
        is_own: m.sender === currentUsername,
        reactions: []
      }))
      
      setMessages((prev) => [...formattedOlder, ...prev])
    } catch (err) {
      console.error('[useWsDm] loadMore error:', err)
    }
  }, [peerUsername, messages.length, currentUsername])

  return { 
    messages, 
    loading, 
    isTyping, 
    sendMessage, 
    sendTyping,
    sendReact, 
    loadMore,
    wsRef, 
  }
}