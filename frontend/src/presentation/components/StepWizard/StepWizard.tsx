import { useState, useEffect } from 'react'
import { Idea, ScriptFormData, DEFAULT_FORM } from '../../tools/types'
import { useJobStep } from '../../tools/hooks/useJobStep'
import Uploader from '../Uploader/Uploader'
import ScriptForm from '../ScriptForm/ScriptForm'
import Terminal from './components/Terminal/Terminal'
import PipelineHeader, { PipelineStep } from './components/PipelineHeader/PipelineHeader'
import ScriptViewer from './components/previews/ScriptViewer'
import ImageSequence from './components/previews/ImageSequence'
import VideoSequence from './components/previews/VideoSequence'
import AudioSequence from './components/previews/AudioSequence'
import VideoPlayer from './components/previews/VideoPlayer'
import {
  Wizard, WizardHeader, WizardTitle, WizardCategory,
  StepDetail, StepDetailHeader, StepDetailNum, StepDetailTitle, StepDetailStatus,
  ActionRow, BtnPrimary, BtnSecondary, DoneText,
  ModeTabs, ModeTab, JsonUploadZone,
} from './StepWizard.styled'

const LEVEL: Record<string, number> = {
  NEW: 0, SCRIPT_GENERATED: 1, IMAGES_GENERATED: 2, VIDEOS_GENERATED: 3,
  AUDIO_GENERATED: 4, VIDEO_GENERATED: 5, VIDEO_SUBTITLED: 6,
  VIDEO_MUSIC_GENERATED: 7, COMPLETED: 8,
}

const STEPS: PipelineStep[] = [
  { num: '01', title: 'Script' },
  { num: '02', title: 'Imágenes' },
  { num: '03', title: 'Videos' },
  { num: '04', title: 'Audio' },
  { num: '05', title: 'Ensamblado' },
  { num: '06', title: 'Producción Final' },
]

interface Props { idea: Idea; onUpdate: () => void }

async function postJob(url: string): Promise<string> {
  const res = await fetch(url, { method: 'POST' })
  const { job_id } = (await res.json()) as { job_id: string }
  return job_id
}

