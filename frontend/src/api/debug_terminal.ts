import { api } from './auth'

export const fetchDebugLogs = (): Promise<string[]> =>
  api.get<{ logs: string[] }>('/debug-terminal').then(r => r.data.logs)