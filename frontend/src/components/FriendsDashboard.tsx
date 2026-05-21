

import { useState, useRef, useEffect } from 'react'
import { SearchIcon, SpeechBubbleIcon, OptionsIcon, CloseIcon, ApproveIcon2, RefuseIcon2, GlobeIcon, FriendsIcon } from './Icons'
import { usePresenceStore } from '../store/presenceStore'
import '../styles/friends_dashboard.css'

function getInitial(name?: string | null) {
  return name ? name.trim().charAt(0).toUpperCase() : '?'
}

function colorFromName(name: string): string {
  const palette = ['#247BA0','#3090BA','#63ABD1','#F25F5C','#F2803A','#FFE066','#5ba665','#8a5ba6','#a65b8a']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

const STATUS_LABEL: Record<string, string> = {
  online:  'ONLINE',
  idle:    'IDLE',
  dnd:     'DO NOT DISTURB',
  offline: 'OFFLINE',
}

function StatusDot({ status }: { status: string }) {
  return <div className={`fd-status-dot fd-status-dot--${status}`} />
}



function FriendItem({ friend, liveStatus, roomLabel, onChat, onRemove }: any) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const isOffline = liveStatus === 'offline'

  const handleRowClick = () => {
    if (menuOpen) { setMenuOpen(false); return }
    onChat()
  }

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <div
        className={`fd-item ${isOffline ? 'fd-item--offline' : ''} ${menuOpen ? 'menu-open' : ''}`}
        onClick={handleRowClick}
      >
        <div className="fd-avatar-wrap">
          <div className="fd-avatar" style={{ background: isOffline ? '#3A3848' : (friend.avatar_color || colorFromName(friend.username)) }}>
            {getInitial(friend.username)}
          </div>
          <StatusDot status={liveStatus} />
        </div>

        <div className="fd-info">
          <div className={`fd-name ${isOffline ? 'fd-name--offline' : ''}`}>
            {friend.name || friend.username}
          </div>
          {roomLabel && liveStatus !== 'offline' ? (
            <div className="fd-room-label">
              <span className="fd-room-icon">▶</span>
              IN: {roomLabel.toUpperCase()}
            </div>
          ) : (
            <div className={`fd-status-text fd-status-text--${liveStatus}`}>
              {STATUS_LABEL[liveStatus] ?? liveStatus.toUpperCase()}
            </div>
          )}
        </div>

        <div className="fd-actions">
          <button className="fd-action-btn" onClick={(e) => { e.stopPropagation(); onChat() }} title="Send Message">
            <SpeechBubbleIcon />
          </button>
          <button
            className="fd-action-btn fd-dots-btn"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v) }}
            title="More"
          >
            <span className="fd-dots"><OptionsIcon /></span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fd-dropdown"
          style={{ position: 'absolute', right: 0, top: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="fd-dropdown-btn fd-dropdown-btn--danger"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(false)
              onRemove()
            }}
          >
            <CloseIcon /> REMOVE FRIEND
          </button>
        </div>
      )}
    </div>
  )
}



function PendingItem({ req, currentUsername, onAccept, onDecline, onCancel }: any) {
  const isIncoming = req.recipient_username === currentUsername
  const peerUsername = isIncoming ? req.sender_username : req.recipient_username
  const peerName  = req._resolved_peer_name ?? peerUsername

  const [acting, setActing] = useState(false)

  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (acting) return
    setActing(true)
    try { await onAccept(req.id) } finally { setActing(false) }
  }

  const handleDecline = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (acting) return
    setActing(true)
    try { await onDecline(req.id) } finally { setActing(false) }
  }

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (acting) return
    setActing(true)
    try { await onCancel(req.id) } finally { setActing(false) }
  }

  return (
    <div className="fd-item">
      <div className="fd-avatar-wrap">
        <div className="fd-avatar" style={{ background: req._resolved_peer_color || colorFromName(peerUsername) }}>
          {getInitial(peerUsername)}
        </div>
      </div>
      <div className="fd-info">
        <div className="fd-pending-identity">
          <span className="fd-pending-name">{peerName}</span>
          <span className="fd-pending-username">@{peerUsername}</span>
        </div>
        <div className="fd-status-text fd-status-text--pending">
          {isIncoming ? 'INCOMING REQUEST' : 'OUTGOING REQUEST'}
        </div>
      </div>
      <div className="fd-actions">
        {isIncoming ? (
          <>
            <button
              className="fd-action-btn fd-action-btn--accept"
              onClick={handleAccept}
              disabled={acting}
              style={{ opacity: acting ? 0.5 : 1 }}
              title="Accept"
            >
              <ApproveIcon2 />
            </button>
            <button
              className="fd-action-btn fd-action-btn--decline"
              onClick={handleDecline}
              disabled={acting}
              style={{ opacity: acting ? 0.5 : 1 }}
              title="Decline"
            >
              <RefuseIcon2 />
            </button>
          </>
        ) : (
          <button
            className="fd-action-btn fd-action-btn--decline"
            onClick={handleCancel}
            disabled={acting}
            style={{ opacity: acting ? 0.5 : 1 }}
            title="Cancel request"
          >
            <RefuseIcon2 />
          </button>
        )}
      </div>
    </div>
  )
}



