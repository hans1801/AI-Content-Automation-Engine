import { useState, useEffect } from 'react'

export default function useSSE(url) {
  const [logs, setLogs] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!url) {
      setLogs([])
      setDone(false)
      return
    }

    setLogs([])
    setDone(false)

    const es = new EventSource(url)

    es.onmessage = (e) => {
      const msg = e.data
      if (msg === '[DONE]' || msg === '[TIMEOUT]') {
        setDone(true)
        es.close()
      } else {
        setLogs((prev) => [...prev, msg])
      }
    }

    es.onerror = () => {
      setDone(true)
      es.close()
    }

    return () => es.close()
  }, [url])

  return { logs, done }
}
