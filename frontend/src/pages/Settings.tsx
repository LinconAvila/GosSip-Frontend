

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'
import '../styles/settings.css'
import { LogoutIcon } from '../components/Icons'
import { ReturnIcon } from '../components/Icons'
import { ProfileIcon } from '../components/Icons'



type Section = 'account' | 'privacy' | 'password' | 'danger'

interface FormState {
  name: string
  username: string
  email: string
  avatar_color: string
  dm_privacy: 'everyone' | 'friends_only'
}

interface PasswordForm {
  current: string
  next: string
  confirm: string
}



const AVATAR_COLORS = [
  '#F25F5C', '#F2803A', '#FFE066',
  '#3090BA', '#247BA0', '#63ABD1',
  '#5b5ea6', '#8a5ba6', '#5ba665',
]



function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="field-label">{children}</label>
}

function Field({
  label, value, onChange, type = 'text', disabled = false, placeholder = '',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  disabled?: boolean
  placeholder?: string
}) {
  return (
    <div className="field">
      <FieldLabel>{label}</FieldLabel>
      <div className="field-shell">
        <span className="field-prefix">{'>'}</span>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="field-input"
        />
      </div>
    </div>
  )
}

function Btn({
  children, onClick, disabled = false, danger = false,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`retro-btn ${danger ? 'danger' : ''}`}
    >
      <span className="btn-arrow">►</span>
      {children}
    </button>
  )
}


function Feedback({ msg, ok }: { msg: string; ok: boolean }) {
  if (!msg) return null
  return (
    <div className={`feedback ${ok ? 'ok' : 'error'}`}>
      <span className="feedback-icon">{ok ? '✔' : '✖'}</span>
      {msg}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-title">
      <span className="section-bullet">■</span>
      {children}
    </div>
  )
}



