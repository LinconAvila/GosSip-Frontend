

import { useState, useEffect, useRef } from 'react'
import '../styles/social_modals.css'
import { ApproveIcon, RefuseIcon, CloseIcon, MentionIcon, PendingIcon, PlusIcon, ApproveIcon2, EllipsisIcon } from './Icons'
import type { Friendship } from '../api/friends'



export interface UserResult {
  username: string
  name: string
  avatar_color: string
}

interface AddFriendModalProps {
  isOpen: boolean
  onClose: () => void
  onSearch?: (query: string) => Promise<UserResult[]>
  onSendRequest?: (username: string) => Promise<boolean>
  currentUsername?: string
  friends?: Friendship[]
  pending?: Friendship[]
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



type RelationState = 'none' | 'friend' | 'pending_sent' | 'pending_received' | 'self'

function getRelation(
  username: string,
  currentUsername: string | undefined,
  friends: Friendship[],
  pending: Friendship[],
): RelationState {
  if (username === currentUsername) return 'self'

  if (friends.some(
    f => f.sender_username === username || f.recipient_username === username
  )) return 'friend'

  const p = pending.find(
    f => f.sender_username === username || f.recipient_username === username
  )
  if (p) {
    return p.sender_username === currentUsername ? 'pending_sent' : 'pending_received'
  }

  return 'none'
}



export default function AddFriendModal({
  isOpen,
  onClose,
  onSearch,
  onSendRequest,
  currentUsername,
  friends = [],
  pending = [],
  onGoToPending,
}: AddFriendModalProps) {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<UserResult[]>([])
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState<Set<string>>(new Set())
  const [sending, setSending]   = useState<Set<string>>(new Set())
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
      setSent(new Set())
      setSending(new Set())
      setFeedback(null)
    }
  }, [isOpen])

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
          const r = await onSearch(q)
          setResults(r.filter(u => u.username !== currentUsername))
        }
      } catch (err) {
        console.error('Erro na busca', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  const handleSend = async (username: string) => {
    if (sending.has(username)) return

    setFeedback(null)
    if (!onSendRequest) return

    setSending(prev => new Set(prev).add(username))
    try {
      const ok = await onSendRequest(username)
      if (ok) {
        setSent(prev => new Set(prev).add(username))
        setFeedback({ msg: `REQUEST SENT TO @${username}`, ok: true })
      } else {
        setFeedback({ msg: 'FAILED TO SEND REQUEST', ok: false })
      }
    } catch {
      setFeedback({ msg: 'SOMETHING WENT WRONG', ok: false })
    } finally {
      setSending(prev => {
        const next = new Set(prev)
        next.delete(username)
        return next
      })
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
            <span className="sm-title-text">ADD_FRIEND.EXE</span>
          </div>
          <button className="sm-close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {}
        <div className="sm-body">

          <div>
            <div className="sm-section-title">
              <span>■</span>
              FIND A USER
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
                const relation = getRelation(user.username, currentUsername, friends, pending)
                const isSentThisSession = sent.has(user.username)
                const isSending = sending.has(user.username)

                return (
                  <div key={user.username} className="sm-result-item">
                    {}
                    <div
                      className="sm-result-avatar"
                      style={{ background: user.avatar_color || colorFromName(user.username) }}
                    >
                      {getInitial(user.username)}
                    </div>

                    <div className="sm-result-info">
                      <div className="sm-result-name">{user.name}</div>
                      <div className="sm-result-username">@{user.username}</div>
                    </div>

                    {}
                    {relation === 'self' ? null : relation === 'friend' ? (
                      <button className="sm-action-btn sent" disabled>
                        <ApproveIcon2 /> FRIENDS
                      </button>
                    ) : relation === 'pending_sent' || isSentThisSession ? (
                      <button className="sm-action-btn sent" disabled>
                        <ApproveIcon2 /> SENT
                      </button>
                    ) : relation === 'pending_received' ? (
                      <button
                        className="sm-action-btn pending-received"
                        onClick={handleGoToPending}
                        title="This user sent you a friend request. Go to Pending to accept or decline."
                      >
                        <PendingIcon /> PENDING
                      </button>
                    ) : (
                      <button
                        className="sm-action-btn send"
                        onClick={() => handleSend(user.username)}
                        disabled={isSending}
                        style={{ opacity: isSending ? 0.6 : 1 }}
                      >
                        {isSending ? <EllipsisIcon /> : <><PlusIcon /> ADD</>}
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