

import { useEffect, useRef, useState, useCallback } from 'react'
import type { Message, TypingUser } from '../types'
import EmojiPickerPortal from './EmojiPickerPortal'



interface MessageListProps {
  messages: Message[]
  typingUsers: TypingUser[]
  onReact: (msgId: string, emoji: string) => void
  chatKey: string
  searchQuery?: string
}



function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (d.toDateString() === today.toDateString())     return 'TODAY'
  if (d.toDateString() === yesterday.toDateString()) return 'YESTERDAY'

  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).toUpperCase()
}

function isSameDay(a: string, b: string): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

function isSameAuthorAndClose(a: Message, b: Message): boolean {
  const diff = Math.abs(new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  return a.author_username === b.author_username && diff < 5 * 60 * 1000
}



function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="msg__highlight">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}



function SearchEmpty({ query }: { query: string }) {
  return (
    <div className="msg-search-empty">
      <div className="msg-search-empty__icon">?</div>
      <div className="msg-search-empty__title">NO RESULTS FOR</div>
      <div className="msg-search-empty__query">"{query}"</div>
      <div className="msg-search-empty__sub">TRY A DIFFERENT KEYWORD</div>
    </div>
  )
}



function TypingIndicator({ users }: { users: TypingUser[] }) {
  if (users.length === 0) return null

  const label = users.length === 1
    ? `${users[0].username} IS TYPING`
    : `${users.map(u => u.username).join(', ')} ARE TYPING`

  return (
    <div className="typing-indicator">
      <div
        className="typing-indicator__avatar"
        style={{ background: users[0].color }}
      >
        {getInitial(users[0].username)}
      </div>

      <div className="typing-indicator__bubble">
        <span className="typing-indicator__text">{label}</span>
        <div className="typing-indicator__dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}



interface MessageItemProps {
  msg: Message
  isGrouped: boolean
  onReact: (msgId: string, emoji: string) => void
  searchQuery?: string
}

function MessageItem({ msg, isGrouped, onReact, searchQuery }: MessageItemProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const emojiButtonRef = useRef<HTMLButtonElement>(null)

  const handleEmojiSelect = useCallback((emoji: string) => {
    onReact(msg.id, emoji)
    setPickerOpen(false)
  }, [msg.id, onReact])

  return (
    <div className={`msg ${msg.is_own ? 'msg--own' : ''} ${isGrouped ? 'msg--grouped' : ''}`}>

      {}
      {isGrouped ? (
        <div className="msg__avatar-spacer">
          <span className="msg__time-inline">{formatTime(msg.timestamp)}</span>
        </div>
      ) : (
        <div
          className="msg__avatar"
          style={{ background: msg.author_avatar_color }}
          title={msg.author_name}
        >
          {getInitial(msg.author_name)}
        </div>
      )}

      {}
      <div className="msg__bubble-wrap">

        {}
        {!isGrouped && (
          <div className="msg__author-label">{msg.author_name.toUpperCase()}</div>
        )}

        {}
        <div className={`msg__bubble ${pickerOpen ? 'msg__bubble--picker-open' : ''}`}>

          {}
          <div className="msg__actions">
            <button
              type="button"
              ref={emojiButtonRef}
              className="msg__action-btn"
              title="REACT"
              onClick={() => setPickerOpen(v => !v)}
            >
              ☺
            </button>
          </div>

          {}
          <div className="msg__text">
            <HighlightText text={msg.content} query={searchQuery ?? ''} />
          </div>

          {}
          <span className="msg__time">{formatTime(msg.timestamp)}</span>

        </div>

        {}
        {msg.reactions.length > 0 && (
          <div className="msg__reactions">
            {msg.reactions.map(r => (
              <button
                type="button"
                key={r.emoji}
                className={`msg__reaction ${r.reacted_by_me ? 'active' : ''}`}
                onClick={() => onReact(msg.id, r.emoji)}
              >
                {r.emoji} <span>{r.count}</span>
              </button>
            ))}
          </div>
        )}

      </div>

      {}
      {pickerOpen && (
        <EmojiPickerPortal
          anchorRef={emojiButtonRef}
          onPick={handleEmojiSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}

    </div>
  )
}



export default function MessageList({
  messages,
  typingUsers,
  onReact,
  chatKey,
  searchQuery = '',
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const prevChatKey = useRef(chatKey)

  
  useEffect(() => {
    if (chatKey !== prevChatKey.current || !searchQuery) {
      bottomRef.current?.scrollIntoView({ behavior: chatKey !== prevChatKey.current ? 'instant' : 'smooth' })
      prevChatKey.current = chatKey
    }
  }, [messages, chatKey, searchQuery])

  if (messages.length === 0 && searchQuery.trim()) {
    return (
      <div className="msg-list">
        <SearchEmpty query={searchQuery} />
      </div>
    )
  }

  return (
    <div className="msg-list">
      {messages.map((msg, i) => {
        const prev = messages[i - 1]
        const showDateSep = !prev || !isSameDay(prev.timestamp, msg.timestamp)
        const isGrouped   = !!prev && !showDateSep && isSameAuthorAndClose(prev, msg)

        return (
          <div key={msg.id}>
            {showDateSep && (
              <div className="msg-date-sep">
                <div className="msg-date-sep__line" style={{ flex: 1 }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '8px', whiteSpace: 'nowrap' }}>
                  {formatDate(msg.timestamp)}
                </span>
                <div className="msg-date-sep__line" style={{ flex: 1 }} />
              </div>
            )}

            <MessageItem
              msg={msg}
              isGrouped={isGrouped}
              onReact={onReact}
              searchQuery={searchQuery}
            />
          </div>
        )
      })}

      <TypingIndicator users={typingUsers} />

      <div ref={bottomRef} />
    </div>
  )
}