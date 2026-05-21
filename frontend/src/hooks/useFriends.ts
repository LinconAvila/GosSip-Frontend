import { useState, useCallback, useEffect } from 'react'
import { friendsApi } from '../api/friends'
import type { Friendship } from '../api/friends'

function extractError(err: unknown): string {
  const detail = (err as any)?.response?.data?.detail
  if (typeof detail === 'string') return detail.toUpperCase()
  return 'UNKNOWN ERROR'
}

export function useFriends() {
  const [friends, setFriends]   = useState<Friendship[]>([])
  const [pending, setPending]   = useState<Friendship[]>([])
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [accepted, pend] = await Promise.all([
        friendsApi.getAll(),
        friendsApi.getPending(),
      ])
      setFriends(accepted)
      setPending(pend)
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addFriend = useCallback(async (username: string): Promise<boolean> => {
    try {
      await friendsApi.sendRequest(username)
      
      
      
      await fetchAll()
      return true
    } catch (err: any) {
      
      
      
      
      if (err?.response?.status === 409) {
        await fetchAll()
        return true
      }
      setError(extractError(err))
      return false
    }
  }, [fetchAll])

  const respond = useCallback(
    async (id: string, status: 'accepted' | 'declined' | 'blocked') => {
      try {
        await friendsApi.updateStatus(id, status)
        await fetchAll()
      } catch (err) {
        setError(extractError(err))
      }
    },
    [fetchAll]
  )

  const removeFriend = useCallback(
    async (id: string) => {
      try {
        await friendsApi.remove(id)
        setFriends((prev) => prev.filter((f) => f.id !== id))
      } catch (err) {
        setError(extractError(err))
      }
    },
    []
  )

  return {
    friends,
    pending,
    loading,
    error,
    fetchAll,
    addFriend,
    respond,
    removeFriend,
  }
}