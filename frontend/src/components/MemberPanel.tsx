

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/member_panel.css'
import { ServerOwnerIcon } from './Icons'
import { usePresenceStore, type PresenceStatus } from '../store/presenceStore'
import { api } from '../api/auth'



export interface RoomMember {
  id: string
  username: string
  name: string
  avatar_color: string
  is_admin: boolean
  is_online: boolean
}

interface MemberPanelProps {
  isOpen: boolean
  onClose: () => void
  members: RoomMember[]
  roomName: string
  currentUser?: { username: string; name: string; avatar_color: string }
  onSelectMember?: (username: string) => void
}

interface PopoverState {
  member: RoomMember
  x: number
  y: number
}



function getInitial(name?: string | null): string {
  if (!name) return '?'
  return name.trim().charAt(0).toUpperCase()
}

function colorFromName(name: string): string {
  const palette = ['#247BA0','#3090BA','#63ABD1','#F25F5C','#F2803A','#FFE066','#5ba665','#8a5ba6','#a65b8a']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}



function StatusIcon({ status }: { status: PresenceStatus }) {
  return (
    <div className={`member-status-icon member-status-icon--${status}`} title={status.toUpperCase()}>
      {status === 'dnd' && <div className="member-status-icon__dnd-bar" />}
      {status === 'idle' && <div className="member-status-icon__idle-inner" />}
    </div>
  )
}



const POPOVER_WIDTH  = 220
const POPOVER_HEIGHT = 180

function MemberPopover({
  popover,
  status,
  onClose,
  onDm,
  onProfile,
}: {
  popover: PopoverState
  status: PresenceStatus
  onClose: () => void
  onDm: (username: string) => void
  onProfile: (username: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { member, x, y } = popover

  const safeX = Math.max(8, Math.min(x, window.innerWidth  - POPOVER_WIDTH  - 8))
  const safeY = Math.max(8, Math.min(y, window.innerHeight - POPOVER_HEIGHT - 8))

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const STATUS_LABEL: Record<PresenceStatus, string> = {
    online: 'ONLINE',
    idle:   'IDLE',
    dnd:    'DO NOT DISTURB',
    offline:'OFFLINE',
  }

  return (
    <div ref={ref} className="member-popover" style={{ left: safeX, top: safeY }}>
      <div className="member-popover-header">
        {}
        <div className="member-avatar member-avatar--small" style={{ background: member.avatar_color || colorFromName(member.username) }}>
          {getInitial(member.username)}
        </div>
        <div>
          <div className="member-popover-name">{member.name}</div>
          <div className="member-popover-username">@{member.username}</div>
        </div>
      </div>

      <div className="member-popover-status">
        <StatusIcon status={status} />
        <span>{STATUS_LABEL[status]}</span>
        {member.is_admin && <span className="admin-badge">ADMIN</span>}
      </div>

      <div className="member-popover-actions">
        <button className="popover-btn" onClick={() => { onDm(member.username); onClose() }}>
          💬 SEND DM
        </button>
        <button className="popover-btn" onClick={() => { onProfile(member.username); onClose() }}>
          👤 VIEW PROFILE
        </button>
      </div>
    </div>
  )
}



function MemberItem({
  member,
  status,
  onClick,
}: {
  member: RoomMember
  status: PresenceStatus
  onClick: (e: React.MouseEvent, member: RoomMember) => void
}) {
  const isActive = status !== 'offline'

  return (
    <button
      className={`member-item ${!isActive ? 'offline' : ''} member-item--${status}`}
      onClick={(e) => onClick(e, member)}
    >
      <div className="member-avatar-wrapper">
        {}
        <div className="member-avatar" style={{ background: status === 'offline' ? '#3A3848' : (member.avatar_color || colorFromName(member.username)) }}>
          {getInitial(member.username)}
        </div>
        <StatusIcon status={status} />
      </div>

      <div className="member-info">
        <div className="member-name">{member.name}</div>
        <div className="member-username">@{member.username}</div>
      </div>

      {member.is_admin && (
        <div className="member-admin">
          <ServerOwnerIcon />
        </div>
      )}
    </button>
  )
}



function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="member-section-header">
      {label} — {count}
    </div>
  )
}



