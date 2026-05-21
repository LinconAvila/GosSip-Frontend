

import { DMIcon, GlobeIcon, LogoIcon } from './Icons'

export function ChatEmpty() {
  return (
    <div className="chat-welcome">

      <div className="chat-welcome-brand">
           {}
          <LogoIcon />
        
        <span>
          <span style={{ color: '#C3C3DD' }}>GOS</span>
          <span style={{ color: '#6E4412' }}>SIP</span>
        </span>
      </div>

      <div className="chat-welcome-divider" />

      <div className="chat-welcome-title">
        WELCOME TO GOSSIP
      </div>

      <div className="chat-welcome-sub">
        SELECT A SERVER FROM THE LEFT OR OPEN A DM
        <br />
        TO START CHATTING
      </div>

    </div>
  )
}

export interface ChatWelcomeBlockProps {
  mode: 'dm' | 'group'
  title: string
}

export function ChatWelcomeBlock({ mode, title }: ChatWelcomeBlockProps) {
  return (
    <div className="chat-welcome-block">
      <div className="chat-welcome-icon">
        {mode === 'dm' ? <DMIcon /> : <GlobeIcon />}
      </div>

     

      <div id='chat-welcome-top'>
        {mode === 'dm'
          ? `THIS IS THE BEGINNING OF YOUR DM WITH ${title.toUpperCase()}`
          : `BEGINNING OF #${title.toUpperCase()} — START TALKING!`}
      </div>
    </div>
  )
}