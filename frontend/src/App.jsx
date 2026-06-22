import { useState, useEffect, useCallback } from 'react'
import IdeaList from './components/IdeaList'
import StepWizard from './components/StepWizard'

export default function App() {
  const [ideas, setIdeas] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const fetchIdeas = useCallback(async () => {
    try {
      const res = await fetch('/api/ideas')
      const data = await res.json()
      setIdeas(data)
    } catch {
      // server not ready yet
    }
  }, [])

  useEffect(() => {
    fetchIdeas()
  }, [fetchIdeas])

  const selectedIdea = ideas.find((i) => i.id === selectedId) ?? null

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">
          <span className="logo-dot" />
          <h1>Content Engine</h1>
        </div>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <IdeaList
            ideas={ideas}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onRefresh={fetchIdeas}
          />
        </aside>
        <main className="main">
          {selectedIdea ? (
            <StepWizard idea={selectedIdea} onUpdate={fetchIdeas} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <p>Selecciona una idea o genera una nueva</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
