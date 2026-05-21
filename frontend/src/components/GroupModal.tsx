import { useState, useEffect, useRef } from 'react'
import type { RoomResult, CreateGroupData, RoomResponse } from '../types'
import '../styles/group_modal.css'
import { ApproveIcon, CloseIcon, FriendsIcon, LockedPadlockIcon, PlayIcon, RefuseIcon, ReturnIcon, SearchIcon, SearchIcon2, UnlockedPadlockIcon } from './Icons'



type ModalView = 'home' | 'create' | 'search' | 'group-detail'

interface GroupModalProps {
  isOpen:         boolean
  onClose:        () => void
  onCreated:      (room: RoomResponse) => void          
  onCreateGroup:  (data: CreateGroupData) => Promise<RoomResponse | null>
  onJoinGroup:    (roomId: string) => Promise<boolean>
  onRequestJoin:  (roomId: string) => Promise<boolean>
  onSearchGroups: (query: string)  => Promise<RoomResult[]>
}



const AVATAR_COLORS = [
  '#247BA0', '#3090BA', '#63ABD1',
  '#F25F5C', '#F2803A', '#FFE066',
  '#5ba665', '#8a5ba6', '#a65b8a',
]

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase()
}



function HomeView({ onChoose }: { onChoose: (v: 'create' | 'search') => void }) {
  return (
    <div className="gm-home">
      <div className="gm-home-title">
        <span className="gm-pixel-icon">■</span>
        SERVER_MANAGER.EXE
      </div>
      <p className="gm-home-sub">WHAT DO YOU WANT TO DO?</p>
      <div className="gm-home-cards">
        <button className="gm-home-card" onClick={() => onChoose('create')}>
          <div className="gm-card-icon create-icon">+</div>
          <div className="gm-card-label">CREATE SERVER</div>
          <div className="gm-card-desc">SET UP A NEW SERVER</div>
        </button>
        <button className="gm-home-card" onClick={() => onChoose('search')}>
          <div className="gm-card-icon search-icon"><SearchIcon2 /></div>
          <div className="gm-card-label">SEARCH SERVERS</div>
          <div className="gm-card-desc">EXPLORE PUBLIC SERVERS</div>
        </button>
      </div>
    </div>
  )
}

