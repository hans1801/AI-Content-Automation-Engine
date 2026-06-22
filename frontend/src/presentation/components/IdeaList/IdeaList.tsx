import { useState, useEffect, useRef } from 'react'
import { Idea } from '../../tools/types'
import useSSE from '../../tools/hooks/useSSE'
import {
  IdeaListRoot, ListHeader, IdeaCount, NewBtn, Spinner,
  GenTerminal, LogLine, LogCursor, IdeaItems, NoIdeas,
  IdeaItem, IdeaTitle, IdeaMeta, IdeaCategory, StateBadge,
} from './IdeaList.styled'

const STATE_COLOR: Record<string, string> = {
  NEW: '#64748b',
  SCRIPT_GENERATED: '#3b82f6',
  IMAGES_GENERATED: '#8b5cf6',
  VIDEOS_GENERATED: '#f59e0b',
  AUDIO_GENERATED: '#f97316',
  VIDEO_GENERATED: '#06b6d4',
  VIDEO_SUBTITLED: '#6366f1',
  VIDEO_MUSIC_GENERATED: '#ec4899',
  COMPLETED: '#10b981',
}

interface IdeaListProps {
  ideas: Idea[]
  selectedId: number | null
  onSelect: (id: number) => void
  onRefresh: () => void
}

export default function IdeaList({ ideas, selectedId, onSelect, onRefresh }: IdeaListProps) {
  const [jobId, setJobId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const handled = useRef(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  const { logs, done } = useSSE(jobId ? `/api/ideas/stream/${jobId}` : null)

  useEffect(() => {
    if (done && !handled.current) {
      handled.current = true
      setGenerating(false)
      setJobId(null)
      onRefresh()
    }
  }, [done, onRefresh])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  async function handleGenerate() {
    handled.current = false
    setGenerating(true)
    const res = await fetch('/api/ideas/generate', { method: 'POST' })
    const { job_id } = (await res.json()) as { job_id: string }
    setJobId(job_id)
  }

  return (
    <IdeaListRoot>
      <ListHeader>
        <IdeaCount>{ideas.length} idea{ideas.length !== 1 ? 's' : ''}</IdeaCount>
        <NewBtn onClick={handleGenerate} disabled={generating}>
          {generating ? <Spinner /> : '+ Nueva'}
        </NewBtn>
      </ListHeader>

      {generating && (
        <GenTerminal ref={terminalRef}>
          {logs.map((l, i) => (
            <LogLine key={i}>{l}</LogLine>
          ))}
          <LogCursor>▋</LogCursor>
        </GenTerminal>
      )}

      <IdeaItems>
        {ideas.length === 0 && !generating && (
          <NoIdeas>Ninguna idea aún</NoIdeas>
        )}
        {[...ideas].reverse().map(idea => (
          <IdeaItem key={idea.id} $active={selectedId === idea.id} onClick={() => onSelect(idea.id)}>
            <IdeaTitle>{idea.title || `Idea #${idea.id}`}</IdeaTitle>
            <IdeaMeta>
              <IdeaCategory>{idea.category}</IdeaCategory>
              <StateBadge $color={STATE_COLOR[idea.state] ?? '#64748b'}>{idea.state}</StateBadge>
            </IdeaMeta>
          </IdeaItem>
        ))}
      </IdeaItems>
    </IdeaListRoot>
  )
}
