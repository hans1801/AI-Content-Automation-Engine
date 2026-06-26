import { Idea, PipelineLevel } from '../../../tools/types'
import Uploader from '../../Uploader/Uploader'
import VideoSequence from '../components/previews/VideoSequence'
import { ActionRow, BtnSecondary } from '../StepWizard.styled'

interface Props {
  idea: Idea
  base: string
  level: PipelineLevel
  reupload: boolean
  onSetReupload: (v: boolean) => void
  onUploaded: () => void
}

export default function VideosStep({ idea, base, level, reupload, onSetReupload, onUploaded }: Props) {
  return (
    <>
      {(level === 1 || reupload) && (
        <Uploader
          ideaId={idea.id}
          endpoint="videos"
          accept=".mp4"
          label="Arrastra los videos o haz clic para seleccionar"
          hint="Solo .mp4 — se ordenan por nombre"
          onUploaded={() => { onSetReupload(false); onUploaded() }}
        />
      )}
      {level >= 2 && !reupload && (
        <>
          <ActionRow>
            <BtnSecondary onClick={() => onSetReupload(true)}>↺ Resubir videos</BtnSecondary>
          </ActionRow>
          <VideoSequence baseUrl={base} synced={false} />
        </>
      )}
    </>
  )
}
