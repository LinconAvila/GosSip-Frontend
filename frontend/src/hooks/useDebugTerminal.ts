

import { useEffect } from 'react'
import { useTerminalStore } from '../store/terminalStore'

export function useDebugTerminal() {
  const { logs, error, startPolling, stopPolling } = useTerminalStore()

  useEffect(() => {
    startPolling()
    return () => stopPolling()
  }, [startPolling, stopPolling])

  return { logs, error }
}
