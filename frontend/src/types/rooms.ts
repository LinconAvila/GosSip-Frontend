





export interface RoomResponse {
  id: string
  name: string
  description: string | null
  is_private: boolean
  owner_username: string
  invite_code: string | null
  created_at: string
}


export interface RoomCreate {
  name: string
  description?: string
  is_private: boolean
}


export interface RoomJoin {
  invite_code?: string
}


export interface RoomResult {
  id: string
  name: string
  description: string
  is_private: boolean
  member_count: number
  online_count: number
  owner_username: string
  avatar_color: string   
  tags?: string[]
}


export interface CreateGroupData {
  name: string
  description: string
  is_private: boolean
  avatar_color: string  
}
