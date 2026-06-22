import { useState, useEffect, useCallback } from 'react'
import { Idea } from '../../tools/types'
import IdeaList from '../../components/IdeaList/IdeaList'
import StepWizard from '../../components/StepWizard/StepWizard'
import {
  AppLayout, Header, HeaderLogo, LogoDot, HeaderTitle,
  Layout, Sidebar, Main, EmptyState, EmptyIcon,
} from './MainView.styled'

export default function MainView() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const fetchIdeas = useCallback(async () => {
    try {
      const res = await fetch('/api/ideas')
      const data = (await res.json()) as Idea[]
      setIdeas(data)
    } catch {
      // server not ready
    }
  }, [])

  const handleCreated = useCallback((idea: Idea) => {
    setIdeas(prev => [...prev, idea])
    setSelectedId(idea.id)
  }, [])

  useEffect(() => {
    fetchIdeas()
  }, [fetchIdeas])

  const selectedIdea = ideas.find(i => i.id === selectedId) ?? null

  return (
    <AppLayout>
      <Header>
        <HeaderLogo>
          <LogoDot />
          <HeaderTitle>Content Engine</HeaderTitle>
        </HeaderLogo>
      </Header>
      <Layout>
        <Sidebar>
          <IdeaList
            ideas={ideas}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onCreated={handleCreated}
          />
        </Sidebar>
        <Main>
          {selectedIdea ? (
            <StepWizard idea={selectedIdea} onUpdate={fetchIdeas} />
          ) : (
            <EmptyState>
              <EmptyIcon>✦</EmptyIcon>
              <p>Selecciona una idea o genera una nueva</p>
            </EmptyState>
          )}
        </Main>
      </Layout>
    </AppLayout>
  )
}