function RoomInviteItem({ invite, onAcceptInvite, onDeclineInvite }: any) {
  const [acting, setActing] = useState(false)

  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (acting) return
    setActing(true)
    try { await onAcceptInvite(invite.id) } finally { setActing(false) }
  }

  const handleDecline = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (acting) return
    setActing(true)
    try { await onDeclineInvite(invite.id) } finally { setActing(false) }
  }

  const senderUsername = invite.from_username || invite.sender || '?'
  const senderColor = invite.from_avatar_color || colorFromName(senderUsername)
  
  
  const roomName    = invite.room_name || invite.roomName || 'A SERVER'

  return (
    <div className="fd-item">
      <div className="fd-avatar-wrap">
        <div className="fd-avatar" style={{ background: senderColor }}>
          {getInitial(senderUsername)}
        </div>
      </div>
      <div className="fd-info">
        <div className="fd-pending-identity">
          <span className="fd-pending-name">@{senderUsername}</span>
        </div>
        <div className="fd-status-text fd-status-text--pending">
          INVITED YOU TO: <span style={{ color: 'var(--yellow)', fontWeight: 'bold' }}>{roomName.toUpperCase()}</span>
        </div>
      </div>
      <div className="fd-actions">
        <button
          className="fd-action-btn fd-action-btn--accept"
          onClick={handleAccept}
          disabled={acting}
          style={{ opacity: acting ? 0.5 : 1 }}
          title="Join Server"
        >
          <ApproveIcon2 />
        </button>
        <button
          className="fd-action-btn fd-action-btn--decline"
          onClick={handleDecline}
          disabled={acting}
          style={{ opacity: acting ? 0.5 : 1 }}
          title="Decline"
        >
          <RefuseIcon2 />
        </button>
      </div>
    </div>
  )
}


function SentRoomInviteItem({ invite, onCancel }: any) {
  const [acting, setActing] = useState(false)

  const recipientColor = colorFromName(invite.recipient_username)
  const roomName       = invite.room_name ?? 'A SERVER'

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (acting) return
    setActing(true)
    try { await onCancel(invite.id) } finally { setActing(false) }
  }

  return (
    <div className="fd-item">
      <div className="fd-avatar-wrap">
        <div className="fd-avatar" style={{ background: recipientColor }}>
          {getInitial(invite.recipient_username)}
        </div>
      </div>
      <div className="fd-info">
        <div className="fd-pending-identity">
          <span className="fd-pending-name">@{invite.recipient_username}</span>
        </div>
        <div className="fd-status-text fd-status-text--pending">
          INVITE SENT TO: <span style={{ color: 'var(--yellow)', fontWeight: 'bold' }}>{roomName.toUpperCase()}</span>
        </div>
      </div>
      <div className="fd-actions">
        <button
          className="fd-action-btn fd-action-btn--decline"
          onClick={handleCancel}
          disabled={acting}
          style={{ opacity: acting ? 0.5 : 1 }}
          title="Cancel invite"
        >
          <RefuseIcon2 />
        </button>
      </div>
    </div>
  )
}