export default function MemberPanel({
  isOpen,
  onClose,
  members,
  roomName,
  currentUser,
  onSelectMember,
}: MemberPanelProps) {
  const navigate = useNavigate()
  const [popover, setPopover] = useState<PopoverState | null>(null)

  const presences = usePresenceStore((s) => s.presences)
  const myStatus = usePresenceStore((s) => s.myStatus)
  const setBulkPresence = usePresenceStore((s) => s.setBulkPresence)

  useEffect(() => {
    if (!isOpen || members.length === 0) return

    const fetchMemberPresences = async () => {
      try {
        const usernames = members.map(m => m.username).join(',')
        const res = await api.get('/users/presence', { params: { usernames } })
        
        setBulkPresence(res.data.map((e: any) => ({
          username: e.username,
          status: e.status,
          roomId: e.room_id
        })))
      } catch (err) {
        console.error('Erro ao buscar presença dos membros da sala', err)
      }
    }

    fetchMemberPresences()
  }, [isOpen, members, setBulkPresence])

  const effectiveMembers: RoomMember[] = (() => {
    if (!currentUser) return members

    const alreadyIn = members.some((m) => m.username === currentUser.username)
    if (alreadyIn) return members

    const selfEntry: RoomMember = {
      id:           `self-${currentUser.username}`,
      username:     currentUser.username,
      name:         currentUser.name,
      avatar_color: currentUser.avatar_color,
      is_admin:     false,
      is_online:    true,
    }
    return [selfEntry, ...members]
  })()

  const getMemberStatus = (member: RoomMember): PresenceStatus => {
    if (currentUser && member.username === currentUser.username) {
      return myStatus
    }
    
    const stored = presences[member.username]
    if (stored) return stored.status
    
    return member.is_online ? 'online' : 'offline'
  }

  const activeMembers  = effectiveMembers.filter((m) => getMemberStatus(m) !== 'offline')
  const offlineMembers = effectiveMembers.filter((m) => getMemberStatus(m) === 'offline')

  const STATUS_ORDER: Record<PresenceStatus, number> = { online: 0, idle: 1, dnd: 2, offline: 3 }
  const sortedActive = [...activeMembers].sort((a, b) => {
    if (a.is_admin !== b.is_admin) return a.is_admin ? -1 : 1
    return STATUS_ORDER[getMemberStatus(a)] - STATUS_ORDER[getMemberStatus(b)]
  })

  const handleMemberClick = (e: React.MouseEvent, member: RoomMember) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const spaceLeft = rect.left - POPOVER_WIDTH - 8
    const x = spaceLeft > 0 ? spaceLeft : rect.right + 8
    const y = rect.top
    setPopover({ member, x, y })
  }

  return (
    <>
      <div className={`member-panel ${isOpen ? 'open' : ''}`}>
        <div className="member-list member-list--flush">

          {sortedActive.length > 0 && (
            <>
              <SectionHeader label="MEMBERS" count={sortedActive.length} />
              {sortedActive.map((member) => (
                <MemberItem
                  key={member.id || member.username}
                  member={member}
                  status={getMemberStatus(member)}
                  onClick={handleMemberClick}
                />
              ))}
            </>
          )}

          {offlineMembers.length > 0 && (
            <>
              <SectionHeader label="OFFLINE" count={offlineMembers.length} />
              {offlineMembers.map((member) => (
                <MemberItem
                  key={member.id || member.username}
                  member={member}
                  status="offline"
                  onClick={handleMemberClick}
                />
              ))}
            </>
          )}

        </div>
      </div>

      {popover && (
        <MemberPopover
          popover={popover}
          status={getMemberStatus(popover.member)}
          onClose={() => setPopover(null)}
          
          onDm={(username) => {
             if (onSelectMember) {
                onSelectMember(username) 
             } else {
                console.warn("A função onSelectMember não foi passada para o painel!")
             }
          }} 
          onProfile={(username) => navigate(`/profile/${username}`)} 
        />
      )}
    </>
  )
}