export default function Settings() {
  const navigate  = useNavigate()
  const [params]  = useSearchParams()

  const {
    user,
    saving,
    feedback,
    saveProfile,
    savePrivacy,
    savePassword,
    removeAccount,
    logout,
  } = useSettings()

  const initialSection = (params.get('section') as Section) ?? 'account'
  const [section, setSection] = useState<Section>(initialSection)

  const [form, setForm] = useState<FormState>({
    name:         user?.name         ?? '',
    username:     user?.username     ?? '',
    email:        (user as any)?.email        ?? '',
    avatar_color: (user as any)?.avatar_color ?? AVATAR_COLORS[3],
    dm_privacy:   (user as any)?.dm_privacy   ?? 'everyone',
  })

  const [pwForm, setPwForm] = useState<PasswordForm>({
    current: '',
    next:    '',
    confirm: '',
  })

  useEffect(() => {
    if (!user) return
    setForm(prev => ({
      ...prev,
      name:         user.name,
      username:     user.username,
      email:        (user as any).email        ?? prev.email,
      avatar_color: (user as any).avatar_color ?? prev.avatar_color,
      dm_privacy:   (user as any).dm_privacy   ?? prev.dm_privacy,
    }))
  }, [user])

  useEffect(() => {
    const s = params.get('section') as Section
    if (s) setSection(s)
  }, [params])

  

  const handleSaveAccount = () =>
    saveProfile({
      name:         form.name,
      username:     form.username,
      avatar_color: form.avatar_color,
    })

  const handleSavePrivacy = () =>
    savePrivacy({ dm_privacy: form.dm_privacy })

  const handleSavePassword = async () => {
    const ok = await savePassword(pwForm)
    if (ok) setPwForm({ current: '', next: '', confirm: '' })
  }

  const handleDeleteAccount = () => {
    if (window.confirm('DELETE ACCOUNT? THIS CANNOT BE UNDONE.')) {
      removeAccount()
    }
  }

  const navItems: { key: Section; label: string }[] = [
    { key: 'account',  label: 'USER PROFILE'  },
    { key: 'privacy',  label: 'PRIVACY'        },
    { key: 'password', label: 'PASSWORD'       },
    { key: 'danger',   label: 'DANGER ZONE'   },
  ]

  return (
    <div className="settings-screen">

      {}
      <aside className="settings-sidebar">

        <div>
          <div className="sidebar-top">
            <div className="sidebar-logo">CHAT.EXE</div>
            <div className="sidebar-version">v1.0 SYSTEM PANEL</div>
          </div>

          <div className="sidebar-profile">
            <div
              className="sidebar-avatar"
              style={{ background: form.avatar_color }}
            >
              {}
              {getInitial(form.username || 'guest')}
            </div>
            <div>
              <div className="sidebar-name">
                {form.name || 'UNKNOWN'}
              </div>
              <div className="sidebar-username">
                @{form.username || 'guest'}
              </div>
            </div>
          </div>

          <nav className="settings-nav">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`settings-nav-item ${section === item.key ? 'active' : ''}`}
              >
                <span>{section === item.key ? '►' : '•'}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button onClick={() => navigate(-1)} className="settings-back">
            <ReturnIcon /> BACK
          </button>
          <button onClick={logout} className="settings-logout">
            <LogoutIcon /> LOGOUT
          </button>
        </div>

      </aside>

      {}
      <main className="settings-content">
        <div className="settings-window">

          <div className="window-titlebar">
            <div className="window-title">SETTINGS_PANEL.exe</div>
            <div className="window-controls">
              <button className="sm-close-btn" onClick={() => navigate(-1)}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 13H16V14H17V15H18V16H19V17H20V18H21V19H22V20H21V21H20V22H19V21H18V20H17V19H16V18H15V17H14V16H13V15H11V16H10V17H9V18H8V19H7V20H6V21H5V22H4V21H3V20H2V19H3V18H4V17H5V16H6V15H7V14H8V13H9V11H8V10H7V9H6V8H5V7H4V6H3V5H2V4H3V3H4V2H5V3H6V4H7V5H8V6H9V7H10V8H11V9H13V8H14V7H15V6H16V5H17V4H18V3H19V2H20V3H21V4H22V5H21V6H20V7H19V8H18V9H17V10H16V11H15V13Z" fill="currentColor"></path>
      </svg>
    </button>
            </div>
          </div>

          <div className="window-body">

            {feedback && (
              <Feedback msg={feedback.msg} ok={feedback.ok} />
            )}

            {}
            {section === 'account' && (
              <div>

                <SectionTitle>USER PROFILE</SectionTitle>
                

                <div className="profile-card">
                  <div
                    className="profile-avatar"
                    style={{ background: form.avatar_color }}
                  >
                    {}
                    {getInitial(form.username || 'guest')}
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">
                      {form.name || 'UNKNOWN'}
                    </div>
                    <div className="profile-handle">
                      @{form.username || 'guest'}
                    </div>
                    <div className="profile-status">● ONLINE</div>
                  </div>
                </div>

                <div className="retro-divider" />

                <Field
                  label="DISPLAY NAME"
                  value={form.name}
                  onChange={v => setForm(p => ({ ...p, name: v }))}
                />

                <Field
                  label="USERNAME"
                  value={form.username}
                  onChange={v => setForm(p => ({ ...p, username: v }))}
                  placeholder="MIN 3 CHARS"
                />

                <Field
                  label="EMAIL"
                  value={form.email}
                  onChange={() => {}}
                  disabled
                  placeholder="LOCKED"
                />

                {}
                <div className="avatar-section">
                  <FieldLabel>AVATAR COLOR</FieldLabel>
                  <div className="avatar-colors">
                    {AVATAR_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() =>
                          setForm(p => ({ ...p, avatar_color: color }))
                        }
                        className={`avatar-color ${form.avatar_color === color ? 'active' : ''}`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>

                <Btn onClick={handleSaveAccount} disabled={saving}>
                  {saving ? 'SAVING...' : 'SAVE PROFILE'}
                </Btn>
              </div>
            )}

            {}
            {section === 'privacy' && (
              <div>
                <SectionTitle>PRIVACY SETTINGS</SectionTitle>
                <div className="retro-divider" />

                <div className="privacy-options">
                  {(['everyone', 'friends_only'] as const).map(opt => (
                    <label
                      key={opt}
                      className={`privacy-card ${form.dm_privacy === opt ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="dm_privacy"
                        checked={form.dm_privacy === opt}
                        onChange={() =>
                          setForm(p => ({ ...p, dm_privacy: opt }))
                        }
                      />
                      <div>
                        <div className="privacy-title">
                          {opt === 'everyone' ? '🌐 EVERYONE' : '👥 FRIENDS ONLY'}
                        </div>
                        <div className="privacy-desc">
                          {opt === 'everyone'
                            ? 'ANY USER CAN SEND YOU DIRECT MESSAGES'
                            : 'ONLY ACCEPTED FRIENDS CAN SEND YOU DMs'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <Btn onClick={handleSavePrivacy} disabled={saving}>
                  {saving ? 'UPDATING...' : 'SAVE SETTINGS'}
                </Btn>
              </div>
            )}

            {section === 'password' && (
              <div>
                <SectionTitle>PASSWORD SECURITY</SectionTitle>
                <div className="retro-divider" />

                <Field
                  label="CURRENT PASSWORD"
                  type="password"
                  value={pwForm.current}
                  onChange={v => setPwForm(p => ({ ...p, current: v }))}
                />
                <Field
                  label="NEW PASSWORD"
                  type="password"
                  value={pwForm.next}
                  onChange={v => setPwForm(p => ({ ...p, next: v }))}
                  placeholder="MIN 8 CHARS"
                />
                <Field
                  label="CONFIRM NEW"
                  type="password"
                  value={pwForm.confirm}
                  onChange={v => setPwForm(p => ({ ...p, confirm: v }))}
                />

                <Btn onClick={handleSavePassword} disabled={saving}>
                  {saving ? 'UPDATING...' : 'CHANGE PASSWORD'}
                </Btn>
              </div>
            )}

            {section === 'danger' && (
              <div>
                <SectionTitle>DANGER ZONE</SectionTitle>

                <div className="danger-terminal">
                  <div className="danger-header">SYSTEM WARNING</div>
                  <div className="danger-console">
                    <p>{'>'} ACCOUNT DELETION IS PERMANENT</p>
                    <p>{'>'} ALL DATA WILL BE LOST</p>
                    <p>{'>'} NO RECOVERY POSSIBLE</p>
                  </div>
                  <Btn onClick={handleDeleteAccount} disabled={saving} danger>
                    {saving ? 'DELETING...' : 'DELETE ACCOUNT'}
                  </Btn>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

    </div>
  )
}