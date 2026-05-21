
import { useState, useCallback, useEffect } from 'react'
import { inboxApi, type SentRoomInviteItem } from '../api/inbox'
import { friendsApi } from '../api/friends'
import { updateInviteStatus } from '../api/rooms'

function colorFromUser(name: string): string {
  const palette = ['#247BA0','#3090BA','#63ABD1','#F25F5C','#F2803A','#FFE066','#5ba665','#8a5ba6','#a65b8a']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

export function useInbox(onFriendsChange?: () => void) {
  const [notifications,    setNotifications]    = useState<any[]>([])
  const [sentRoomInvites,  setSentRoomInvites]  = useState<SentRoomInviteItem[]>([])
  const [loading,          setLoading]          = useState(false)

  

  const fetchInbox = useCallback(async () => {
    setLoading(true)
    try {
      const data = await inboxApi.getInbox()
      const formatted = data.map(item => {
        if (item.type === 'friend_request') {
          return {
            id:               item.id,
            type:             'friend_request',
            from_username:    item.sender,
            from_avatar_color: colorFromUser(item.sender),
            text:             `**@${item.sender}** sent you a friend request`,
            time:             item.created_at,
          }
        } else {
          
          const resolvedRoomName = item.room_name || (item as any).roomName || null

          return {
            id:               item.id,
            type:             'group_invite',
            from_username:    item.sender,
            room_name:        resolvedRoomName,
            from_avatar_color: colorFromUser(item.sender),
            
            text:             resolvedRoomName 
              ? `**@${item.sender}** invited you to join **${resolvedRoomName}**`
              : `**@${item.sender}** invited you to join a **Server**`,
            time:             item.created_at,
          }
        }
      })
      setNotifications(formatted)
    } catch (err) {
      console.error('Failed to fetch inbox:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  

  const fetchSentRoomInvites = useCallback(async () => {
    try {
      const data = await inboxApi.getSentRoomInvites()
      setSentRoomInvites(data.filter(i => i.status === 'pending'))
    } catch (err) {
      console.error('Failed to fetch sent room invites:', err)
    }
  }, [])

  

  useEffect(() => {
    fetchInbox()
    fetchSentRoomInvites()
  }, [fetchInbox, fetchSentRoomInvites])

  

  const acceptFriend = async (id: string) => {
    try {
      await friendsApi.updateStatus(id, 'accepted')
      fetchInbox()
      onFriendsChange?.()
    } catch (e) { console.error(e) }
  }

  const declineFriend = async (id: string) => {
    try {
      await friendsApi.updateStatus(id, 'declined')
      fetchInbox()
      onFriendsChange?.()
    } catch (e) { console.error(e) }
  }

  const acceptInvite = async (id: string) => {
    try { await updateInviteStatus(id, 'accepted'); fetchInbox() } catch (e) { console.error(e) }
  }

  const declineInvite = async (id: string) => {
    try { await updateInviteStatus(id, 'declined'); fetchInbox() } catch (e) { console.error(e) }
  }

  

  const cancelRoomInvite = async (id: string) => {
    try {
      await inboxApi.cancelRoomInvite(id)
      fetchSentRoomInvites()
    } catch (e) { console.error(e) }
  }

  return {
    notifications,
    sentRoomInvites,
    loading,
    fetchInbox,
    fetchSentRoomInvites,
    acceptFriend,
    declineFriend,
    acceptInvite,
    declineInvite,
    cancelRoomInvite,
  }
}