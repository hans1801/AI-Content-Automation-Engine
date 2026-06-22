import { useState, useEffect, useRef } from 'react'
import useSSE from '../hooks/useSSE'

const STATE_COLOR = {
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

export default function IdeaList({ ideas, selectedId, onSelect, onRefresh }) {
  const [jobId, setJobId] = useState(null)
  const [generating, setGenerating] = useState(false)
  const handled = useRef(false)
  const terminalRef = useRef(null)

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
    const { job_id } = await res.json()
    setJobId(job_id)
  }

  return (
    <div className="idea-list">
      <div className="idea-list-header">
        <span className="idea-count">{ideas.length} idea{ideas.length !== 1 ? 's' : ''}</span>
        <button className="btn-primary btn-sm" onClick={handleGenerate} disabled={generating}>
          {generating ? <span className="spinner" /> : '+ Nueva'}
        </button>
      </div>

      {generating && (
        <div className="gen-terminal" ref={terminalRef}>
          {logs.map((l, i) => (
            <div key={i} className="log-line">{l}</div>
          ))}
          <div className="log-cursor">▋</div>
        </div>
      )}

      <div className="idea-items">
        {ideas.length === 0 && !generating && (
          <div className="no-ideas">Ninguna idea aún</div>
        )}
        {[...ideas].reverse().map((idea) => (
          <div
            key={idea.id}
            className={`idea-item ${selectedId === idea.id ? 'active' : ''}`}
            onClick={() => onSelect(idea.id)}
          >
            <div className="idea-title">{idea.title || `Idea #${idea.id}`}</div>
            <div className="idea-meta">
              <span className="idea-category">{idea.category}</span>
              <span
                className="state-badge"
                style={{
                  background: STATE_COLOR[idea.state] + '22',
                  color: STATE_COLOR[idea.state],
                  border: `1px solid ${STATE_COLOR[idea.state]}44`,
                }}
              >
                {idea.state}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
