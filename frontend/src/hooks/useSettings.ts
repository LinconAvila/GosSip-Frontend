import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { updateProfile, updatePassword, deleteAccount } from '../api/users'
import type {
  SaveProfileData,
  SavePrivacyData,
  SavePasswordData,
  UpdateProfilePayload,
  UpdatePasswordPayload,
} from '../types'

interface FeedbackState {
  msg: string
  ok: boolean
}



function extractError(err: unknown): string {
  const detail = (err as any)?.response?.data?.detail
  if (typeof detail === 'string') return detail.toUpperCase()
  if (Array.isArray(detail)) return detail[0]?.msg?.toUpperCase() ?? 'VALIDATION ERROR'
  return 'UNKNOWN ERROR'
}



export function useSettings() {
  const navigate = useNavigate()

  const user    = useAuthStore(s => s.user)
  const setUser = useAuthStore(s => s.setUser)
  const clear   = useAuthStore(s => s.clear)

  const [saving,   setSaving]   = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)

  const flash = (msg: string, ok: boolean) => {
    setFeedback({ msg, ok })
    setTimeout(() => setFeedback(null), 3000)
  }

  

  const saveProfile = async (data: SaveProfileData) => {
    setSaving(true)
    try {
      const payload: UpdateProfilePayload = {
        name:         data.name.trim(),
        username:     data.username.trim().toLowerCase(),
        avatar_color: data.avatar_color,
      }
      const updated = await updateProfile(payload)
      setUser(updated)
      flash('PROFILE UPDATED.', true)
    } catch (err) {
      flash(extractError(err), false)
    } finally {
      setSaving(false)
    }
  }

  

  const savePrivacy = async (data: SavePrivacyData) => {
    setSaving(true)
    try {
      const updated = await updateProfile({ dm_privacy: data.dm_privacy })
      setUser(updated)
      flash('PRIVACY UPDATED.', true)
    } catch (err) {
      flash(extractError(err), false)
    } finally {
      setSaving(false)
    }
  }


  const savePassword = async (data: SavePasswordData): Promise<boolean> => {
    if (data.next !== data.confirm) {
      flash('PASSWORDS DO NOT MATCH.', false)
      return false
    }
    if (data.next.length < 8) {
      flash('PASSWORD TOO SHORT (MIN 8).', false)
      return false
    }

    setSaving(true)
    try {
      const payload: UpdatePasswordPayload = {
        current_password: data.current,
        new_password:     data.next,
      }
      await updatePassword(payload)
      flash('PASSWORD UPDATED.', true)
      return true
    } catch (err) {
      flash(extractError(err), false)
      return false
    } finally {
      setSaving(false)
    }
  }


  const removeAccount = async () => {
    setSaving(true)
    try {
      await deleteAccount()
      clear()
      navigate('/login', { replace: true })
    } catch (err) {
      flash(extractError(err), false)
    } finally {
      setSaving(false)
    }
  }


  const logout = () => {
    clear()
    navigate('/login', { replace: true })
  }

  return {
    user,
    saving,
    feedback,
    saveProfile,
    savePrivacy,
    savePassword,
    removeAccount,
    logout,
  }
}