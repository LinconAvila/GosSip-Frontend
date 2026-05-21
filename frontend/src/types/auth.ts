export interface User {
  id: string
  username: string
  name: string
  email: string
  avatar_color: string
  dm_privacy?: 'everyone' | 'friends_only'
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  username: string
  email: string
  password: string
  avatar_color: string
}



export interface UpdateProfilePayload {
  name?: string
  username?: string
  avatar_color?: string
  dm_privacy?: 'everyone' | 'friends_only'
}

export interface UpdatePasswordPayload {
  current_password: string
  new_password: string
}