export default function FriendsDashboard({
  tab,
  friends,
  pending,
  roomInvites = [],        
  sentRoomInvites = [],    
  currentUsername,
  onChat,
  onRemove,
  onAccept,
  onDecline,
  onCancel,
  onAcceptInvite,
  onDeclineInvite,
  onCancelRoomInvite,      
}: any) {
  const [filter, setFilter] = useState<'online' | 'all'>('online')
  const [query, setQuery]   = useState('')
  const presences = usePresenceStore(s => s.presences)

  if (tab === 'pending') {
    
    const incomingFriends = pending.filter((f: any) => f.recipient_username === currentUsername)
    const outgoingFriends = pending.filter((f: any) => f.sender_username === currentUsername)

    const totalCount = pending.length + roomInvites.length + sentRoomInvites.length

    return (
      <div className="friends-dashboard">
        <div className="fd-body">
          {totalCount === 0 ? (
            <div className="fd-empty">NO PENDING REQUESTS</div>
          ) : (
            <div className="fd-pending-grid">
              
              {/* ════════════════════════════════════════════════
                  SEÇÃO 1: 👥 FRIEND REQUESTS
              ════════════════════════════════════════════════ */}
              {(incomingFriends.length > 0 || outgoingFriends.length > 0) && (
                <div className="fd-pending-card-group">
                  <div className="fd-super-section-title"><FriendsIcon/> FRIEND REQUESTS</div>
                  
                  {}
                  {incomingFriends.length > 0 && (
                    <div className="fd-sub-block">
                      <div className="fd-sub-section-label incoming">INCOMING — {incomingFriends.length}</div>
                      <div className="fd-list-wrapper">
                        {incomingFriends.map((req: any) => (
                          <PendingItem
                            key={req.id}
                            req={req}
                            currentUsername={currentUsername}
                            onAccept={onAccept}
                            onDecline={onDecline}
                            onCancel={onCancel}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {}
                  {outgoingFriends.length > 0 && (
                    <div className="fd-sub-block">
                      <div className="fd-sub-section-label outgoing">SENT — {outgoingFriends.length}</div>
                      <div className="fd-list-wrapper">
                        {outgoingFriends.map((req: any) => (
                          <PendingItem
                            key={req.id}
                            req={req}
                            currentUsername={currentUsername}
                            onAccept={onAccept}
                            onDecline={onDecline}
                            onCancel={onCancel}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ════════════════════════════════════════════════
                  SEÇÃO 2: 🌐 SERVER INVITES
              ════════════════════════════════════════════════ */}
              {(roomInvites.length > 0 || sentRoomInvites.length > 0) && (
                <div className="fd-pending-card-group">
                  <div className="fd-super-section-title"><GlobeIcon/> SERVER INVITES</div>
                  
                  {}
                  {roomInvites.length > 0 && (
                    <div className="fd-sub-block">
                      <div className="fd-sub-section-label incoming"> RECEIVED — {roomInvites.length}</div>
                      <div className="fd-list-wrapper">
                        {roomInvites.map((inv: any) => (
                          <RoomInviteItem
                            key={inv.id}
                            invite={inv}
                            onAcceptInvite={onAcceptInvite}
                            onDeclineInvite={onDeclineInvite}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {}
                  {sentRoomInvites.length > 0 && (
                    <div className="fd-sub-block">
                      <div className="fd-sub-section-label outgoing">SENT — {sentRoomInvites.length}</div>
                      <div className="fd-list-wrapper">
                        {sentRoomInvites.map((inv: any) => (
                          <SentRoomInviteItem
                            key={inv.id}
                            invite={inv}
                            onCancel={onCancelRoomInvite}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    )
  }

  

  const displayFriends = friends.filter((f: any) => {
    const q = query.toLowerCase()
    if (q && !f.username.toLowerCase().includes(q) && !(f.name ?? '').toLowerCase().includes(q)) return false
    if (filter === 'online') {
      const s = presences[f.username]?.status ?? f.status
      return s !== 'offline'
    }
    return true
  }).sort((a: any, b: any) => {
    const nameA = (a.name || a.username).toLowerCase()
    const nameB = (b.name || b.username).toLowerCase()
    return nameA.localeCompare(nameB)
  })

  return (
    <div className="friends-dashboard">
      <div className="fd-body">

        <div className="fd-controls">
          <div className="fd-toggle">
            <button className={`fd-toggle-btn ${filter === 'online' ? 'active' : ''}`} onClick={() => setFilter('online')}>
              ONLINE
            </button>
            <button className={`fd-toggle-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              ALL
            </button>
          </div>

          <div className="fd-search">
            <input type="text" placeholder="SEARCH..." value={query} onChange={e => setQuery(e.target.value)} />
            <div className="fd-search__icon"><SearchIcon /></div>
          </div>
        </div>

        <div className="fd-section-label">
          {filter === 'online' ? 'ONLINE FRIENDS' : 'ALL FRIENDS'} — {displayFriends.length}
        </div>

        {displayFriends.length === 0 ? (
          <div className="fd-empty">
            {query.trim().length > 0
              ? 'NO FRIENDS FOUND'
              : filter === 'online'
                ? 'NO FRIENDS ONLINE'
                : 'NO FRIENDS YET'}
          </div>
        ) : (
          <div className="fd-list-wrapper">
            {displayFriends.map((f: any) => {
              const presence   = presences[f.username]
              const liveStatus = presence?.status ?? f.status ?? 'offline'
              const roomLabel  = presence?.roomName || f.room_name || null
              return (
                <FriendItem
                  key={f.username}
                  friend={f}
                  liveStatus={liveStatus}
                  roomLabel={roomLabel}
                  onChat={() => onChat(f.username)}
                  onRemove={() => onRemove(f.username)}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}