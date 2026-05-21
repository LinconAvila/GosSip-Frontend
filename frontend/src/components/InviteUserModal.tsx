

import { useState, useEffect, useRef } from 'react'
import '../styles/social_modals.css'
import { CloseIcon, MentionIcon, ApproveIcon, RefuseIcon, ApproveIcon2, EllipsisIcon, PendingIcon, DMIcon } from './Icons'



export interface UserResult {
  username: string
  name: string
  avatar_color: string
  is_member?: boolean
  has_pending_invite?: boolean
}

interface InviteUserModalProps {
  isOpen: boolean
  onClose: () => void
  groupName: string
  groupId: string
  currentUsername?: string
  onSearch?: (query: string) => Promise<UserResult[]>
  onInvite?: (username: string, groupId: string) => Promise<true | 'already_member' | 'already_invited' | false>
  onFetchMembers?: (groupId: string) => Promise<string[]>  
  onGoToPending?: () => void
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




type InviteState = 'none' | 'member' | 'pending_sent' | 'invite_sent_now'

function getInviteState(
  user: UserResult,
  invitedThisSession: Set<string>,
): InviteState {
  if (user.is_member)            return 'member'
  if (invitedThisSession.has(user.username)) return 'invite_sent_now'
  if (user.has_pending_invite)   return 'pending_sent'
  return 'none'
}



export default function InviteUserModal({
  isOpen,
  onClose,
  groupName,
  groupId,
  currentUsername,
  onSearch,
  onInvite,
  onFetchMembers,
  onGoToPending,
}: InviteUserModalProps) {
  const [query,    setQuery]    = useState('')
  const [results,  setResults]  = useState<UserResult[]>([])
  const [loading,  setLoading]  = useState(false)
  const [invited,  setInvited]  = useState<Set<string>>(new Set())
  const [sending,  setSending]  = useState<Set<string>>(new Set())
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)
  const [members,  setMembers]  = useState<Set<string>>(new Set())  

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  
  useEffect(() => {
    if (isOpen && groupId && onFetchMembers) {
      onFetchMembers(groupId).then(list => setMembers(new Set(list))).catch(() => {})
    }
    if (!isOpen) {
      setQuery('')
      setResults([])
      setInvited(new Set())
      setSending(new Set())
      setFeedback(null)
      setMembers(new Set())
    }
  }, [isOpen, groupId])

  const handleQueryChange = (q: string) => {
    setQuery(q)
    setFeedback(null)
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!q.trim() || q.trim().length < 2) {
      setResults([])
      return
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        if (onSearch) {
          const raw = await onSearch(q)
          
          const enriched = raw
            .filter(u => u.username !== currentUsername)
            .map(u => ({ ...u, is_member: u.is_member || members.has(u.username) }))
          setResults(enriched)
        }
      } catch (err) {
        console.error('Erro na busca', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  const handleInvite = async (username: string) => {
    if (sending.has(username)) return
    setFeedback(null)
    if (!onInvite) return

    setSending(prev => new Set(prev).add(username))
    try {
      const result = await onInvite(username, groupId)
      if (result === true) {
        setInvited(prev => new Set(prev).add(username))
        setFeedback({ msg: `INVITE SENT TO @${username}`, ok: true })
      } else if (result === 'already_member') {
        
        setResults(prev => prev.map(u =>
          u.username === username ? { ...u, is_member: true } : u
        ))
        setFeedback({ msg: `@${username} IS ALREADY IN THIS SERVER`, ok: false })
      } else if (result === 'already_invited') {
        
        setResults(prev => prev.map(u =>
          u.username === username ? { ...u, has_pending_invite: true } : u
        ))
        setFeedback({ msg: `@${username} ALREADY HAS A PENDING INVITE`, ok: false })
      } else {
        setFeedback({ msg: 'FAILED TO SEND INVITE', ok: false })
      }
    } catch {
      setFeedback({ msg: 'SOMETHING WENT WRONG', ok: false })
    } finally {
      setSending(prev => { const n = new Set(prev); n.delete(username); return n })
    }
  }

  const handleGoToPending = () => {
    onClose()
    onGoToPending?.()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="sm-overlay" onClick={onClose} />

      <div className="sm-modal">

        {}
        <div className="sm-titlebar">
          <div className="sm-titlebar-left">
            <div className="sm-title-dot" />
            <span className="sm-title-text">INVITE_USER.EXE</span>
          </div>
          <button className="sm-close-btn" onClick={onClose}><CloseIcon /></button>
        </div>

        {}
        <div className="sm-body">

          <div>
            <div className="sm-section-title">
              <span>■</span>
              INVITE TO: {groupName.toUpperCase()}
            </div>
            <div className="sm-sub">
              SEARCH BY USERNAME OR NAME — MINIMUM 2 CHARACTERS
            </div>
          </div>

          {}
          <div className="sm-search-shell">
            <span className="sm-search-prefix"><MentionIcon /></span>
            <input
              type="text"
              className="sm-search-input"
              placeholder="ENTER USERNAME..."
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              autoFocus
            />
          </div>

          {}
          {feedback && (
            <div className={`sm-feedback ${feedback.ok ? 'ok' : 'error'}`}>
              <span>{feedback.ok ? <ApproveIcon /> : <RefuseIcon />}</span>
              {feedback.msg}
            </div>
          )}

          {}
          <div className="sm-results">
            {loading ? (
              <div className="sm-empty">SEARCHING...</div>
            ) : query.trim().length < 2 ? (
              <div className="sm-empty">TYPE TO START SEARCHING</div>
            ) : results.length === 0 ? (
              <div className="sm-empty">NO USERS FOUND</div>
            ) : (
              results.map(user => {
                const state     = getInviteState(user, invited)
                const isSending = sending.has(user.username)

                return (
                  <div key={user.username} className="sm-result-item">
                    <div
                      className="sm-result-avatar"
                      style={{ background: user.avatar_color || colorFromName(user.username) }}
                    >
                      {getInitial(user.name || user.username)}
                    </div>

                    <div className="sm-result-info">
                      <div className="sm-result-name">{user.name}</div>
                      <div className="sm-result-username">@{user.username}</div>
                    </div>

                    {}

                    {state === 'member' ? (
                      
                      <button className="sm-action-btn already" disabled>
                        <ApproveIcon2 /> IN SERVER
                      </button>

                    ) : state === 'invite_sent_now' ? (
                      
                      <button className="sm-action-btn sent" disabled>
                        <ApproveIcon2 /> SENT
                      </button>

                    ) : state === 'pending_sent' ? (
                      
                      <button
                        className="sm-action-btn pending-received"
                        onClick={handleGoToPending}
                        title="This user already has a pending invite. Go to Pending to manage it."
                      >
                        <PendingIcon /> PENDING
                      </button>

                    ) : (
                      
                      <button
                        className="sm-action-btn invite"
                        onClick={() => handleInvite(user.username)}
                        disabled={isSending}
                        style={{ opacity: isSending ? 0.6 : 1 }}
                      >
                        {isSending ? <EllipsisIcon /> : <><DMIcon /> INVITE</>}
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>

        </div>
      </div>
    </>
  )
}