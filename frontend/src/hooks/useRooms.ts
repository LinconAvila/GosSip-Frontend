import { useState, useCallback } from 'react'
import { createRoom, listMyRooms, searchRooms, joinRoom, leaveRoom, deleteRoom } from '../api/rooms'
import type { RoomResponse, RoomResult, CreateGroupData } from '../types'
import { api } from '../api/auth'


function colorFromName(name: string): string {
  const palette = [
    '#247BA0', '#3090BA', '#63ABD1',
    '#F25F5C', '#F2803A', '#FFE066',
    '#5ba665', '#8a5ba6', '#a65b8a',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}



export function toRoomResult(room: RoomResponse): RoomResult {
  return {
    id:             room.id,
    name:           room.name,
    description:    room.description ?? '',
    is_private:     room.is_private,
    member_count:   0,
    online_count:   0,
    owner_username: room.owner_username,
    avatar_color:   colorFromName(room.name),
  }
}



export { colorFromName }



function extractError(err: unknown): string {
  const detail = (err as any)?.response?.data?.detail
  if (typeof detail === 'string') return detail.toUpperCase()
  if (Array.isArray(detail)) return detail[0]?.msg?.toUpperCase() ?? 'VALIDATION ERROR'
  return 'UNKNOWN ERROR'
}



export function useRooms() {
  const [myRooms, setMyRooms] = useState<RoomResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const fetchMyRooms = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rooms = await listMyRooms()
      setMyRooms(rooms)
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  
  
  const handleCreateGroup = useCallback(async (data: CreateGroupData): Promise<RoomResponse | null> => {
    try {
      const newRoom = await createRoom({
        name:        data.name,
        description: data.description || undefined,
        is_private:  data.is_private,
      })
      setMyRooms(prev => [newRoom, ...prev])
      return newRoom
    } catch (err) {
      console.error('[useRooms] createRoom:', extractError(err))
      return null
    }
  }, [])

  const handleSearchGroups = useCallback(async (query: string): Promise<RoomResult[]> => {
    try {
      const rooms = await searchRooms(query)
      return rooms.map(toRoomResult)
    } catch (err) {
      console.error('[useRooms] searchRooms:', extractError(err))
      return []
    }
  }, [])

  const handleJoinGroup = useCallback(async (roomId: string): Promise<boolean> => {
    try {
      const joined = await joinRoom(roomId)
      setMyRooms(prev =>
        prev.some(r => r.id === joined.id) ? prev : [joined, ...prev]
      )
      return true
    } catch (err) {
      if ((err as any)?.response?.status === 409) return true
      console.error('[useRooms] joinRoom:', extractError(err))
      return false
    }
  }, [])

  const handleRequestJoin = useCallback(async (_roomId: string): Promise<boolean> => {
    return true
  }, [])

  
  
  const inviteUserToRoom = useCallback(async (
    username: string,
    roomId: string,
  ): Promise<true | 'already_member' | 'already_invited' | false> => {
    try {
      await api.post(`/rooms/${roomId}/invite`, { recipient_username: username })
      return true
    } catch (err) {
      const detail: string = (err as any)?.response?.data?.detail ?? ''
      if ((err as any)?.response?.status === 409) {
        if (detail.toLowerCase().includes('membro')) return 'already_member'
        if (detail.toLowerCase().includes('convite')) return 'already_invited'
        return 'already_member'
      }
      console.error('[useRooms] inviteUserToRoom:', detail)
      return false
    }
  }, [])


  const handleLeaveGroup = useCallback(async (roomId: string): Promise<boolean> => {
    try {
      await leaveRoom(roomId)
      
      setMyRooms(prev => prev.filter(r => r.id !== roomId))
      return true
    } catch (err) {
      console.error('[useRooms] leaveRoom:', extractError(err))
      alert(extractError(err)) 
      return false
    }
  }, [])

  
  const handleDeleteGroup = useCallback(async (roomId: string): Promise<boolean> => {
    try {
      await deleteRoom(roomId)
      
      setMyRooms(prev => prev.filter(r => r.id !== roomId))
      return true
    } catch (err) {
      console.error('[useRooms] deleteRoom:', extractError(err))
      alert(extractError(err))
      return false
    }
  }, [])

  return {
    myRooms,
    loading,
    error,
    fetchMyRooms,
    handleCreateGroup,
    handleSearchGroups,
    handleJoinGroup,
    handleRequestJoin,
    inviteUserToRoom,
    handleLeaveGroup,
    handleDeleteGroup,
  }
}