// Chama o endpoit para desarmar o servidor 

import { api } from './auth'

export const desarmeApi = {
  triggerShutdown: (): Promise<void> =>
    api.post('/desarme').then(() => undefined),
}