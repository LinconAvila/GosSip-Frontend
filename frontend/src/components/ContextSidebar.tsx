

import { useState, useRef, useEffect } from 'react' 
import '../styles/context_sidebar.css'
import { SearchIcon, FriendsIcon, AddFriendIcon, PendingIcon, InviteIcon, MailboxIcon,OptionsIcon, DMIcon } from './Icons'
import { usePresenceStore } from '../store/presenceStore'
import DebugTerminal from './DebugTerminal'



export interface DmEntry {
  username: string; name: string; avatar_color: string;
  status: 'online' | 'idle' | 'offline' | 'dnd';
  last_message: string; unread?: number; room_name?: string | null;
}
export interface GroupInfo {
  id: string; name: string; avatar_color: string;
  member_count: number; online_count: number; is_admin?: boolean;
}

type DmTab = 'friends' | 'pending' | 'add'

interface ContextSidebarProps {
  mode: 'dm' | 'group'
  dms?: DmEntry[]
  activeDmUsername?: string | null
  pendingCount?: number
  onSelectDm?: (username: string) => void
  onTabChange?: (tab: DmTab) => void
  activeTab?: DmTab | null
  groupInfo?: GroupInfo | null
  onInviteUser?: () => void
  user: { name: string; username: string; avatar_color: string } | null
  onUserPanelOpen: () => void
  onSettingsOpen: () => void
  onSearch?: (q: string) => void

  
  roomId?: string
  isOwner?: boolean
  onLeaveGroup?: (roomId: string) => void
  onDeleteGroup?: (roomId: string) => void
}

function getInitial(name?: string | null) { return name ? name.trim().charAt(0).toUpperCase() : '?' }

