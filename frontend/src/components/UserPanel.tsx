

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { usePresenceStore, type PresenceStatus } from '../store/presenceStore'
import '../styles/user_panel.css'
import { EditIcon, LogoutIcon } from './Icons'

interface UserPanelProps {
  isOpen: boolean
  onClose: () => void
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



const STATUS_OPTIONS: { value: PresenceStatus; label: string; sub: string }[] = [
  { value: 'online',  label: 'ONLINE',         sub: 'Available'          },
  { value: 'idle',    label: 'IDLE',           sub: 'Away for a while'   },
  { value: 'dnd',     label: 'DO NOT DISTURB', sub: 'Mute notifications' },
  { value: 'offline', label: 'OFFLINE',        sub: 'Appear offline'     },
]

const STATUS_LABEL: Record<PresenceStatus, string> = {
  online:  'ONLINE',
  idle:    'IDLE',
  dnd:     'DO NOT DISTURB',
  offline: 'OFFLINE',
}

function StatusDot({ status, size = 10 }: { status: PresenceStatus; size?: number }) {
  return (
    <span className={`up-status-dot ${status}`} style={{ width: size, height: size }} />
  )
}



export default function UserPanel({ isOpen, onClose }: UserPanelProps) {
  const navigate   = useNavigate()
  const user       = useAuthStore((s) => s.user)
  const clear      = useAuthStore((s) => s.clear)
  const panelRef   = useRef<HTMLDivElement>(null)

  const myStatus    = usePresenceStore((s) => s.myStatus)
  const setMyStatus = usePresenceStore((s) => s.setMyStatus)

  const [dropdownOpen, setDropdownOpen] = useState(false)

  
  const avatarColor = user?.avatar_color || (user ? colorFromName(user.username) : '#247BA0')

  
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        onClose()
      }
    }
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 50)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handler) }
  }, [isOpen, onClose])

  
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      const wrap = document.getElementById('up-status-wrapper')
      if (wrap && !wrap.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 20)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handler) }
  }, [dropdownOpen])

  
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (dropdownOpen) setDropdownOpen(false)
        else onClose()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose, dropdownOpen])

  const handleLogout      = () => { clear(); navigate('/login') }
  const handleEditProfile = () => { onClose(); navigate('/settings') }

  const handleStatusSelect = (value: PresenceStatus) => {
    if (value === myStatus) { setDropdownOpen(false); return }
    setMyStatus(value)
    setDropdownOpen(false)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="up-backdrop" onClick={() => { setDropdownOpen(false); onClose() }} />

      <div className="up-popover" ref={panelRef}>

        {}
        <div className="up-card">
          <div className="up-avatar-wrap">
            <div className="up-avatar" style={{ background: avatarColor }}>
              {user ? getInitial(user.username) : '?'}
            </div>
            <div className={`up-status-badge ${myStatus}`} />
          </div>
          <div className="up-info">
            <div className="up-name">{user?.name ?? 'UNKNOWN'}</div>
            <div className="up-username">@{user?.username ?? 'offline'}</div>
          </div>
        </div>

        <div className="up-divider" />

        {}
        <div className="up-section-label">STATUS</div>
        <div id="up-status-wrapper" className="up-status-trigger-wrap">
          <button
            className={`up-status-trigger ${dropdownOpen ? 'open' : ''}`}
            onClick={() => setDropdownOpen(v => !v)}
          >
            <StatusDot status={myStatus} size={10} />
            <span className="up-status-trigger-label">{STATUS_LABEL[myStatus]}</span>
            <span className="up-status-trigger-arrow">{dropdownOpen ? '▼' : '▶'}</span>
          </button>

          {}
          {dropdownOpen && (
            <div className="up-status-dropdown">
              {STATUS_OPTIONS.map((opt) => {
                const isActive = opt.value === myStatus
                return (
                  <button
                    key={opt.value}
                    className={`up-status-option ${isActive ? 'active' : ''}`}
                    onClick={() => handleStatusSelect(opt.value)}
                    disabled={isActive}
                  >
                    <StatusDot status={opt.value} size={10} />
                    <div className="up-status-option-text">
                      <span className="up-status-option-label">{opt.label}</span>
                      <span className="up-status-option-sub">{opt.sub}</span>
                    </div>
                    {isActive && <span className="up-status-option-check">✓</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="up-divider" />

        {}
        <div className="up-menu">
          <button className="up-menu-item" onClick={handleEditProfile}>
            <span className="up-menu-icon"><EditIcon /></span>
            EDIT PROFILE
          </button>
        </div>

        <div className="up-divider" />

        {}
        <div className="up-footer">
          <button className="up-logout-btn" onClick={handleLogout}>
            <span><LogoutIcon /></span>
            LOGOUT
          </button>
        </div>

      </div>
    </>
  )
}