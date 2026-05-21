export interface SaveProfileData {
  name: string
  username: string
  avatar_color: string
}

export interface SavePrivacyData {
  dm_privacy: 'everyone' | 'friends_only'
}

export interface SavePasswordData {
  current: string
  next: string
  confirm: string
}