function colorFromName(name: string): string {
  const palette = ['#247BA0','#3090BA','#63ABD1','#F25F5C','#F2803A','#FFE066','#5ba665','#8a5ba6','#a65b8a']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

function DmItem({ dm, isActive, onSelect }: { dm: DmEntry, isActive: boolean, onSelect: () => void }) {
  const presence = usePresenceStore((s) => s.presences[dm.username])
  const liveStatus = presence?.status ?? dm.status
  const roomLabel = presence?.roomName ?? dm.room_name ?? null

  return (
    <button className={`ctx-dm-item ${isActive ? 'active' : ''}`} onClick={onSelect}>
      <div className="ctx-dm-avatar-wrap">
        {}
        <div className="ctx-dm-avatar" style={{ background: dm.avatar_color || colorFromName(dm.username) }}>{getInitial(dm.username)}</div>
        <div className={`ctx-dm-status ${liveStatus}`} />
      </div>
      <div className="ctx-dm-info">
        <div className="ctx-dm-name">{dm.username}</div>
        {roomLabel && liveStatus !== 'offline' ? (
          <div className="ctx-dm-room" title={`Currently in: ${roomLabel}`}><span className="ctx-dm-room-icon">■</span> IN: {roomLabel.toUpperCase()}</div>
        ) : (
          <div className="ctx-dm-last">{dm.last_message}</div>
        )}
      </div>
      {dm.unread ? <div className="ctx-dm-unread">{dm.unread > 9 ? '9+' : dm.unread}</div> : null}
    </button>
  )
}

function DmMode({ dms = [], activeDmUsername, pendingCount = 0, activeTab, onSelectDm, onTabChange, onSearch }: any) {
  const [query, setQuery] = useState('')
  const filtered = query.trim() ? dms.filter((d: any) => d.username.toLowerCase().includes(query.toLowerCase()) || (d.name && d.name.toLowerCase().includes(query.toLowerCase()))) : dms

  const tabs: { key: DmTab; label: string; icon: React.ReactNode }[] = [
    { key: 'friends', label: 'FRIENDS', icon: <FriendsIcon /> },
    { key: 'pending', label: 'PENDING', icon: <PendingIcon /> },
    { key: 'add', label: 'ADD FRIEND', icon: <AddFriendIcon /> },
  ]

  return (
    <>
      <div className="ctx-search-wrap">
        <div className="ctx-search-shell">
          <button className="ctx-search-icon"><SearchIcon /></button>
          <input type="text" className="ctx-search-input" placeholder="SEARCH DMs..." value={query} onChange={e => { setQuery(e.target.value); onSearch?.(e.target.value); }} />
        </div>
      </div>
      <div className="ctx-nav">
        {tabs.map((t: any) => (
          <button key={t.key} className={`ctx-nav-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => onTabChange?.(t.key)}>
            <span className="ctx-nav-icon">{t.icon}</span>{t.label}
            {t.key === 'pending' && pendingCount > 0 && <span className="ctx-nav-badge">{pendingCount}</span>}
          </button>
        ))}
      </div>
      <div className="ctx-section-label">DIRECT MESSAGES</div>
      <div className="ctx-list">
        {filtered.map((dm: any) => <DmItem key={dm.username} dm={dm} isActive={activeDmUsername === dm.username} onSelect={() => onSelectDm?.(dm.username)} />)}
        
        {filtered.length === 0 && (
          <div className="ctx-empty-state">
            {query.trim() ? 'NO MATCHING DMs' : 'NO DIRECT MESSAGES YET'}
          </div>
        )}
      </div>
    </>
  )
}

function GroupMode({ groupInfo, onInviteUser, roomId, isOwner, onLeaveGroup, onDeleteGroup, onSettingsOpen }: any) {
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const optionsBtnRef = useRef<HTMLButtonElement>(null)

  
  useEffect(() => {
    setOptionsOpen(false)
  }, [roomId])

  if (!groupInfo) return null

  const handleLeave = async () => {
    if (!roomId || !onLeaveGroup) return;
    if (confirm("Tem certeza de que deseja sair deste grupo?")) {
      setLoading(true);
      await onLeaveGroup(roomId);
      setLoading(false);
      setOptionsOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!roomId || !onDeleteGroup) return;
    if (confirm("🚨 ATENÇÃO: Deseja EXCLUIR este grupo permanentemente?\n\nEsta operação removerá todas as mensagens e membros e não pode ser desfeita.")) {
      setLoading(true);
      await onDeleteGroup(roomId);
      setLoading(false);
      setOptionsOpen(false);
    }
  };

  return (
    <>
      <div className="ctx-group-info relative" style={{ position: 'relative' }}>
        <div className="ctx-group-header flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex gap-2 min-w-0 flex-1 items-center" style={{ display: 'flex', gap: '8px', minWidth: 0, flex: 1, alignItems: 'center' }}>
            <div className="ctx-group-avatar" style={{ background: groupInfo.avatar_color }}>{getInitial(groupInfo.name)}</div>
            <div className="ctx-group-name truncate" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{groupInfo.name.toUpperCase()}</div>
          </div>

          <button 
            ref={optionsBtnRef}
            className={`chat-topbar-btn ${optionsOpen ? 'active' : ''}`}
            onClick={() => setOptionsOpen((v) => !v)}
            title="SERVER OPTIONS"
            disabled={loading}
            style={{ flexShrink: 0, width: '36px', height: '36px', margin: 0 }}
          >
            <OptionsIcon />
          </button>
        </div>

        {}
        {optionsOpen && (
          <>
            {}
            <div 
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                zIndex: 9998, 
                cursor: 'default',
                background: 'transparent'
              }} 
              onClick={() => setOptionsOpen(false)} 
            />

            <div className="ctx-options-dropdown" style={{ zIndex: 9999 }}>
              <button className="ctx-options-btn" onClick={() => setOptionsOpen(false)}>
                <span>📄</span> PROPRIEDADES
              </button>
              
              <button 
                className="ctx-options-btn" 
                onClick={() => {
                  onSettingsOpen();
                  setOptionsOpen(false);
                }}
              >
                <span>⚙️</span> CONFIGURAÇÕES
              </button>

              <div className="ctx-options-divider" />

              {isOwner ? (
                <button 
                  onClick={handleDelete}
                  className="ctx-options-btn"
                  style={{ color: 'var(--red)' }}
                  disabled={loading}
                >
                  <span>💥</span> EXCLUIR GRUPO
                </button>
              ) : (
                <button 
                  onClick={handleLeave}
                  className="ctx-options-btn"
                  style={{ color: 'var(--orange)' }}
                  disabled={loading}
                >
                  <span>🚪</span> SAIR DO GRUPO
                </button>
              )}
            </div>
          </>
        )}

        <div className="ctx-group-stats mt-2">
          <div className="ctx-group-stat"><div className="ctx-group-stat-val online">{groupInfo.online_count}</div><div className="ctx-group-stat-label">ONLINE</div></div>
          <div className="ctx-stat-sep" />
          <div className="ctx-group-stat"><div className="ctx-group-stat-val">{groupInfo.member_count}</div><div className="ctx-group-stat-label">MEMBERS</div></div>
        </div>
      </div>
      <button className="ctx-invite-btn" onClick={onInviteUser}>
        <DMIcon /> INVITE TO SERVER
      </button>
      <div className="ctx-debug-wrap">
        <DebugTerminal />
      </div>
    </>
  )
}

export default function ContextSidebar({ 
  mode, dms, activeDmUsername, pendingCount, onSelectDm, onTabChange, activeTab, groupInfo, onInviteUser, onSearch, user,
  roomId, isOwner, onLeaveGroup, onDeleteGroup, onSettingsOpen 
}: ContextSidebarProps) {
  return (
    <aside className="ctx-sidebar">
      <div className="ctx-header"><div className="ctx-header-title"><div className="ctx-header-dot" />{mode === 'dm' ? 'DIRECT MESSAGES' : 'SERVER'}</div></div>
      {mode === 'dm' ? (
        <DmMode dms={dms} activeDmUsername={activeDmUsername} pendingCount={pendingCount} activeTab={activeTab} onSelectDm={onSelectDm} onTabChange={onTabChange} onSearch={onSearch} />
      ) : (
        <GroupMode 
          groupInfo={groupInfo} 
          onInviteUser={onInviteUser} 
          roomId={roomId}
          isOwner={isOwner}
          onLeaveGroup={onLeaveGroup}
          onDeleteGroup={onDeleteGroup}
          onSettingsOpen={onSettingsOpen}
        />
      )}
    </aside>
  )
}