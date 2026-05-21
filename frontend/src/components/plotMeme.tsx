

import { useEffect } from 'react'
import { createPortal } from 'react-dom' 
import meme from '../assets/meme.png'
import '../styles/desarmePopup.css'

interface DesarmePopupProps {
  onClose: () => void
  duration?: number 
}

export default function DesarmePopup({ onClose, duration = 3000 }: DesarmePopupProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  
  return createPortal(
    <div className="desarme-popup-overlay" onClick={onClose}>
      <img className="desarme-popup-img" src={meme} alt="DESARME" />
    </div>,
    document.body 
  )
}