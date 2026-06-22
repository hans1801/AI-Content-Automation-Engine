import { useState, useRef, MutableRefObject } from 'react'
import useSSE from './useSSE'

export interface JobStep {
  jobId: string | null
  logs: string[]
  done: boolean
  handled: MutableRefObject<boolean>
  start: (id: string) => void
  clear: () => void
  reset: () => void
}

export function useJobStep(): JobStep {
  const [jobId, setJobId] = useState<string | null>(null)
  const handled = useRef(false)
  const { logs, done } = useSSE(jobId ? `/api/ideas/stream/${jobId}` : null)

  function start(id: string) {
    handled.current = false
    setJobId(id)
  }

  function clear() {
    setJobId(null)
  }

  function reset() {
    handled.current = false
    setJobId(null)
  }

  return { jobId, logs, done, handled, start, clear, reset }
}
