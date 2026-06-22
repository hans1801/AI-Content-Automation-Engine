import { Idea, PipelineLevel, ScriptFormData, DEFAULT_FORM } from '../../../tools/types'
import ScriptForm from '../../ScriptForm/ScriptForm'
import Terminal from '../components/Terminal/Terminal'
import ScriptViewer from '../components/previews/ScriptViewer'
import { ActionRow, BtnSecondary, ModeTabs, ModeTab, JsonUploadZone } from '../StepWizard.styled'
import { JobStep } from '../../../tools/hooks/useJobStep'

interface Props {
  idea: Idea
  base: string
  level: PipelineLevel
  jobStep: JobStep
  showForm: boolean
  scriptMode: 'generate' | 'upload'
  uploadingScript: boolean
  onSetShowForm: (v: boolean) => void
  onSetScriptMode: (m: 'generate' | 'upload') => void
  onSubmit: (form: ScriptFormData) => void
  onUpload: (file: File) => void
}

export default function ScriptStep({
  idea, base, level, jobStep,
  showForm, scriptMode, uploadingScript,
  onSetShowForm, onSetScriptMode, onSubmit, onUpload,
}: Props) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  const showEditor = (level === 0 || showForm) && !jobStep.jobId

  return (
    <>
      {showEditor && (
        <>
          <ModeTabs>
            <ModeTab $active={scriptMode === 'generate'} onClick={() => onSetScriptMode('generate')}>✦ Generar</ModeTab>
            <ModeTab $active={scriptMode === 'upload'}   onClick={() => onSetScriptMode('upload')}>↑ Subir JSON</ModeTab>
          </ModeTabs>
          {scriptMode === 'generate' ? (
            <ScriptForm initial={idea.form ?? DEFAULT_FORM} onSubmit={onSubmit} />
          ) : (
            <JsonUploadZone>
              <input type="file" accept=".json,application/json" onChange={handleFileChange} disabled={uploadingScript} />
              {uploadingScript ? '⏳ Subiendo…' : '📄 Selecciona un script.json'}
              <span style={{ fontSize: '11px', opacity: 0.6 }}>Debe cumplir el esquema VideoScript</span>
            </JsonUploadZone>
          )}
        </>
      )}

      {jobStep.jobId && <Terminal logs={jobStep.logs} running />}

      {level >= 1 && !showForm && !jobStep.jobId && (
        <>
          <ActionRow>
            <BtnSecondary onClick={() => window.open(`${base}/script`, '_blank')}>Descargar script.json</BtnSecondary>
            <BtnSecondary onClick={() => onSetShowForm(true)}>↺ Regenerar</BtnSecondary>
          </ActionRow>
          <ScriptViewer url={`${base}/script`} />
        </>
      )}
    </>
  )
}