export default function StepWizard({ idea, onUpdate }: Props) {
  const scriptStep = useJobStep()
  const audioStep  = useJobStep()
  const syncStep   = useJobStep()
  const subsStep   = useJobStep()
  const assemble   = useJobStep()

  const [selected, setSelected]             = useState(0)
  const [showForm, setShowForm]             = useState(false)
  const [scriptMode, setScriptMode]         = useState<'generate' | 'upload'>('generate')
  const [uploadingScript, setUploadScript]  = useState(false)
  const [reuploadImages, setReupImages]     = useState(false)
  const [reuploadVideos, setReupVideos]     = useState(false)

  const level = LEVEL[idea.state] ?? 0

  useEffect(() => {
    const active = Math.min(level, 5)
    setSelected(active)
    setShowForm(false)
    setScriptMode('generate')
    setReupImages(false)
    setReupVideos(false)
    ;[scriptStep, audioStep, syncStep, subsStep, assemble].forEach(s => s.reset())
  }, [idea.id])

  useEffect(() => {
    const pairs = [
      [scriptStep, 1], [audioStep, 4], [syncStep, 5],
      [subsStep, 5], [assemble, 5],
    ] as const
    for (const [step, next] of pairs) {
      if (step.done && !step.handled.current) {
        step.handled.current = true
        step.clear()
        onUpdate()
        setSelected(next)
      }
    }
  }, [scriptStep.done, audioStep.done, syncStep.done, subsStep.done, assemble.done, onUpdate])

  const base = `/api/ideas/${idea.id}`

  async function handleScript(form: ScriptFormData) {
    setShowForm(false)
    const res = await fetch(`${base}/script`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const { job_id } = (await res.json()) as { job_id: string }
    scriptStep.start(job_id)
  }

  async function handleScriptUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadScript(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${base}/script/upload`, { method: 'POST', body: form })
      if (!res.ok) { alert('Error al subir el script'); return }
      setShowForm(false)
      onUpdate()
    } finally {
      setUploadScript(false)
      e.target.value = ''
    }
  }

  async function handleAudio()    { audioStep.start(await postJob(`${base}/audio`)) }
  async function handleSync()     { syncStep.start(await postJob(`${base}/sync`)) }
  async function handleSubs()     { subsStep.start(await postJob(`${base}/subtitles`)) }
  async function handleAssemble() { assemble.start(await postJob(`${base}/assemble`)) }

  function getStatus(i: number): 'done' | 'active' | 'running' | 'locked' {
    // Running check per step
    const isRunning =
      (i === 0 && !!scriptStep.jobId) ||
      (i === 3 && !!audioStep.jobId)  ||
      (i === 4 && !!syncStep.jobId)   ||
      (i === 5 && !!(subsStep.jobId || assemble.jobId))
    if (isRunning) return 'running'

    const done = i < 5 ? level >= i + 1 : level === 8
    if (done) return 'done'
    const active = i < 5 ? level === i : level >= 5 && level < 8
    if (active) return 'active'
    return 'locked'
  }

  const stepDone = (i: number) => getStatus(i) === 'done'

  function renderContent() {
    switch (selected) {
      // 01 Script
      case 0: return (
        <>
          {(level === 0 || showForm) && !scriptStep.jobId && (
            <>
              <ModeTabs>
                <ModeTab $active={scriptMode === 'generate'} onClick={() => setScriptMode('generate')}>✦ Generar</ModeTab>
                <ModeTab $active={scriptMode === 'upload'}   onClick={() => setScriptMode('upload')}>↑ Subir JSON</ModeTab>
              </ModeTabs>
              {scriptMode === 'generate'
                ? <ScriptForm initial={idea.form ?? DEFAULT_FORM} onSubmit={handleScript} />
                : (
                  <JsonUploadZone>
                    <input type="file" accept=".json,application/json" onChange={handleScriptUpload} disabled={uploadingScript} />
                    {uploadingScript ? '⏳ Subiendo…' : '📄 Selecciona un script.json'}
                    <span style={{ fontSize: '11px', opacity: 0.6 }}>Debe cumplir el esquema VideoScript</span>
                  </JsonUploadZone>
                )
              }
            </>
          )}
          {scriptStep.jobId && <Terminal logs={scriptStep.logs} running />}
          {level >= 1 && !showForm && !scriptStep.jobId && (
            <>
              <ActionRow>
                <BtnSecondary onClick={() => window.open(`${base}/script`, '_blank')}>Descargar script.json</BtnSecondary>
                <BtnSecondary onClick={() => setShowForm(true)}>↺ Regenerar</BtnSecondary>
              </ActionRow>
              <ScriptViewer url={`${base}/script`} />
            </>
          )}
        </>
      )

      // 02 Imágenes
      case 1: return (
        <>
          {(level === 1 || reuploadImages) && (
            <Uploader
              ideaId={idea.id} endpoint="images"
              accept=".png,.jpg,.jpeg,.webp"
              label="Arrastra las imágenes o haz clic para seleccionar"
              hint="PNG / JPG / WEBP — se ordenan por nombre"
              onUploaded={() => { setReupImages(false); onUpdate() }}
            />
          )}
          {level >= 2 && !reuploadImages && (
            <>
              <ActionRow>
                <BtnSecondary onClick={() => setReupImages(true)}>↺ Resubir imágenes</BtnSecondary>
              </ActionRow>
              <ImageSequence baseUrl={base} />
            </>
          )}
        </>
      )

      // 03 Videos
      case 2: return (
        <>
          {(level === 2 || reuploadVideos) && (
            <Uploader
              ideaId={idea.id} endpoint="videos"
              accept=".mp4"
              label="Arrastra los videos o haz clic para seleccionar"
              hint="Solo .mp4 — se ordenan por nombre"
              onUploaded={() => { setReupVideos(false); onUpdate() }}
            />
          )}
          {level >= 3 && !reuploadVideos && (
            <>
              <ActionRow>
                <BtnSecondary onClick={() => setReupVideos(true)}>↺ Resubir videos</BtnSecondary>
              </ActionRow>
              <VideoSequence baseUrl={base} synced={false} />
            </>
          )}
        </>
      )

      // 04 Audio
      case 3: return (
        <>
          {level === 3 && !audioStep.jobId && (
            <ActionRow><BtnPrimary onClick={handleAudio}>Generar Audio</BtnPrimary></ActionRow>
          )}
          {audioStep.jobId && <Terminal logs={audioStep.logs} running />}
          {level >= 4 && !audioStep.jobId && (
            <>
              <ActionRow>
                <BtnSecondary onClick={handleAudio}>↺ Regenerar Audio</BtnSecondary>
              </ActionRow>
              <AudioSequence baseUrl={base} />
            </>
          )}
        </>
      )

      // 05 Ensamblado
      case 4: return (
        <>
          {level === 4 && !syncStep.jobId && (
            <ActionRow><BtnPrimary onClick={handleSync}>Ensamblar Video</BtnPrimary></ActionRow>
          )}
          {syncStep.jobId && <Terminal logs={syncStep.logs} running />}
          {level >= 5 && !syncStep.jobId && (
            <>
              <ActionRow>
                <BtnSecondary onClick={handleSync}>↺ Re-ensamblar</BtnSecondary>
              </ActionRow>
              <VideoSequence baseUrl={base} synced sectionLabel="Escenas sincronizadas" />
              <VideoPlayer src={`${base}/editions/raw_video.mp4`} label="Video ensamblado (sin subtítulos)" />
            </>
          )}
        </>
      )

      // 06 Producción Final (subtítulos + música + rename)
      case 5: return (
        <>
          {/* Sub-step A: Subtítulos */}
          {level === 5 && !subsStep.jobId && (
            <ActionRow><BtnPrimary onClick={handleSubs}>Generar Subtítulos</BtnPrimary></ActionRow>
          )}
          {subsStep.jobId && <Terminal logs={subsStep.logs} running />}

          {/* Sub-step B: Música + Renombre (solo visible antes de completar) */}
          {level >= 6 && level < 8 && !assemble.jobId && (
            <>
              <VideoPlayer src={`${base}/editions/subtitled_video.mp4`} label="Video con subtítulos" />
              <ActionRow style={{ marginTop: 16 }}>
                <BtnPrimary onClick={handleAssemble}>Agregar Música y Finalizar</BtnPrimary>
                <BtnSecondary onClick={handleSubs}>↺ Regenerar Subtítulos</BtnSecondary>
              </ActionRow>
            </>
          )}
          {assemble.jobId && <Terminal logs={assemble.logs} running />}

          {level === 8 && !assemble.jobId && (
            <>
              <ActionRow>
                <DoneText $completed>🎬 Video completado</DoneText>
                <BtnSecondary onClick={() => window.open(`${base}/video`, '_blank')}>Descargar video</BtnSecondary>
                <BtnSecondary onClick={handleAssemble}>↺ Re-finalizar</BtnSecondary>
              </ActionRow>
              <VideoPlayer src={`${base}/video`} label="Video final" />
            </>
          )}
        </>
      )

      default: return null
    }
  }

  const currentStep = STEPS[selected]
  const status = getStatus(selected)

  return (
    <Wizard>
      <WizardHeader>
        <WizardTitle>{idea.title || `Idea #${idea.id}`}</WizardTitle>
        {idea.category && <WizardCategory>{idea.category}</WizardCategory>}
      </WizardHeader>

      <PipelineHeader steps={STEPS} selected={selected} getStatus={getStatus} onSelect={setSelected} />

      <StepDetail>
        <StepDetailHeader>
          <StepDetailNum>{currentStep.num}</StepDetailNum>
          <StepDetailTitle>{currentStep.title}</StepDetailTitle>
          <StepDetailStatus $done={stepDone(selected)}>
            {status === 'running' ? '⟳ Procesando' : status === 'done' ? '✓ Completado' : status === 'active' ? '● En progreso' : '— Pendiente'}
          </StepDetailStatus>
        </StepDetailHeader>

        {renderContent()}
      </StepDetail>
    </Wizard>
  )
}
