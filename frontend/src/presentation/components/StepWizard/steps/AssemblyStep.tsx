import { PipelineLevel } from '../../../tools/types'
import Terminal from '../components/Terminal/Terminal'
import VideoSequence from '../components/previews/VideoSequence'
import VideoPlayer from '../components/previews/VideoPlayer'
import { ActionRow, BtnPrimary, BtnSecondary } from '../StepWizard.styled'
import { JobStep } from '../../../tools/hooks/useJobStep'

interface Props {
  base: string
  level: PipelineLevel
  jobStep: JobStep
  onAssemble: () => void
}

export default function AssemblyStep({ base, level, jobStep, onAssemble }: Props) {
  return (
    <>
      {level === 3 && !jobStep.jobId && (
        <ActionRow><BtnPrimary onClick={onAssemble}>Ensamblar Video</BtnPrimary></ActionRow>
      )}
      {jobStep.jobId && <Terminal logs={jobStep.logs} running />}
      {level >= 4 && !jobStep.jobId && (
        <>
          <ActionRow>
            <BtnSecondary onClick={onAssemble}>↺ Re-ensamblar</BtnSecondary>
          </ActionRow>
          <VideoSequence baseUrl={base} synced sectionLabel="Escenas sincronizadas" />
          <VideoPlayer src={`${base}/editions/raw_video.mp4`} label="Video ensamblado (sin subtítulos)" />
        </>
      )}
    </>
  )
}
