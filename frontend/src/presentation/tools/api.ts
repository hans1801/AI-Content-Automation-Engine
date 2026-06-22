import { Idea, ScriptFormData } from './types'

const BASE = '/api'

async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`)
  return res.json() as Promise<T>
}

async function postJob(url: string, body?: unknown): Promise<string> {
  const { job_id } = await post<{ job_id: string }>(url, body)
  return job_id
}

export const api = {
  ideas: {
    list: (): Promise<Idea[]> => fetch(`${BASE}/ideas`).then(r => r.json()),
    generate: (): Promise<Idea> => post(`${BASE}/ideas/generate`),
  },

  script: {
    generate: (ideaId: number, form: ScriptFormData) =>
      postJob(`${BASE}/ideas/${ideaId}/script`, form),
    upload: async (ideaId: number, file: File): Promise<void> => {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${BASE}/ideas/${ideaId}/script/upload`, { method: 'POST', body: form })
      if (!res.ok) throw new Error('Script upload failed')
    },
  },

  audio:    (ideaId: number) => postJob(`${BASE}/ideas/${ideaId}/audio`),
  sync:     (ideaId: number) => postJob(`${BASE}/ideas/${ideaId}/sync`),
  subtitles:(ideaId: number) => postJob(`${BASE}/ideas/${ideaId}/subtitles`),
  assemble: (ideaId: number) => postJob(`${BASE}/ideas/${ideaId}/assemble`),

  geminiKey: {
    check: (): Promise<{ configured: boolean; source: string | null }> =>
      fetch(`${BASE}/config/gemini-key`).then(r => r.json()),
    save: (key: string): Promise<{ ok: boolean }> =>
      post(`${BASE}/config/gemini-key`, { key }),
  },
}
