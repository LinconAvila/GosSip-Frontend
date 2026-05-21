

import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/auth.css'
import Logo from '../assets/Logo.png'
import { DMIcon, LockedPadlockIcon, MentionIcon, PlayIcon, ProfileIcon, ReturnLeftIcon } from '../components/Icons'

export default function Signup() {
  const { signup, loading, error } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [localError, setLocalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const setField = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError(null)
    setSuccess(false)

    if (form.password !== form.confirmPassword) {
      setLocalError('PASSWORDS DO NOT MATCH')
      return
    }

    if (form.password.length < 8) {
      setLocalError('PASSWORD TOO SHORT')
      return
    }

    const ok = await signup({
      name: form.name,
      username: form.username.toLowerCase(),
      email: form.email,
      password: form.password,
      avatar_color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
    })

    if (ok) {
      setSuccess(true)
    }
  }

  const displayError = localError ?? error

  const getSafeErrorMessage = (): string => {
    if (!displayError) return ''
    if (typeof displayError === 'string') return displayError

    if (Array.isArray(displayError)) {
      return displayError
        .map((e: any) => {
          const field = e.loc && e.loc.length > 0 ? e.loc[e.loc.length - 1] : ''
          return `${field ? field.toUpperCase() + ': ' : ''}${e.msg}`
        })
        .join(' | ')
    }

    if (typeof displayError === 'object' && displayError !== null) {
      const anyErr = displayError as any
      if (anyErr.msg) {
        const field = anyErr.loc && anyErr.loc.length > 0 ? anyErr.loc[anyErr.loc.length - 1] : ''
        return `${field ? field.toUpperCase() + ': ' : ''}${anyErr.msg}`
      }
      return anyErr.detail || JSON.stringify(displayError)
    }

    return String(displayError)
  }

  return (
    <div className="win-screen">
      {}
      {success && (
        <div className="win-popup">
          <div className="popup-window">
            <div className="popup-titlebar">
              <span>SYSTEM.MESSAGE</span>
            </div>
            <div className="popup-body">
              <div className="popup-icon">✓</div>
              <p>ACCOUNT CREATED</p>
              <button className="win-btn" onClick={() => navigate('/login')}>
                CONTINUE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="win-window signup-window">
        <div className="win-titlebar">
          <div className="title-left">
            <span className="title-dot" />
            <span className="title-text">
              <span className="title-brand">
                <span style={{ color: '#C3C3DD' }}>GOS</span>
                <span style={{ color: '#6E4412' }}>SIP</span>
              </span>
              .SIGNUP.exe
            </span>
          </div>
        </div>

        <div className="win-content">
          <div className="login-side">
            <div className="side-brand">
              <img src={Logo} alt="Logo" className="side-logo-img" />
              <span className="side-brand-name">
                <span style={{ color: '#C3C3DD' }}>GOS</span>
                <span style={{ color: '#6E4412' }}>SIP</span>
              </span>
            </div>

          <div className="login-version">
              © GOSSIP SYSTEM v1.0
            </div>
            
            <div className="side-divider" />

            <div className="side-info">
              <p>
                CREATE YOUR PROFILE
              </p>

              <p>
                PICK A UNIQUE USERNAME
              </p>

              <p>
                START CHATTING ONLINE
              </p>
            </div>

          </div>

          {}
          <form onSubmit={handleSubmit} className="win-body">
            <div className="form-header">
              <h1>SIGN UP</h1>
              <p>CREATE A NEW ACCOUNT</p>
            </div>

            {}
            <div className="win-field">
              <label className="win-label">NAME</label>
              <div className="input-shell">
                <span className="input-prefix"><ProfileIcon /></span>
                <input
                  type="text"
                  className="win-input"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="YOUR NAME"
                  required
                />
              </div>
            </div>

            {}
            <div className="win-field">
              <label className="win-label">USERNAME</label>
              <div className="input-shell">
                <span className="input-prefix"><MentionIcon /></span>
                <input
                  type="text"
                  className="win-input"
                  value={form.username}
                  onChange={e => setField('username', e.target.value)}
                  placeholder="USERNAME"
                  required
                />
              </div>
            </div>

            {}
            <div className="win-field">
              <label className="win-label">EMAIL</label>
              <div className="input-shell">
                <span className="input-prefix"><DMIcon /></span>
                <input
                  type="email"
                  className="win-input"
                  value={form.email}
                  onChange={e => setField('email', e.target.value)}
                  placeholder="USER@MAIL.COM"
                  required
                />
              </div>
            </div>

            {}
            <div className="win-field">
              <label className="win-label">PASSWORD</label>
              <div className="input-shell">
                <span className="input-prefix"><LockedPadlockIcon /></span>
                <input
                  type="password"
                  className="win-input"
                  value={form.password}
                  onChange={e => setField('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {}
            <div className="win-field">
              <label className="win-label">CONFIRM</label>
              <div className="input-shell">
                <span className="input-prefix"><LockedPadlockIcon /></span>
                <input
                  type="password"
                  className="win-input"
                  value={form.confirmPassword}
                  onChange={e => setField('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {displayError && (
              <div className="win-error">✖ {getSafeErrorMessage()}</div>
            )}

            <div className="win-divider" />

            {}
            <button type="submit" className="win-btn" disabled={loading}>
              <PlayIcon /> {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>

            <Link to="/login" className="win-btn win-btn--secondary">
              <ReturnLeftIcon /> BACK TO LOGIN
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}