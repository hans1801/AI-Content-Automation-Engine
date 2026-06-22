import { Idea } from '../../tools/types'
import PipelineHeader, { PipelineStep } from './components/PipelineHeader/PipelineHeader'
import { useStepWizard } from './hooks/useStepWizard'
import ScriptStep    from './steps/ScriptStep'
import ImagesStep    from './steps/ImagesStep'
import VideosStep    from './steps/VideosStep'
import AudioStep     from './steps/AudioStep'
import AssemblyStep  from './steps/AssemblyStep'
import ProductionStep from './steps/ProductionStep'
import {
  Wizard, WizardHeader, WizardTitle, WizardCategory,
  StepDetail, StepDetailHeader, StepDetailNum, StepDetailTitle, StepDetailStatus,
} from './StepWizard.styled'

const STEPS: PipelineStep[] = [
  { num: '01', title: 'Script' },
  { num: '02', title: 'Imágenes' },
  { num: '03', title: 'Videos' },
  { num: '04', title: 'Audio' },
  { num: '05', title: 'Ensamblado' },
  { num: '06', title: 'Producción Final' },
]

const STATUS_LABEL: Record<string, string> = {
  running: '⟳ Procesando',
  done:    '✓ Completado',
  active:  '● En progreso',
  locked:  '— Pendiente',
}

interface Props { idea: Idea; onUpdate: () => void }

export default function StepWizard({ idea, onUpdate }: Props) {
  const w = useStepWizard(idea, onUpdate)
  const base = `/api/ideas/${idea.id}`
  const currentStep = STEPS[w.selected]
  const status = w.getStatus(w.selected)

  function renderStep() {
    switch (w.selected) {
      case 0: return (
        <ScriptStep
          idea={idea} base={base} level={w.level}
          jobStep={w.scriptStep}
          showForm={w.showForm} scriptMode={w.scriptMode} uploadingScript={w.uploadingScript}
          onSetShowForm={w.setShowForm} onSetScriptMode={w.setScriptMode}
          onSubmit={w.handleScript} onUpload={w.handleScriptUpload}
        />
      )
      case 1: return (
        <ImagesStep
          idea={idea} base={base} level={w.level}
          reupload={w.reuploadImages} onSetReupload={w.setReupImages}
          onUploaded={onUpdate}
        />
      )
      case 2: return (
        <VideosStep
          idea={idea} base={base} level={w.level}
          reupload={w.reuploadVideos} onSetReupload={w.setReupVideos}
          onUploaded={onUpdate}
        />
      )
      case 3: return (
        <AudioStep
          base={base} level={w.level}
          jobStep={w.audioStep} onGenerate={w.handleAudio}
        />
      )
      case 4: return (
        <AssemblyStep
          base={base} level={w.level}
          jobStep={w.syncStep} onAssemble={w.handleSync}
        />
      )
      case 5: return (
        <ProductionStep
          base={base} level={w.level}
          subsStep={w.subsStep} assembleStep={w.assemble}
          onSubs={w.handleSubs} onAssemble={w.handleAssemble}
        />
      )
      default: return null
    }
  }

  return (
    <Wizard>
      <WizardHeader>
        <WizardTitle>{idea.title || `Idea #${idea.id}`}</WizardTitle>
        {idea.category && <WizardCategory>{idea.category}</WizardCategory>}
      </WizardHeader>

      <PipelineHeader
        steps={STEPS}
        selected={w.selected}
        getStatus={w.getStatus}
        onSelect={w.setSelected}
      />

      <StepDetail>
        <StepDetailHeader>
          <StepDetailNum>{currentStep.num}</StepDetailNum>
          <StepDetailTitle>{currentStep.title}</StepDetailTitle>
          <StepDetailStatus $done={w.stepDone(w.selected)}>
            {STATUS_LABEL[status]}
          </StepDetailStatus>
        </StepDetailHeader>

        {renderStep()}
      </StepDetail>
    </Wizard>
  )
}
