import { Idea } from '../../tools/types'
import PipelineHeader, { PipelineStep } from './components/PipelineHeader/PipelineHeader'
import { useStepWizard } from './hooks/useStepWizard'
import ScriptStep    from './steps/ScriptStep'
import VideosStep    from './steps/VideosStep'
import AudioStep     from './steps/AudioStep'
import AssemblyStep  from './steps/AssemblyStep'
import ProductionStep from './steps/ProductionStep'
import {
  Wizard, WizardHeader, WizardTitle, WizardCategory,
  StepDetail, StepDetailHeader, StepDetailNum, StepDetailTitle, StepDetailStatus,
  BtnPrimary, BtnSecondary,
} from './StepWizard.styled'

const STEPS: PipelineStep[] = [
  { num: '01', title: 'Script' },
  { num: '02', title: 'Escenas' },
  { num: '03', title: 'Voz en off' },
  { num: '04', title: 'Ensamblado' },
  { num: '05', title: 'Subtítulos y música' },
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
        <VideosStep
          idea={idea} base={base} level={w.level}
          reupload={w.reuploadVideos} onSetReupload={w.setReupVideos}
          onUploaded={onUpdate}
        />
      )
      case 2: return (
        <AudioStep
          base={base} level={w.level}
          jobStep={w.audioStep} onGenerate={w.handleAudio}
        />
      )
      case 3: return (
        <AssemblyStep
          base={base} level={w.level}
          jobStep={w.syncStep} onAssemble={w.handleSync}
        />
      )
      case 4: return (
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

          {/* Acciones contextuales del paso actual */}
          {w.selected === 0 && w.level >= 1 && !w.showForm && !w.scriptStep.jobId && (
            <>
              <BtnSecondary style={{ marginLeft: 'auto' }} onClick={() => window.open(`${base}/script`, '_blank')}>
                ↓ Descargar script
              </BtnSecondary>
              <BtnSecondary onClick={() => w.setShowForm(true)}>↺ Regenerar</BtnSecondary>
            </>
          )}

          {status === 'done' && w.selected < STEPS.length - 1 && (
            <BtnPrimary
              style={{ marginLeft: w.selected === 0 ? undefined : 'auto' }}
              onClick={() => w.setSelected(w.selected + 1)}
            >
              Siguiente →
            </BtnPrimary>
          )}

          {w.selected === STEPS.length - 1 && w.level >= 5 && !w.subsStep.jobId && !w.assemble.jobId && (
            <BtnPrimary
              style={{ marginLeft: 'auto' }}
              onClick={() => window.open(
                w.level >= 7 ? `${base}/video` : `${base}/editions/subtitled_video.mp4`,
                '_blank'
              )}
            >
              ⬇ Descargar video
            </BtnPrimary>
          )}
        </StepDetailHeader>

        {renderStep()}
      </StepDetail>
    </Wizard>
  )
}
