

import { useEffect, useRef } from 'react'
import { useDebugTerminal } from '../hooks/useDebugTerminal'
import '../styles/debug_terminal.css'

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */

export default function DebugTerminal() {
  const { logs, error } = useDebugTerminal()
  const bodyRef = useRef<HTMLDivElement>(null)
  const isAutoScrolling = useRef(true)

  
  useEffect(() => {
    const body = bodyRef.current
    if (!body && logs.length === 0) return

    if (isAutoScrolling.current) {
      if (body) body.scrollTop = body.scrollHeight
    }
  }, [logs])

  
  const handleScroll = () => {
    const body = bodyRef.current
    if (!body) return

    
    const isAtBottom = body.scrollHeight - body.scrollTop <= body.clientHeight + 50
    isAutoScrolling.current = isAtBottom
  }

  return (
    <div className="debug-terminal">

      {}
      <div className="debug-terminal__header">
        <span className="debug-terminal__title">▶ THREAD MONITOR</span>
        <span className="debug-terminal__count">{logs.length} logs</span>
      </div>

      {}
      <div 
        className="debug-terminal__body" 
        ref={bodyRef}
        onScroll={handleScroll}
      >
        {error && (
          <div className="debug-terminal__error">{error}</div>
        )}

        {logs.length === 0 && !error && (
          <div className="debug-terminal__empty">Aguardando logs...</div>
        )}

        {logs.map((log, i) => (
          <div key={i} className={`debug-terminal__line ${getLineClass(log)}`}>
            {log}
          </div>
        ))}
      </div>

    </div>
  )
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */


function getLineClass(log: string): string {
  if (log.includes('ERRO') || log.includes('REJEITADA') || log.includes('NEGADO')) return 'debug-terminal__line--error'
  if (log.includes('ENCERRADA') || log.includes('ENCERRADO') || log.includes('LEAVE')) return 'debug-terminal__line--warn'
  if (log.includes('INICIADA') || log.includes('JOIN') || log.includes('TOKEN válido')) return 'debug-terminal__line--success'
  if (log.includes('MENSAGEM')) return 'debug-terminal__line--msg'
  return ''
}