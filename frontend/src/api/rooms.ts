import { api } from './auth'
import type { RoomResponse, RoomCreate, RoomJoin } from '../types'

export const createRoom = (data: RoomCreate): Promise<RoomResponse> =>
  api.post<RoomResponse>('/rooms', data).then(r => r.data)

export const listMyRooms = (): Promise<RoomResponse[]> =>
  api.get<RoomResponse[]>('/rooms').then(r => r.data)

export const searchRooms = (q: string): Promise<RoomResponse[]> =>
  api.get<RoomResponse[]>('/rooms/search', { params: { q } }).then(r => r.data)

export const getRoomMembers = (roomId: string): Promise<any[]> =>
  api.get<any[]>(`/rooms/${roomId}/members`).then(r => r.data)

export const joinRoom = (roomId: string, data?: RoomJoin): Promise<RoomResponse> =>
  api.post<RoomResponse>(`/rooms/${roomId}/join`, data ?? {}).then(r => r.data)

export const leaveRoom = (roomId: string): Promise<void> =>
  api.post(`/rooms/${roomId}/leave`).then(() => undefined)

export const deleteRoom = (roomId: string): Promise<void> =>
  api.delete(`/rooms/${roomId}`).then(() => undefined)

export const updateInviteStatus = (
  inviteId: string, 
  status: 'accepted' | 'declined'
): Promise<any> =>
  api.patch(`/rooms/invites/${inviteId}`, { status }).then((r) => r.data)

export const listRoomMembers = (roomId: string): Promise<string[]> =>
  api.get<string[]>(`/rooms/${roomId}/members`).then(r => r.data)