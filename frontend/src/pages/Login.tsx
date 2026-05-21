import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Logo from '../assets/Logo.png'
import '../styles/auth.css'
import { CloseIcon, DMIcon, LockedPadlockIcon, PlayIcon, PlusIcon } from '../components/Icons'

export default function Login() {

  const { login, loading, error } = useAuth()

  const navigate = useNavigate()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    login({
      email,
      password,
    })
  }

  return (

    <div className="win-screen">

      <div className="win-window">

        {}
        <div className="win-titlebar">

          <div className="title-left">

            <span className="title-dot" />

            <span className="title-text">
              <span className="title-brand">
                <span style={{ color: '#C3C3DD' }}>GOS</span>
                <span style={{ color: '#6E4412' }}>SIP</span>
              </span>
              .LOGIN.exe
            </span>

          </div>

          <button
            className="win-close"
            onClick={() => navigate('/')}
          >
            <CloseIcon />
          </button>

        </div>

        {}
        <div className="win-content">

          {}
          <div className="login-side">
          
            <div className="side-brand">
              <img src={Logo} alt="Logo" className="side-logo-img" />
              <span className="side-brand-name">
                <span style={{ color: '#C3C3DD' }}>GOS</span>
                <span style={{ color: '#6E4412' }}>SIP</span>
              </span>
            </div>

            <div className="login-version">
              
            </div>

            <div className="login-version">
              © GOSSIP SYSTEM v1.0
            </div>

            <div className="side-divider" />
            

            <div className="side-info">

              <p>
                SECURE ACCESS PANEL
              </p>

              <p>
                ENCRYPTED SESSION
              </p>

              <p>
                USER AUTH REQUIRED
              </p>
            </div>

          </div>

          {}
          <form
            onSubmit={handleSubmit}
            className="win-body"
          >

            <div className="form-header">

              <h1>
                LOGIN
              </h1>

              <p>
                ENTER YOUR CREDENTIALS
              </p>

            </div>

            <div className="win-field">

              <label className="win-label">
                EMAIL
              </label>

              <div className="input-shell">

                <span className="input-prefix">
                  <DMIcon />
                </span>

                <input
                  type="email"
                  className="win-input"
                  value={email}
                  onChange={e =>
                    setEmail(e.target.value)
                  }
                  placeholder="user@email.com"
                  required
                />

              </div>

            </div>

            <div className="win-field">

              <label className="win-label">
                PASSWORD
              </label>

              <div className="input-shell">

                <span className="input-prefix">
                  <LockedPadlockIcon />
                </span>

                <input
                  type="password"
                  className="win-input"
                  value={password}
                  onChange={e =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  required
                />

              </div>

            </div>

            {error && (
              <div className="win-error">
                <CloseIcon />
                {error}
              </div>
            )}

            <div className="win-divider" />

            <button
              type="submit"
              className="win-btn"
              disabled={loading}
            >
              <PlayIcon />

              {loading
                ? 'AUTHENTICATING...'
                : 'LOGIN'}
            </button>

            <Link
              to="/signup"
              className="win-btn win-btn--secondary"
            >
              <PlusIcon/>

              CREATE ACCOUNT
            </Link>

          </form>

        </div>

      </div>

    </div>
  )
}