import { useState, useEffect, useCallback } from 'react'
import { Idea, IdeaState, PipelineLevel, ScriptFormData } from '../../../tools/types'
import { api } from '../../../tools/api'
import { useJobStep } from '../../../tools/hooks/useJobStep'

const LEVEL: Record<IdeaState, PipelineLevel> = {
  NEW: 0, SCRIPT_GENERATED: 1, IMAGES_GENERATED: 2, VIDEOS_GENERATED: 3,
  AUDIO_GENERATED: 4, VIDEO_GENERATED: 5, VIDEO_SUBTITLED: 6,
  VIDEO_MUSIC_GENERATED: 7, COMPLETED: 8,
}

export type StepStatus = 'done' | 'active' | 'running' | 'locked'

export interface StepWizardState {
  level: PipelineLevel
  selected: number
  setSelected: (i: number) => void
  showForm: boolean
  setShowForm: (v: boolean) => void
  scriptMode: 'generate' | 'upload'
  setScriptMode: (m: 'generate' | 'upload') => void
  uploadingScript: boolean
  reuploadImages: boolean
  setReupImages: (v: boolean) => void
  reuploadVideos: boolean
  setReupVideos: (v: boolean) => void
  scriptStep: ReturnType<typeof useJobStep>
  audioStep:  ReturnType<typeof useJobStep>
  syncStep:   ReturnType<typeof useJobStep>
  subsStep:   ReturnType<typeof useJobStep>
  assemble:   ReturnType<typeof useJobStep>
  handleScript:       (form: ScriptFormData) => Promise<void>
  handleScriptUpload: (file: File) => Promise<void>
  handleAudio:        () => Promise<void>
  handleSync:         () => Promise<void>
  handleSubs:         () => Promise<void>
  handleAssemble:     (opts: { musicPath: string; bgVolume: number }) => Promise<void>
  getStatus:  (i: number) => StepStatus
  stepDone:   (i: number) => boolean
}

export function useStepWizard(idea: Idea, onUpdate: () => void): StepWizardState {
  const scriptStep = useJobStep()
  const audioStep  = useJobStep()
  const syncStep   = useJobStep()
  const subsStep   = useJobStep()
  const assemble   = useJobStep()

  const [selected, setSelected]            = useState(0)
  const [showForm, setShowForm]            = useState(false)
  const [scriptMode, setScriptMode]        = useState<'generate' | 'upload'>('generate')
  const [uploadingScript, setUploadScript] = useState(false)
  const [reuploadImages, setReupImages]    = useState(false)
  const [reuploadVideos, setReupVideos]    = useState(false)

  const level: PipelineLevel = LEVEL[idea.state]

  // Reset all state when idea changes
  useEffect(() => {
    setSelected(Math.min(level, 5))
    setShowForm(false)
    setScriptMode('generate')
    setReupImages(false)
    setReupVideos(false)
    ;[scriptStep, audioStep, syncStep, subsStep, assemble].forEach(s => s.reset())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idea.id])

  // Auto-advance to next step when a job completes
  useEffect(() => {
    const pairs = [
      [scriptStep, 1], [audioStep, 4], [syncStep, 5],
      [subsStep, 5], [assemble, 5],
    ] as const
    for (const [step, next] of pairs) {
      if (step.done && !step.handled.current) {
        step.handled.current = true
        step.clear()
        onUpdate()
        setSelected(next)
      }
    }
  }, [scriptStep.done, audioStep.done, syncStep.done, subsStep.done, assemble.done, onUpdate])

  const handleScript = useCallback(async (form: ScriptFormData) => {
    setShowForm(false)
    const jobId = await api.script.generate(idea.id, form)
    scriptStep.start(jobId)
  }, [idea.id, scriptStep])

  const handleScriptUpload = useCallback(async (file: File) => {
    setUploadScript(true)
    try {
      await api.script.upload(idea.id, file)
      setShowForm(false)
      onUpdate()
    } finally {
      setUploadScript(false)
    }
  }, [idea.id, onUpdate])

  const handleAudio    = useCallback(async () => { audioStep.start(await api.audio(idea.id)) },    [idea.id, audioStep])
  const handleSync     = useCallback(async () => { syncStep.start(await api.sync(idea.id)) },      [idea.id, syncStep])
  const handleSubs     = useCallback(async () => { subsStep.start(await api.subtitles(idea.id)) }, [idea.id, subsStep])
  const handleAssemble = useCallback(async (opts: { musicPath: string; bgVolume: number }) => {
    assemble.start(await api.assemble(idea.id, opts))
  }, [idea.id, assemble])

  const getStatus = useCallback((i: number): StepStatus => {
    const isRunning =
      (i === 0 && !!scriptStep.jobId) ||
      (i === 3 && !!audioStep.jobId)  ||
      (i === 4 && !!syncStep.jobId)   ||
      (i === 5 && !!(subsStep.jobId || assemble.jobId))
    if (isRunning) return 'running'
    const done = i < 5 ? level >= i + 1 : level === 8
    if (done) return 'done'
    const active = i < 5 ? level === i : level >= 5 && level < 8
    if (active) return 'active'
    return 'locked'
  }, [level, scriptStep.jobId, audioStep.jobId, syncStep.jobId, subsStep.jobId, assemble.jobId])

  const stepDone = useCallback((i: number) => getStatus(i) === 'done', [getStatus])

  return {
    level, selected, setSelected,
    showForm, setShowForm,
    scriptMode, setScriptMode,
    uploadingScript,
    reuploadImages, setReupImages,
    reuploadVideos, setReupVideos,
    scriptStep, audioStep, syncStep, subsStep, assemble,
    handleScript, handleScriptUpload,
    handleAudio, handleSync, handleSubs, handleAssemble,
    getStatus, stepDone,
  }
}
