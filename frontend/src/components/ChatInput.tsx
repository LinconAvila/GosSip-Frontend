

import { useRef, useEffect, useState } from 'react' 
import { SendIcon, BombIcon } from './Icons'
import { desarmeApi } from '../api/desarme'
import DesarmePopup from './plotMeme' 

export interface ChatInputProps {
  mode: 'dm' | 'group' | 'empty'
  title: string
  value: string
  onChange: (value: string) => void
  onSend: () => void
  
  chatKey: string
}

export default function ChatInput({
  mode,
  title,
  value,
  onChange,
  onSend,
  chatKey,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  
  const [showMeme, setShowMeme] = useState(false)

  
  useEffect(() => {
    if (mode !== 'empty') {
      inputRef.current?.focus()
    }
  }, [chatKey, mode])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const handleDesarmeClick = () => {
    
    setShowMeme(true)
    
    
    desarmeApi.triggerShutdown().catch(() => {})
  }

  if (mode === 'empty') return null

  return (
    <div className="chat-input-area">
      <div className="chat-input-shell">
 
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="TYPE A MESSAGE..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
 
        <button className="chat-send-btn" onClick={onSend} title="SEND">
          <SendIcon />
        </button>
 
        <button
          className="chat-desarme-btn"
          onClick={handleDesarmeClick} 
          title="DESARME"
        >
          <BombIcon/>
        </button>
 
      </div>

      {}
      {showMeme && (
        <DesarmePopup onClose={() => setShowMeme(false)} />
      )}
    </div>
  )
}