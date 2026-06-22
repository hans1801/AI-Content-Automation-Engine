import { useState, useEffect, useRef } from 'react'
import Uploader from './Uploader'
import useSSE from '../hooks/useSSE'

const LEVEL = {
  NEW: 0,
  SCRIPT_GENERATED: 1,
  IMAGES_GENERATED: 2,
  VIDEOS_GENERATED: 3,
  AUDIO_GENERATED: 4,
  VIDEO_GENERATED: 5,
  VIDEO_SUBTITLED: 6,
  VIDEO_MUSIC_GENERATED: 7,
  COMPLETED: 8,
}

function Terminal({ logs, running }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [logs])

  return (
    <div className="terminal" ref={ref}>
      {logs.map((l, i) => (
        <div key={i} className="log-line">{l}</div>
      ))}
      {running && <div className="log-cursor">▋</div>}
    </div>
  )
}

export default function StepWizard({ idea, onUpdate }) {
  const [imgJob, setImgJob] = useState(null)
  const [edJob, setEdJob] = useState(null)
  const imgHandled = useRef(false)
  const edHandled = useRef(false)

  const { logs: imgLogs, done: imgDone } = useSSE(imgJob ? `/api/ideas/stream/${imgJob}` : null)
  const { logs: edLogs, done: edDone } = useSSE(edJob ? `/api/ideas/stream/${edJob}` : null)

  useEffect(() => {
    if (imgDone && !imgHandled.current) {
      imgHandled.current = true
      setImgJob(null)
      onUpdate()
    }
  }, [imgDone, onUpdate])

  useEffect(() => {
    if (edDone && !edHandled.current) {
      edHandled.current = true
      setEdJob(null)
      onUpdate()
    }
  }, [edDone, onUpdate])

  // Reset handled flags when idea changes
  useEffect(() => {
    imgHandled.current = false
    edHandled.current = false
    setImgJob(null)
    setEdJob(null)
  }, [idea.id])

  async function handleImages() {
    imgHandled.current = false
    const res = await fetch(`/api/ideas/${idea.id}/images`, { method: 'POST' })
    const { job_id } = await res.json()
    setImgJob(job_id)
  }

  async function handleEdition() {
    edHandled.current = false
    const res = await fetch(`/api/ideas/${idea.id}/edition`, { method: 'POST' })
    const { job_id } = await res.json()
    setEdJob(job_id)
  }

  function handleDownloadScript() {
    window.open(`/api/ideas/${idea.id}/script`, '_blank')
  }

  const level = LEVEL[idea.state] ?? 0

  return (
    <div className="wizard">
      <div className="wizard-header">
        <h2 className="wizard-title">{idea.title || `Idea #${idea.id}`}</h2>
        <span className="wizard-category">{idea.category}</span>
      </div>

      {/* Step 1 — Script */}
      <StepCard
        num="01"
        title="Script"
        done={level >= 1}
        locked={false}
      >
        {level >= 1 ? (
          <button className="btn-secondary" onClick={handleDownloadScript}>
            Descargar script.json
          </button>
        ) : (
          <p className="step-hint">Genera una nueva idea desde la lista</p>
        )}
      </StepCard>

      {/* Step 2 — Images */}
      <StepCard
        num="02"
        title="Imágenes"
        done={level >= 2}
        locked={level < 1}
      >
        {level === 1 && !imgJob && (
          <button className="btn-primary" onClick={handleImages}>
            Generar Imágenes con IA
          </button>
        )}
        {imgJob && <Terminal logs={imgLogs} running={true} />}
        {level >= 2 && <p className="done-text">✓ Imágenes generadas</p>}
      </StepCard>

      {/* Step 3 — Upload Videos */}
      <StepCard
        num="03"
        title="Subir Videos"
        done={level >= 3}
        locked={level < 2}
      >
        {level === 2 && <Uploader ideaId={idea.id} onUploaded={onUpdate} />}
        {level >= 3 && <p className="done-text">✓ {level >= 3 ? 'Videos subidos' : ''}</p>}
      </StepCard>

      {/* Step 4 — Edition */}
      <StepCard
        num="04"
        title="Edición Final"
        done={level === 8}
        locked={level < 3}
      >
        {level === 3 && !edJob && (
          <button className="btn-primary" onClick={handleEdition}>
            Generar Edición
          </button>
        )}
        {(level > 3 && level < 8) && !edJob && (
          <p className="step-hint">Procesando… ({idea.state})</p>
        )}
        {edJob && <Terminal logs={edLogs} running={true} />}
        {level === 8 && (
          <p className="done-text completed">🎬 Video completado</p>
        )}
      </StepCard>
    </div>
  )
}

function StepCard({ num, title, done, locked, children }) {
  return (
    <div className={`step-card ${done ? 'done' : ''} ${locked ? 'locked' : ''}`}>
      <div className="step-number">{num}</div>
      <div className="step-content">
        <h3 className="step-title">{title}</h3>
        {children}
      </div>
      {done && <div className="step-check">✓</div>}
    </div>
  )
}
