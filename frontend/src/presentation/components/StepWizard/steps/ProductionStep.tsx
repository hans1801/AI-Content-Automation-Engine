import { PipelineLevel } from '../../../tools/types'
import Terminal from '../components/Terminal/Terminal'
import VideoPlayer from '../components/previews/VideoPlayer'
import { ActionRow, BtnPrimary, BtnSecondary, DoneText } from '../StepWizard.styled'
import { JobStep } from '../../../tools/hooks/useJobStep'

interface Props {
  base: string
  level: PipelineLevel
  subsStep: JobStep
  assembleStep: JobStep
  onSubs: () => void
  onAssemble: () => void
}

export default function ProductionStep({ base, level, subsStep, assembleStep, onSubs, onAssemble }: Props) {
  const anyRunning = !!(subsStep.jobId || assembleStep.jobId)

  return (
    <>
      {level === 5 && !anyRunning && (
        <ActionRow><BtnPrimary onClick={onSubs}>Generar Subtítulos</BtnPrimary></ActionRow>
      )}

      {subsStep.jobId && <Terminal logs={subsStep.logs} running />}

      {level >= 6 && level < 8 && !anyRunning && (
        <>
          <VideoPlayer src={`${base}/editions/subtitled_video.mp4`} label="Video con subtítulos" />
          <ActionRow style={{ marginTop: 16 }}>
            <BtnPrimary onClick={onAssemble}>Agregar Música y Finalizar</BtnPrimary>
            <BtnSecondary onClick={onSubs}>↺ Regenerar Subtítulos</BtnSecondary>
          </ActionRow>
        </>
      )}

      {assembleStep.jobId && <Terminal logs={assembleStep.logs} running />}

      {level === 8 && !anyRunning && (
        <>
          <ActionRow>
            <DoneText $completed>🎬 Video completado</DoneText>
            <BtnSecondary onClick={() => window.open(`${base}/video`, '_blank')}>Descargar video</BtnSecondary>
            <BtnSecondary onClick={onAssemble}>↺ Re-finalizar</BtnSecondary>
          </ActionRow>
          <VideoPlayer src={`${base}/video`} label="Video final" />
        </>
      )}
    </>
  )
}
