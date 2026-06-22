import { useState } from 'react'
import { Idea } from '../../tools/types'
import {
  IdeaListRoot, ListHeader, IdeaCount, NewBtn,
  IdeaItems, NoIdeas, IdeaItem, IdeaTitle, IdeaMeta, IdeaCategory, StateBadge,
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
  onCreated: (idea: Idea) => void
}

export default function IdeaList({ ideas, selectedId, onSelect, onCreated }: IdeaListProps) {
  const [creating, setCreating] = useState(false)

  async function handleCreate() {
    setCreating(true)
    const res = await fetch('/api/ideas/generate', { method: 'POST' })
    const idea = (await res.json()) as Idea
    setCreating(false)
    onCreated(idea)
  }

  return (
    <IdeaListRoot>
      <ListHeader>
        <IdeaCount>{ideas.length} idea{ideas.length !== 1 ? 's' : ''}</IdeaCount>
        <NewBtn onClick={handleCreate} disabled={creating}>
          {creating ? '…' : '+ Nueva'}
        </NewBtn>
      </ListHeader>

      <IdeaItems>
        {ideas.length === 0 && (
          <NoIdeas>Ninguna idea aún</NoIdeas>
        )}
        {[...ideas].reverse().map(idea => (
          <IdeaItem key={idea.id} $active={selectedId === idea.id} onClick={() => onSelect(idea.id)}>
            <IdeaTitle>#{idea.id} — {idea.title || 'Sin título'}</IdeaTitle>
            <IdeaMeta>
              <IdeaCategory>{idea.category || '—'}</IdeaCategory>
              <StateBadge $color={STATE_COLOR[idea.state] ?? '#64748b'}>{idea.state}</StateBadge>
            </IdeaMeta>
          </IdeaItem>
        ))}
      </IdeaItems>
    </IdeaListRoot>
  )
}
