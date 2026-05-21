

import { useState, useCallback, useEffect } from 'react'

import '../styles/chat_area.css'
import '../styles/emoji_picker.css'

import type { Notification, Message, TypingUser } from '../types'

import ChatTopbar from './ChatTopbar'
import ChatInput from './ChatInput'
import MessageList from './MessageList'
import { ChatEmpty, ChatWelcomeBlock } from './ChatWelcome'

function colorFromName(name: string): string {
  const palette = ['#247BA0','#3090BA','#63ABD1','#F25F5C','#F2803A','#FFE066','#5ba665','#8a5ba6','#a65b8a']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

/* ─────────────────────────────────────────
    Types
───────────────────────────────────────── */

export interface ChatAreaProps {
  mode: 'dm' | 'group' | 'empty'
  title: string
  subtitle?: string

  membersOpen: boolean
  onToggleMembers: () => void
  onInviteUser?: () => void

  terminalOpen?: boolean
  onToggleTerminal?: () => void

  
  messages?: Message[]
  onSendMessage?: (content: string) => void
  onTyping?: (isTyping: boolean) => void
  isTyping?: boolean
  groupTypingUsers?: TypingUser[] 
  onReact?: (msgId: string, emoji: string) => void

  
  notifications?: Notification[]
  onAcceptFriend?: (id: string) => void
  onDeclineFriend?: (id: string) => void
  onAcceptInvite?: (id: string) => void
  onDeclineInvite?: (id: string) => void

  children?: React.ReactNode

  dashboardTab?: 'friends' | 'pending' | 'add' | null

  
  roomId?: string
  isOwner?: boolean
  onLeaveOrDeleteSuccess?: () => void
}

/* ─────────────────────────────────────────
    Component
───────────────────────────────────────── */

export default function ChatArea({
  mode,
  title,
  subtitle,
  membersOpen,
  onToggleMembers,
  onInviteUser,
  terminalOpen,     
  onToggleTerminal,
  messages = [],
  onSendMessage,
  onTyping,
  isTyping = false,
  groupTypingUsers = [], 
  onReact,
  notifications = [],
  onAcceptFriend,
  onDeclineFriend,
  onAcceptInvite,
  onDeclineInvite,
  children,
  dashboardTab,
  
  roomId,
  isOwner = false,
  onLeaveOrDeleteSuccess,
}: ChatAreaProps) {
  const chatKey = `${mode}:${title}`

  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  
  const [typingIndex, setTypingIndex] = useState(0)

  
  const handleReact = useCallback((msgId: string, emoji: string) => {
    if (onReact) {
      onReact(msgId, emoji)
    }
  }, [onReact])

  
  const filteredMessages = searchQuery.trim()
    ? messages.filter(m => {
        const contentMatch = m.content?.toLowerCase().includes(searchQuery.toLowerCase())
        
        const authorMatch = 
          (m.author_name || (m as any).sender_username || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        
        return contentMatch || authorMatch
      })
    : messages

  
  const handleSend = () => {
    const text = message.trim()
    if (!text) return

    if (onSendMessage) {
      onSendMessage(text)
    }
    
    setMessage('')
    if (onTyping) onTyping(false) 
  }

  
  const handleInputChange = (val: string) => {
    setMessage(val)
    if (onTyping) {
      onTyping(val.length > 0)
    }
  }

  
  useEffect(() => {
    if (mode !== 'group' || groupTypingUsers.length <= 1) {
      setTypingIndex(0)
      return
    }

    const interval = setInterval(() => {
      setTypingIndex((prev) => prev + 1)
    }, 1500) 

    return () => clearInterval(interval)
  }, [mode, groupTypingUsers.length])

  
  const resolvedTypingUsers: TypingUser[] = 
    mode === 'dm' && isTyping 
      ? [{ username: title, color: colorFromName(title) }] 
      : mode === 'group' && groupTypingUsers.length > 0
        ? [groupTypingUsers[typingIndex % groupTypingUsers.length]] 
        : []

  return (
    <div className="chat-area">
      {}
      <ChatTopbar
        mode={mode}
        title={
          mode === 'empty'
            ? (dashboardTab === 'pending' ? 'PENDING REQUESTS' : (dashboardTab === 'friends' ? 'FRIENDS' : 'DASHBOARD'))
            : title
        }
        subtitle={mode === 'empty' ? undefined : subtitle}
        membersOpen={membersOpen}
        onToggleMembers={onToggleMembers}
        terminalOpen={terminalOpen}
        onToggleTerminal={onToggleTerminal}
        onInviteUser={onInviteUser}
        notifications={notifications}
        onAcceptFriend={onAcceptFriend}
        onDeclineFriend={onDeclineFriend}
        onAcceptInvite={onAcceptInvite}
        onDeclineInvite={onDeclineInvite}
        onSearch={setSearchQuery}
        searchResultCount={searchQuery.trim() ? filteredMessages.length : undefined}
        roomId={roomId}
        isOwner={isOwner}
        onLeaveOrDeleteSuccess={onLeaveOrDeleteSuccess}
      />

      {}
      <div className="chat-content-row">
        
        {}
        <div className="chat-main">
          <div className="chat-messages">
            {mode === 'empty' ? (
              <ChatEmpty />
            ) : (
              <>
                <ChatWelcomeBlock mode={mode} title={title} />
                <MessageList
                  messages={filteredMessages}
                  typingUsers={searchQuery.trim() ? [] : resolvedTypingUsers} 
                  onReact={handleReact}
                  chatKey={chatKey}
                  searchQuery={searchQuery}
                />
              </>
            )}
          </div>

          <ChatInput
            mode={mode}
            title={title}
            value={message}
            onChange={handleInputChange}
            onSend={handleSend}
            chatKey={chatKey}
          />
        </div>

        {}
        {children} 

      </div>
    </div>
  )
}