import { Idea, PipelineLevel } from '../../../tools/types'
import Uploader from '../../Uploader/Uploader'
import ImageSequence from '../components/previews/ImageSequence'
import { ActionRow, BtnSecondary } from '../StepWizard.styled'

interface Props {
  idea: Idea
  base: string
  level: PipelineLevel
  reupload: boolean
  onSetReupload: (v: boolean) => void
  onUploaded: () => void
}

export default function ImagesStep({ idea, base, level, reupload, onSetReupload, onUploaded }: Props) {
  return (
    <>
      {(level === 1 || reupload) && (
        <Uploader
          ideaId={idea.id}
          endpoint="images"
          accept=".png,.jpg,.jpeg,.webp"
          label="Arrastra las imágenes o haz clic para seleccionar"
          hint="PNG / JPG / WEBP — se ordenan por nombre"
          onUploaded={() => { onSetReupload(false); onUploaded() }}
        />
      )}
      {level >= 2 && !reupload && (
        <>
          <ActionRow>
            <BtnSecondary onClick={() => onSetReupload(true)}>↺ Resubir imágenes</BtnSecondary>
          </ActionRow>
          <ImageSequence baseUrl={base} />
        </>
      )}
    </>
  )
}
