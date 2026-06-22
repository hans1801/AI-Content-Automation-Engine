import { useState, useEffect } from 'react'
import { Idea } from '../../tools/types'
import { useJobStep } from '../../tools/hooks/useJobStep'
import Uploader from '../Uploader/Uploader'
import StepCard from './components/StepCard/StepCard'
import Terminal from './components/Terminal/Terminal'
import {
  Wizard, WizardHeader, WizardTitle, WizardCategory,
  BtnPrimary, BtnSecondary, DoneText,
} from './StepWizard.styled'

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

async function postJob(url: string): Promise<string> {
  const res = await fetch(url, { method: 'POST' })
  const { job_id } = (await res.json()) as { job_id: string }
  return job_id
}

export default function StepWizard({ idea, onUpdate }: StepWizardProps) {
  const scriptStep = useJobStep()
  const audioStep = useJobStep()
  const syncStep = useJobStep()
  const subsStep = useJobStep()
  const assembleStep = useJobStep()

  const [reuploadImages, setReuploadImages] = useState(false)
  const [reuploadVideos, setReuploadVideos] = useState(false)

  // Single effect handles all step completions
  useEffect(() => {
    for (const step of [scriptStep, audioStep, syncStep, subsStep, assembleStep]) {
      if (step.done && !step.handled.current) {
        step.handled.current = true
        step.clear()
        onUpdate()
      }
    }
  }, [scriptStep.done, audioStep.done, syncStep.done, subsStep.done, assembleStep.done, onUpdate])

  // Reset all when idea changes
  useEffect(() => {
    ;[scriptStep, audioStep, syncStep, subsStep, assembleStep].forEach(s => s.reset())
    setReuploadImages(false)
    setReuploadVideos(false)
  }, [idea.id])

  const base = `/api/ideas/${idea.id}`

  async function handleScript() { scriptStep.start(await postJob(`${base}/script`)) }
  async function handleAudio() { audioStep.start(await postJob(`${base}/audio`)) }
  async function handleSync() { syncStep.start(await postJob(`${base}/sync`)) }
  async function handleSubs() { subsStep.start(await postJob(`${base}/subtitles`)) }
  async function handleAssemble() { assembleStep.start(await postJob(`${base}/assemble`)) }

  const level = LEVEL[idea.state] ?? 0

  return (
    <Wizard>
      <WizardHeader>
        <WizardTitle>{idea.title || `Idea #${idea.id}`}</WizardTitle>
        <WizardCategory>{idea.category}</WizardCategory>
      </WizardHeader>

      {/* 01 — Script */}
      <StepCard
        num="01" title="Script"
        done={level >= 1} locked={false}
        onRegenerate={level >= 1 && !scriptStep.jobId ? handleScript : undefined}
      >
        {level === 0 && !scriptStep.jobId && (
          <BtnPrimary onClick={handleScript}>Generar Script</BtnPrimary>
        )}
        {level >= 1 && !scriptStep.jobId && (
          <BtnSecondary onClick={() => window.open(`${base}/script`, '_blank')}>
            Descargar script.json
          </BtnSecondary>
        )}
        {scriptStep.jobId && <Terminal logs={scriptStep.logs} running={true} />}
      </StepCard>

      {/* 02 — Imágenes */}
      <StepCard
        num="02" title="Subir Imágenes"
        done={level >= 2} locked={level < 1}
        onRegenerate={level >= 2 && !reuploadImages ? () => setReuploadImages(true) : undefined}
      >
        {(level === 1 || reuploadImages) && (
          <Uploader
            ideaId={idea.id} endpoint="images"
            accept=".png,.jpg,.jpeg,.webp"
            label="Arrastra las imágenes o haz clic para seleccionar"
            hint="PNG / JPG / WEBP — se ordenan por nombre"
            onUploaded={() => { setReuploadImages(false); onUpdate() }}
          />
        )}
        {level >= 2 && !reuploadImages && <DoneText>✓ Imágenes subidas</DoneText>}
      </StepCard>

      {/* 03 — Videos */}
      <StepCard
        num="03" title="Subir Videos"
        done={level >= 3} locked={level < 2}
        onRegenerate={level >= 3 && !reuploadVideos ? () => setReuploadVideos(true) : undefined}
      >
        {(level === 2 || reuploadVideos) && (
          <Uploader
            ideaId={idea.id} endpoint="videos"
            accept=".mp4"
            label="Arrastra los videos o haz clic para seleccionar"
            hint="Solo .mp4 — se ordenan por nombre"
            onUploaded={() => { setReuploadVideos(false); onUpdate() }}
          />
        )}
        {level >= 3 && !reuploadVideos && <DoneText>✓ Videos subidos</DoneText>}
      </StepCard>

      {/* 04 — Audio */}
      <StepCard
        num="04" title="Audio"
        done={level >= 4} locked={level < 3}
        onRegenerate={level >= 4 && !audioStep.jobId ? handleAudio : undefined}
      >
        {level === 3 && !audioStep.jobId && (
          <BtnPrimary onClick={handleAudio}>Generar Audio</BtnPrimary>
        )}
        {audioStep.jobId && <Terminal logs={audioStep.logs} running={true} />}
        {level >= 4 && !audioStep.jobId && <DoneText>✓ Audio generado</DoneText>}
      </StepCard>

      {/* 05 — Sincronización */}
      <StepCard
        num="05" title="Sincronización"
        done={level >= 5} locked={level < 4}
        onRegenerate={level >= 5 && !syncStep.jobId ? handleSync : undefined}
      >
        {level === 4 && !syncStep.jobId && (
          <BtnPrimary onClick={handleSync}>Sincronizar Video</BtnPrimary>
        )}
        {syncStep.jobId && <Terminal logs={syncStep.logs} running={true} />}
        {level >= 5 && !syncStep.jobId && <DoneText>✓ Video sincronizado</DoneText>}
      </StepCard>

      {/* 06 — Subtítulos */}
      <StepCard
        num="06" title="Subtítulos"
        done={level >= 6} locked={level < 5}
        onRegenerate={level >= 6 && !subsStep.jobId ? handleSubs : undefined}
      >
        {level === 5 && !subsStep.jobId && (
          <BtnPrimary onClick={handleSubs}>Generar Subtítulos</BtnPrimary>
        )}
        {subsStep.jobId && <Terminal logs={subsStep.logs} running={true} />}
        {level >= 6 && !subsStep.jobId && <DoneText>✓ Subtítulos añadidos</DoneText>}
      </StepCard>

      {/* 07 — Ensamble Final */}
      <StepCard
        num="07" title="Ensamble Final"
        done={level === 8} locked={level < 6}
        onRegenerate={level === 8 && !assembleStep.jobId ? handleAssemble : undefined}
      >
        {level >= 6 && level < 8 && !assembleStep.jobId && (
          <BtnPrimary onClick={handleAssemble}>Ensamblar Video</BtnPrimary>
        )}
        {assembleStep.jobId && <Terminal logs={assembleStep.logs} running={true} />}
        {level === 8 && !assembleStep.jobId && (
          <DoneText $completed>🎬 Video completado</DoneText>
        )}
        {level === 8 && !assembleStep.jobId && (
          <BtnSecondary
            style={{ marginTop: '12px' }}
            onClick={() => window.open(`${base}/video`, '_blank')}
          >
            Descargar video
          </BtnSecondary>
        )}
      </StepCard>
    </Wizard>
  )
}
