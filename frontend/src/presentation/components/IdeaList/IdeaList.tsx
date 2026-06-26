import { useState } from 'react'
import { Idea } from '../../tools/types'
import {
  IdeaListRoot, ListHeader, CollapseBtn, IdeaCount, NewBtn,
  IdeaItems, NoIdeas, IdeaItem, IdeaTitle, IdeaMeta, IdeaCategory, StateBadge,
  CollapsedStrip, CollapsedCount,
} from './IdeaList.styled'

const STATE_COLOR: Record<string, string> = {
  NEW: '#64748b',
  SCRIPT_GENERATED: '#3b82f6',
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
  isOpen: boolean
  onToggle: () => void
  onSelect: (id: number) => void
  onCreated: (idea: Idea) => void
}

export default function IdeaList({ ideas, selectedId, isOpen, onToggle, onSelect, onCreated }: IdeaListProps) {
  const [creating, setCreating] = useState(false)

  async function handleCreate() {
    setCreating(true)
    const res = await fetch('/api/ideas/generate', { method: 'POST' })
    const idea = (await res.json()) as Idea
    setCreating(false)
    onCreated(idea)
  }

  if (!isOpen) {
    return (
      <IdeaListRoot>
        <CollapsedStrip onClick={onToggle} title="Expandir panel de ideas">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="14" height="12" rx="2" />
            <path d="M16 10l5-3v10l-5-3V10z" />
          </svg>
          <CollapsedCount>{ideas.length}</CollapsedCount>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3l4 4-4 4" />
          </svg>
        </CollapsedStrip>
      </IdeaListRoot>
    )
  }

  return (
    <IdeaListRoot>
      <ListHeader>
        <CollapseBtn onClick={onToggle} title="Colapsar panel">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="1.5" width="4" height="15" rx="1.5" fill="currentColor" opacity="0.5" />
            <rect x="7" y="1.5" width="9.5" height="15" rx="1.5" fill="currentColor" opacity="0.18" />
            <path d="M11 6 L8.5 9 L11 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </CollapseBtn>
        <IdeaCount>{ideas.length} idea{ideas.length !== 1 ? 's' : ''}</IdeaCount>
        <NewBtn onClick={handleCreate} disabled={creating}>
          {creating ? '…' : '+ Crear video'}
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
