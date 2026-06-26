import { Idea, PipelineLevel, ScriptFormData, DEFAULT_FORM } from '../../../tools/types'
import ScriptForm from '../../ScriptForm/ScriptForm'
import Terminal from '../components/Terminal/Terminal'
import ScriptViewer from '../components/previews/ScriptViewer'
import { JsonUploadZone } from '../StepWizard.styled'
import { JobStep } from '../../../tools/hooks/useJobStep'
import { UploadLink, UploadWrap, BackLink } from './ScriptStep.styled'

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
          {scriptMode === 'generate' ? (
            <>
              <ScriptForm initial={idea.form ?? DEFAULT_FORM} onSubmit={onSubmit} />
              <UploadLink onClick={() => onSetScriptMode('upload')}>
                ¿Ya tienes un script? Subir archivo JSON
              </UploadLink>
            </>
          ) : (
            <UploadWrap>
              <BackLink onClick={() => onSetScriptMode('generate')}>
                ← Volver a generar con IA
              </BackLink>
              <JsonUploadZone>
                <input type="file" accept=".json,application/json" onChange={handleFileChange} disabled={uploadingScript} />
                {uploadingScript ? '⏳ Subiendo…' : '↑ Selecciona un script.json'}
                <span style={{ fontSize: '11px', opacity: 0.6 }}>Debe cumplir el esquema VideoScript</span>
              </JsonUploadZone>
            </UploadWrap>
          )}
        </>
      )}

      {jobStep.jobId && <Terminal logs={jobStep.logs} running />}

      {level >= 1 && !showForm && !jobStep.jobId && (
        <ScriptViewer url={`${base}/script`} />
      )}
    </>
  )
}