function CreateView({
  onCreate,
}: {
  onCreate: (data: CreateGroupData) => Promise<RoomResponse | null>
}) {
  const [name,      setName]      = useState('')
  const [desc,      setDesc]      = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [color,     setColor]     = useState(AVATAR_COLORS[0])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [done,      setDone]      = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) { setError('SERVER NAME IS REQUIRED'); return }
    setLoading(true)
    setError(null)
    const room = await onCreate({ name: name.trim(), description: desc.trim(), is_private: isPrivate, avatar_color: color })
    setLoading(false)
    if (room) setDone(true)
    else setError('FAILED TO CREATE SERVER')
  }

  
  
  if (done) {
    return (
      <div className="gm-done">
        <div className="gm-done-icon"><ApproveIcon /></div>
        <div className="gm-done-text">SERVER INITIATED!</div>
      </div>
    )
  }

  return (
    <div className="gm-create">
      <div className="gm-section-title"><span>■</span> NEW SERVER</div>

      <div className="gm-avatar-preview">
        <div className="gm-avatar-big" style={{ background: color }}>
          {getInitial(name || 'S')}
        </div>
        <div className="gm-color-row">
          {AVATAR_COLORS.map(c => (
            <button
              key={c}
              className={`gm-color-dot ${color === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="gm-field">
        <label className="gm-label">SERVER NAME</label>
        <div className="gm-input-shell">
          <span className="gm-prefix">#</span>
          <input
            className="gm-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="MY AWESOME SERVER..."
            maxLength={50}
          />
        </div>
      </div>

      <div className="gm-field">
        <label className="gm-label">DESCRIPTION</label>
        <div className="gm-input-shell gm-input-shell--textarea">
          <span className="gm-prefix">»</span>
          <textarea
            className="gm-input gm-textarea"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="DESCRIBE YOUR SERVER..."
            maxLength={200}
            rows={3}
          />
        </div>
      </div>

      <div className="gm-field">
        <label className="gm-label">VISIBILITY</label>
        
        <div 
          className="gm-toggle-container" 
          onClick={() => setIsPrivate(!isPrivate)}
        >
          <div className={`gm-toggle-slider ${isPrivate ? 'right' : 'left'}`} />
          
          <div className={`gm-toggle-option ${!isPrivate ? 'active' : ''}`}>
            <UnlockedPadlockIcon /> OPEN
          </div>
          
          <div className={`gm-toggle-option ${isPrivate ? 'active' : ''}`}>
            <LockedPadlockIcon /> CLOSED
          </div>
        </div>

      </div>

      {error && <div className="gm-error"><RefuseIcon /> {error}</div>}

      <div className="gm-divider" />

      <button className="gm-btn gm-btn--primary" onClick={handleSubmit} disabled={loading}>
        <span><PlayIcon /></span>
        {loading ? 'INITIALIZING...' : 'INITIATE SERVER'}
      </button>
    </div>
  )
}

function SearchView({
  onSearch,
  onSelectRoom,
}: {
  onSearch:     (q: string) => Promise<RoomResult[]>
  onSelectRoom: (room: RoomResult) => void
}) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<RoomResult[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const r = await onSearch(query)
      setResults(r)
      setLoading(false)
    }, 300)
  }, [query, onSearch])

  return (
    <div className="gm-search">
      <div className="gm-section-title"><span>■</span> SEARCH SERVERS</div>

      <div className="gm-input-shell gm-search-shell">
        <span className="gm-prefix"><SearchIcon /></span>
        <input
          className="gm-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="SERVER NAME..."
          autoFocus
        />
        {loading && <span className="gm-search-spin">↻</span>}
      </div>

      <div className="gm-results">
        {results.length === 0 && query.trim() && !loading && (
          <div className="gm-empty">NO RESULTS FOUND</div>
        )}
        {results.length === 0 && !query.trim() && (
          <div className="gm-empty gm-empty--hint">ENTER A SERVER NAME TO SEARCH</div>
        )}
        {results.map(room => (
          <button key={room.id} className="gm-result-item" onClick={() => onSelectRoom(room)}>
            <div className="gm-result-avatar" style={{ background: room.avatar_color }}>
              {getInitial(room.name)}
            </div>
            <div className="gm-result-info">
              <div className="gm-result-name">
                {room.name}
                {room.is_private && <span className="gm-lock"><LockedPadlockIcon /></span>}
              </div>
              <div className="gm-result-meta">
                <span><FriendsIcon /> {room.member_count}</span>
                <span className="gm-online-dot">● {room.online_count} online</span>
              </div>
            </div>
            <div className="gm-result-arrow">›</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function GroupDetailView({
  room,
  onJoin,
  onRequest,
}: {
  room:      RoomResult
  onJoin:    (id: string) => Promise<boolean>
  onRequest: (id: string) => Promise<boolean>
}) {
  const [loading, setLoading] = useState(false)
  const [status,  setStatus]  = useState<'idle' | 'joined' | 'requested'>('idle')

  const handleAction = async () => {
    setLoading(true)
    if (room.is_private) {
      const ok = await onRequest(room.id)
      if (ok) setStatus('requested')
    } else {
      const ok = await onJoin(room.id)
      if (ok) setStatus('joined')
    }
    setLoading(false)
  }

  return (
    <div className="gm-detail">
      <div className="gm-detail-header">
        <div className="gm-detail-avatar" style={{ background: room.avatar_color }}>
          {getInitial(room.name)}
        </div>
        <div className="gm-detail-title-block">
          <div className="gm-detail-name">{room.name}</div>
          <div className="gm-detail-owner">por @{room.owner_username}</div>
        </div>
        <div className={`gm-badge ${room.is_private ? 'gm-badge--closed' : 'gm-badge--open'}`}>
          {room.is_private ? <LockedPadlockIcon /> : <UnlockedPadlockIcon />}
        </div>
      </div>

      <div className="gm-divider" />

      <div className="gm-detail-desc">{room.description || 'NO DESCRIPTION.'}</div>

      <div className="gm-stats-row">
        <div className="gm-stat">
          <div className="gm-stat-value">{room.member_count}</div>
          <div className="gm-stat-label">MEMBERS</div>
        </div>
        <div className="gm-stat-sep" />
        <div className="gm-stat">
          <div className="gm-stat-value gm-stat-value--online">{room.online_count}</div>
          <div className="gm-stat-label">ONLINE</div>
        </div>
        <div className="gm-stat-sep" />
        <div className="gm-stat">
          <div className="gm-stat-value">
            {room.member_count > 0 ? Math.round((room.online_count / room.member_count) * 100) : 0}%
          </div>
          <div className="gm-stat-label">ACTIVITY</div>
        </div>
      </div>

      {room.tags && room.tags.length > 0 && (
        <div className="gm-tags">
          {room.tags.map(tag => <span key={tag} className="gm-tag">#{tag}</span>)}
        </div>
      )}

      <div className="gm-divider" />

      {status === 'idle' && (
        <button
          className={`gm-btn ${room.is_private ? 'gm-btn--request' : 'gm-btn--primary'}`}
          onClick={handleAction}
          disabled={loading}
        >
          <span>{room.is_private ? '📨' : <PlayIcon />}</span>
          {loading ? 'WAIT...' : room.is_private ? 'REQUEST ACCESS' : 'JOIN SERVER'}
        </button>
      )}
      {status === 'joined'    && <div className="gm-success">✓ YOU HAVE JOINED THE SERVER!</div>}
      {status === 'requested' && <div className="gm-success gm-success--pending">📨 REQUEST SENT</div>}
    </div>
  )
}



export default function GroupModal({
  isOpen,
  onClose,
  onCreated,
  onCreateGroup,
  onJoinGroup,
  onRequestJoin,
  onSearchGroups,
}: GroupModalProps) {
  const [view,         setView]         = useState<ModalView>('home')
  const [selectedRoom, setSelectedRoom] = useState<RoomResult | null>(null)

  
  
  const handleCreate = async (data: CreateGroupData): Promise<RoomResponse | null> => {
    const room = await onCreateGroup(data)
    if (room) {
      setTimeout(() => onCreated(room), 1200)
    }
    return room
  }

  const handleSelectRoom = (room: RoomResult) => {
    setSelectedRoom(room)
    setView('group-detail')
  }

  const handleBack = () => {
    if (view === 'group-detail') { setView('search'); setSelectedRoom(null) }
    else if (view === 'create' || view === 'search') setView('home')
    else onClose()
  }

  const handleClose = () => {
    setView('home')
    setSelectedRoom(null)
    onClose()
  }

  if (!isOpen) return null

  const titles: Record<ModalView, string> = {
    home:           'SERVER_MANAGER.EXE',
    create:         'NEW SERVER',
    search:         'SEARCH SERVER',
    'group-detail': selectedRoom?.name ?? 'SERVER DETAILS',
  }

  return (
    <>
      <div className="gm-overlay" onClick={handleClose} />

      <div className="gm-modal">
        <div className="gm-titlebar">
          <div className="gm-titlebar-left">
            <div className="gm-title-dot" />
            <span className="gm-title-text">{titles[view]}</span>
          </div>
          <div className="gm-titlebar-right">
            {view !== 'home' && (
              <button className="gm-back-btn" onClick={handleBack}><ReturnIcon /></button>
            )}
            <button className="gm-close-btn" onClick={handleClose}><CloseIcon /></button>
          </div>
        </div>

        <div className="gm-body">
          {view === 'home' && (
            <HomeView onChoose={v => setView(v)} />
          )}
          {view === 'create' && (
            <CreateView onCreate={handleCreate} />
          )}
          {view === 'search' && (
            <SearchView onSearch={onSearchGroups} onSelectRoom={handleSelectRoom} />
          )}
          {view === 'group-detail' && selectedRoom && (
            <GroupDetailView room={selectedRoom} onJoin={onJoinGroup} onRequest={onRequestJoin} />
          )}
        </div>
      </div>
    </>
  )
}

