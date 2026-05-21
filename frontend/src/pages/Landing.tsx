import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/Logo.png'
import '../styles/landing.css'
import { PlayIcon } from '../components/Icons'


export default function Landing() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleEnter = () => {
    setLoading(true)
    setTimeout(() => navigate('/login'), 2000)
  }

  return (
    <div className="landing-bg">
      {!loading ? (
      <div className="landing-container">
        <div className="landing-titlebar">
          <div className="title-left">
            <div className="title-dot" />
            <span className="title-text">
              <span style={{ color: '#C3C3DD' }}>GOS</span>
              <span style={{ color: '#6E4412' }}>SIP</span>
              .EXE
            </span>
          </div>

          
        </div>

        <div className="landing-content">

          <div className="landing-side">
            <div className="side-logo">
              <img src={Logo} alt="Logo" className="side-logo-img" />
              <span>
                <span style={{ color: '#C3C3DD' }}>GOS</span>
                <span style={{ color: '#6E4412' }}>SIP</span>
              </span>
            </div>

            <div className="side-version">
              © GOSSIP SYSTEM v1.0
            </div>

            <div className="side-divider" />
            <p>
              Welcome to the GOSSIP SYSTEM
            </p>
          </div>

          <div className="landing-main">

            <h1 className="hero-title">
              ENTER<br />
              THE SYSTEM
            </h1>

            <p className="hero-text">
              
            </p>

            <button
              className="enter-btn blink"
              onClick={handleEnter}
            >
              <PlayIcon /> INITIALIZE
            </button>

            <div className="footer">
              

              <p>
                
              </p>
            </div>

          </div>

        </div>
      </div>
    ) : (
      <div className="loading-screen">
        <p>INITIALIZING SYSTEM...</p>

        <div className="bar">
          <div className="progress" />
        </div>
      </div>
    )}
    </div>
  )
}