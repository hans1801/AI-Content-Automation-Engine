import { useEffect, useRef } from 'react'
import { TerminalBox, LogLine, LogCursor } from './Terminal.styled'

interface TerminalProps {
  logs: string[]
  running: boolean
}

export default function Terminal({ logs, running }: TerminalProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [logs])

  return (
    <TerminalBox ref={ref}>
      {logs.map((l, i) => (
        <LogLine key={i}>{l}</LogLine>
      ))}
      {running && <LogCursor>▋</LogCursor>}
    </TerminalBox>
  )
}
