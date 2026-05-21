import { useRef, useState, useCallback } from 'react'
import { DMIcon, LogoIcon, MembersIcon, NotificationIcon, SearchIcon } from './Icons'
import NotificationsDropdown from './NotificationsDropdown'
import type { Notification } from '../types'


function TerminalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  )
}

export interface ChatTopbarProps {
  mode: 'dm' | 'group' | 'empty'
  title: string
  subtitle?: string 

  membersOpen: boolean
  onToggleMembers: () => void

  terminalOpen?: boolean
  onToggleTerminal?: () => void

  onInviteUser?: () => void 

  notifications: Notification[]
  onAcceptFriend?: (id: string) => void
  onDeclineFriend?: (id: string) => void
  onAcceptInvite?: (id: string) => void
  onDeclineInvite?: (id: string) => void

  onSearch?: (query: string) => void
  searchResultCount?: number 

  roomId?: string 
  isOwner?: boolean 
  onLeaveOrDeleteSuccess?: () => void 
}

export default function ChatTopbar({
  mode,
  title,
  subtitle,
  membersOpen,
  onToggleMembers,
  terminalOpen,
  onToggleTerminal,
  onInviteUser,
  notifications,
  onAcceptFriend,
  onDeclineFriend,
  onAcceptInvite,
  onDeclineInvite,
  onSearch,
  searchResultCount,
  roomId,
  isOwner,
  onLeaveOrDeleteSuccess,
}: ChatTopbarProps) {
  const [notifOpen, setNotifOpen]   = useState(false)
  const [query,     setQuery]       = useState('')
  const notifBtnRef = useRef<HTMLButtonElement>(null)
  const inputRef    = useRef<HTMLInputElement>(null)
  const unreadCount = notifications.length

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    onSearch?.(val)
  }, [onSearch])

  const handleSearchSubmit = useCallback(() => {
    onSearch?.(query)
    inputRef.current?.focus()
  }, [query, onSearch])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearchSubmit()
    if (e.key === 'Escape') {
      setQuery('')
      onSearch?.('')
      inputRef.current?.blur()
    }
  }, [handleSearchSubmit, onSearch])

  return (
    <>
      <header className="chat-topbar">

        {}
        <div className="chat-topbar-left">
          <div className="chat-topbar-icon">
            {mode === 'dm' ? '' : ''}
          </div>

          <div className="chat-topbar-info">
            <div className="chat-topbar-name">
              {title ? title.toUpperCase() : ''}
            </div>
            
          </div>
        </div>

        <div className="chat-topbar-right">

          <div className="chat-topbar-actions">
      
            <button
              ref={notifBtnRef}
              className={`chat-topbar-btn ${notifOpen ? 'active' : ''}`}
              title="NOTIFICATIONS"
              onClick={() => setNotifOpen((v) => !v)}
            >
              <NotificationIcon />
              {unreadCount > 0 && (
                <span className="topbar-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {mode !== 'group' && onToggleTerminal && (
              <button
                className={`chat-topbar-btn ${terminalOpen ? 'active' : ''}`}
                title="SYSTEM LOGS"
                onClick={onToggleTerminal}
              >
                <TerminalIcon />
              </button>
            )}

            {}
            {mode === 'group' && (
              <button
                className={`chat-topbar-btn ${membersOpen ? 'active' : ''}`}
                title="MEMBERS"
                onClick={onToggleMembers}
              >
                <MembersIcon />
              </button>
            )}
          </div>

          {mode !== 'empty' && (
            <div className="chat-topbar-search-wrapper">
              <div className="chat-topbar-search">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={`SEARCH IN ${mode === 'dm' ? 'DM' : 'SERVER'}...`}
                  value={query}
                  onChange={handleQueryChange}
                  onKeyDown={handleKeyDown}
                />
                <button type="button" title="SEARCH" onClick={handleSearchSubmit}>
                  <SearchIcon />
                </button>
              </div>
            </div>
          )}
          </div>

      </header>

      {}
      {notifOpen && (
        <NotificationsDropdown
          triggerRef={notifBtnRef}
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onAcceptFriend={onAcceptFriend}
          onDeclineFriend={onDeclineFriend}
          onAcceptInvite={onAcceptInvite}
          onDeclineInvite={onDeclineInvite}
        />
      )}
    </>
  )
}