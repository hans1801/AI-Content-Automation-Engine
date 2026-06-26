import { PipelineLevel } from '../../../tools/types'
import Terminal from '../components/Terminal/Terminal'
import VideoSequence from '../components/previews/VideoSequence'
import AudioSequence from '../components/previews/AudioSequence'
import VideoPlayer from '../components/previews/VideoPlayer'
import { ActionRow, BtnPrimary, BtnSecondary } from '../StepWizard.styled'
import { JobStep } from '../../../tools/hooks/useJobStep'
import { TwoCol, ColLabel } from './AssemblyStep.styled'

interface Props {
  base: string
  level: PipelineLevel
  jobStep: JobStep
  onAssemble: () => void
}

export default function AssemblyStep({ base, level, jobStep, onAssemble }: Props) {
  if (jobStep.jobId) return <Terminal logs={jobStep.logs} running />

  if (level >= 4) {
    return (
      <>
        <ActionRow>
          <BtnSecondary onClick={onAssemble}>↺ Re-ensamblar</BtnSecondary>
        </ActionRow>
        <VideoSequence baseUrl={base} synced sectionLabel="Escenas sincronizadas" />
        <VideoPlayer src={`${base}/editions/raw_video.mp4`} label="Video ensamblado (sin subtítulos)" />
      </>
    )
  }

  return (
    <>
      <ActionRow>
        <BtnPrimary onClick={onAssemble}>Ensamblar Video</BtnPrimary>
      </ActionRow>

      <TwoCol>
        <div>
          <ColLabel>Videos de escenas</ColLabel>
          <VideoSequence baseUrl={base} synced={false} sectionLabel="" />
        </div>
        <div>
          <ColLabel>Audios de escenas</ColLabel>
          <AudioSequence baseUrl={base} hideLabel />
        </div>
      </TwoCol>
    </>
  )
}
