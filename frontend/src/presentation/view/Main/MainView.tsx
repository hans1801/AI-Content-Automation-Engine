import { useState, useEffect, useCallback } from 'react'
import { Idea } from '../../tools/types'
import IdeaList from '../../components/IdeaList/IdeaList'
import StepWizard from '../../components/StepWizard/StepWizard'
import ApiKeyModal from '../../components/ApiKeyModal/ApiKeyModal'
import {
  AppLayout, Header, HeaderLogo, LogoDot, HeaderTitle,
  Layout, Sidebar, Main, EmptyState, EmptyIcon, ApiKeyBtn, ApiKeyDot,
} from './MainView.styled'

export default function MainView() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768)
  const [showApiKey, setShowApiKey] = useState(false)
  const [keyConfigured, setKeyConfigured] = useState<boolean | null>(null)

  const fetchIdeas = useCallback(async () => {
    try {
      const res = await fetch('/api/ideas')
      const data = (await res.json()) as Idea[]
      setIdeas(data)
    } catch { /* server not ready */ }
  }, [])

  const handleCreated = useCallback((idea: Idea) => {
    setIdeas(prev => [...prev, idea])
    setSelectedId(idea.id)
  }, [])

  const checkKey = useCallback(async () => {
    try {
      const res = await fetch('/api/config/gemini-key')
      const d = await res.json()
      setKeyConfigured(d.configured)
    } catch { setKeyConfigured(false) }
  }, [])

  useEffect(() => { fetchIdeas(); checkKey() }, [fetchIdeas, checkKey])

  useEffect(() => {
    const handler = () => { if (window.innerWidth < 768) setSidebarOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const selectedIdea = ideas.find(i => i.id === selectedId) ?? null

  return (
    <AppLayout>
      <Header>
        <HeaderLogo>
          <LogoDot />
          <HeaderTitle>Content Engine</HeaderTitle>
        </HeaderLogo>
        <ApiKeyBtn
          onClick={() => setShowApiKey(true)}
          title={keyConfigured ? 'Gemini key configurada' : 'Configurar Gemini API key'}
        >
          <ApiKeyDot $ok={keyConfigured === true} />
          Gemini Key
        </ApiKeyBtn>
      </Header>

      <Layout>
        <Sidebar $open={sidebarOpen}>
          <IdeaList
            ideas={ideas}
            selectedId={selectedId}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(o => !o)}
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

      {showApiKey && (
        <ApiKeyModal onClose={() => { setShowApiKey(false); checkKey() }} />
      )}
    </AppLayout>
  )
}
