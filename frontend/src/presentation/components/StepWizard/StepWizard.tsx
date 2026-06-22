import { useState, useEffect, useRef } from 'react'
import { Idea } from '../../tools/types'
import useSSE from '../../tools/hooks/useSSE'
import Uploader from '../Uploader/Uploader'
import StepCard from './components/StepCard/StepCard'
import Terminal from './components/Terminal/Terminal'
import { DoneText, StepHint } from './components/StepCard/StepCard.styled'
import { Wizard, WizardHeader, WizardTitle, WizardCategory, BtnPrimary, BtnSecondary } from './StepWizard.styled'

const LEVEL: Record<string, number> = {
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

interface StepWizardProps {
  idea: Idea
  onUpdate: () => void
}

export default function StepWizard({ idea, onUpdate }: StepWizardProps) {
  const [edJob, setEdJob] = useState<string | null>(null)
  const edHandled = useRef(false)

  const { logs: edLogs, done: edDone } = useSSE(edJob ? `/api/ideas/stream/${edJob}` : null)

  useEffect(() => {
    if (edDone && !edHandled.current) {
      edHandled.current = true
      setEdJob(null)
      onUpdate()
    }
  }, [edDone, onUpdate])

  useEffect(() => {
    edHandled.current = false
    setEdJob(null)
  }, [idea.id])

  async function handleEdition() {
    edHandled.current = false
    const res = await fetch(`/api/ideas/${idea.id}/edition`, { method: 'POST' })
    const { job_id } = (await res.json()) as { job_id: string }
    setEdJob(job_id)
  }

  function handleDownloadScript() {
    window.open(`/api/ideas/${idea.id}/script`, '_blank')
  }

  const level = LEVEL[idea.state] ?? 0

  return (
    <Wizard>
      <WizardHeader>
        <WizardTitle>{idea.title || `Idea #${idea.id}`}</WizardTitle>
        <WizardCategory>{idea.category}</WizardCategory>
      </WizardHeader>

      <StepCard num="01" title="Script" done={level >= 1} locked={false}>
        {level >= 1 ? (
          <BtnSecondary onClick={handleDownloadScript}>Descargar script.json</BtnSecondary>
        ) : (
          <StepHint>Genera una nueva idea desde la lista</StepHint>
        )}
      </StepCard>

      <StepCard num="02" title="Subir Imágenes" done={level >= 2} locked={level < 1}>
        {level === 1 && (
          <Uploader
            ideaId={idea.id}
            endpoint="images"
            accept=".png,.jpg,.jpeg,.webp"
            label="Arrastra las imágenes o haz clic para seleccionar"
            hint="PNG / JPG / WEBP — se ordenan por nombre"
            onUploaded={onUpdate}
          />
        )}
        {level >= 2 && <DoneText>✓ Imágenes subidas</DoneText>}
      </StepCard>

      <StepCard num="03" title="Subir Videos" done={level >= 3} locked={level < 2}>
        {level === 2 && (
          <Uploader
            ideaId={idea.id}
            endpoint="videos"
            accept=".mp4"
            label="Arrastra los videos o haz clic para seleccionar"
            hint="Solo .mp4 — se ordenan por nombre"
            onUploaded={onUpdate}
          />
        )}
        {level >= 3 && <DoneText>✓ Videos subidos</DoneText>}
      </StepCard>

      <StepCard num="04" title="Edición Final" done={level === 8} locked={level < 3}>
        {level === 3 && !edJob && (
          <BtnPrimary onClick={handleEdition}>Generar Edición</BtnPrimary>
        )}
        {level > 3 && level < 8 && !edJob && (
          <StepHint>Procesando… ({idea.state})</StepHint>
        )}
        {edJob && <Terminal logs={edLogs} running={true} />}
        {level === 8 && <DoneText $completed>🎬 Video completado</DoneText>}
      </StepCard>
    </Wizard>
  )
}
