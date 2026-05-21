

import '../styles/profile_bar.css'
import { SettingsIcon } from './Icons'
import type { PresenceStatus } from '../store/presenceStore'

interface ProfileBarProps {
  user: { name: string; username: string; avatar_color: string } | null
  myStatus?: PresenceStatus
  onStatusChange?: (status: 'online' | 'dnd') => void
  onUserPanelOpen: () => void
  onSettingsOpen: () => void
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

export default function ProfileBar({
  user,
  myStatus = 'offline',
  onUserPanelOpen,
  onSettingsOpen,
}: ProfileBarProps) {
  return (
    <div className="profile-bar">

      {}
      <div className="profile-bar__identity" onClick={onUserPanelOpen}>
        <div className="profile-bar__avatar-wrap">
          {}
          <div
            className="profile-bar__avatar"
            style={{ background: user?.avatar_color || (user ? colorFromName(user.username) : '#247BA0') }}
          >
            {user ? getInitial(user.username) : '?'}
          </div>
          <div className={`profile-bar__status-badge ${myStatus}`} />
        </div>

        <div className="profile-bar__info">
          <div className="profile-bar__name">
            {user?.name ?? 'UNKNOWN'}
          </div>
          <div className="profile-bar__username">
            @{user?.username ?? 'offline'}
          </div>
        </div>
      </div>

      {}
      <button
        className="profile-bar__settings-btn"
        title="SETTINGS"
        onClick={onSettingsOpen}
      >
        <SettingsIcon />
      </button>

    </div>
  )
}