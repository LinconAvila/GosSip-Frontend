

import { useState, useRef, useEffect } from 'react'
import '../styles/notifications.css' 
import { NotificationIcon, MailboxIcon, MentionIcon, ApproveIcon, RefuseIcon} from './Icons' 

import type { Notification } from '../types'

type NotifTab = 'for_you' | 'unreads'

export interface NotificationsDropdownProps {
  notifications: Notification[]
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement>

  onAcceptFriend?: (id: string) => void
  onDeclineFriend?: (id: string) => void

  onAcceptInvite?: (id: string) => void
  onDeclineInvite?: (id: string) => void
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}


function colorFromName(name: string): string {
  const palette = ['#247BA0','#3090BA','#63ABD1','#F25F5C','#F2803A','#FFE066','#5ba665','#8a5ba6','#a65b8a']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)

  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`

  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`

  return `${Math.floor(h / 24)}d ago`
}

export default function NotificationsDropdown({
  notifications,
  onClose,
  triggerRef,
  onAcceptFriend,
  onDeclineFriend,
  onAcceptInvite,
  onDeclineInvite,
}: NotificationsDropdownProps) {
  const [tab, setTab] = useState<NotifTab>('for_you')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        ref.current &&
        !ref.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, triggerRef])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const filtered = notifications.filter((n) =>
    tab === 'for_you'
      ? n.type === 'friend_request' || n.type === 'group_invite'
      : n.type === 'mention'
  )

  return (
    <div className="notif-dropdown" ref={ref}>

      {}
      <div className="notif-header">
        <span className="notif-header-title">
          <NotificationIcon /> NOTIFICATIONS.EXE
        </span>
      </div>

      {}
      <div className="notif-tabs">
        <button
          className={`notif-tab ${tab === 'for_you' ? 'active' : ''}`}
          onClick={() => setTab('for_you')}
        >
          <NotificationIcon /> FOR YOU
        </button>

        <button
          className={`notif-tab ${tab === 'unreads' ? 'active' : ''}`}
          onClick={() => setTab('unreads')}
        >
          <MentionIcon/> MENTIONS
        </button>
      </div>

      {}
      <div className="notif-list">
        {filtered.length === 0 ? (
          <div className="notif-empty">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--text-soft)' }}>
              <MailboxIcon />
            </div>
            INBOX IS CLEAR
            <br />
            <span style={{ opacity: 0.6, fontSize: '8px' }}>
              NO NEW NOTIFICATIONS
            </span>
          </div>
        ) : (
          filtered.map((n) => (
            <div key={n.id} className="notif-item">
              <div
                className="notif-avatar"
                
                style={{ background: n.from_avatar_color || colorFromName(n.from_username) }}
              >
                {}
                {getInitial(n.from_username)}
              </div>

              <div className="notif-content">
                <div
                  className="notif-text"
                  dangerouslySetInnerHTML={{
                    __html: n.text.replace(
                      /\*\*(.+?)\*\*/g,
                      '<strong>$1</strong>'
                    ),
                  }}
                />

                <div className="notif-time">
                  {timeAgo(n.time)}
                </div>

                <div className="notif-actions">
                  {n.type === 'friend_request' && (
                    <>
                      <button className="notif-action-btn accept" onClick={() => onAcceptFriend?.(n.id)}>
                        <ApproveIcon /> ACCEPT
                      </button>
                      <button className="notif-action-btn decline" onClick={() => onDeclineFriend?.(n.id)}>
                        <RefuseIcon /> DECLINE
                      </button>
                    </>
                  )}

                  {n.type === 'group_invite' && (
                    <>
                      <button className="notif-action-btn accept" onClick={() => onAcceptInvite?.(n.id)}>
                        <ApproveIcon /> JOIN
                      </button>
                      <button className="notif-action-btn decline" onClick={() => onDeclineInvite?.(n.id)}>
                        <RefuseIcon /> IGNORE
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}