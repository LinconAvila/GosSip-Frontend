

import DebugTerminal from './DebugTerminal'
import '../styles/member_panel.css'

interface TerminalPanelProps {
  isOpen: boolean
}

export default function TerminalPanel({ isOpen }: TerminalPanelProps) {
  return (
    <div 
      className={`member-panel ${isOpen ? 'open' : ''}`}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ 
        flex: 1, 
        
        padding: '16px 16px 24px 16px', 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: 0 
      }}>
        <DebugTerminal />
      </div>
    </div>
  )
}