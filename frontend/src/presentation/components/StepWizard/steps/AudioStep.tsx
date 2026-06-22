import { PipelineLevel } from '../../../tools/types'
import Terminal from '../components/Terminal/Terminal'
import AudioSequence from '../components/previews/AudioSequence'
import { ActionRow, BtnPrimary, BtnSecondary } from '../StepWizard.styled'
import { JobStep } from '../../../tools/hooks/useJobStep'

interface Props {
  base: string
  level: PipelineLevel
  jobStep: JobStep
  onGenerate: () => void
}

export default function AudioStep({ base, level, jobStep, onGenerate }: Props) {
  return (
    <>
      {level === 3 && !jobStep.jobId && (
        <ActionRow><BtnPrimary onClick={onGenerate}>Generar Audio</BtnPrimary></ActionRow>
      )}
      {jobStep.jobId && <Terminal logs={jobStep.logs} running />}
      {level >= 4 && !jobStep.jobId && (
        <>
          <ActionRow>
            <BtnSecondary onClick={onGenerate}>↺ Regenerar Audio</BtnSecondary>
          </ActionRow>
          <AudioSequence baseUrl={base} />
        </>
      )}
    </>
  )
}
