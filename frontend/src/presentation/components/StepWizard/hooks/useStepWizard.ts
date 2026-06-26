import { useState, useEffect, useCallback, useRef } from 'react'
import { Idea, IdeaState, PipelineLevel, ScriptFormData } from '../../../tools/types'
import { api } from '../../../tools/api'
import { useJobStep } from '../../../tools/hooks/useJobStep'

const LEVEL: Record<IdeaState, PipelineLevel> = {
  NEW: 0, SCRIPT_GENERATED: 1, VIDEOS_GENERATED: 2,
  AUDIO_GENERATED: 3, VIDEO_GENERATED: 4, VIDEO_SUBTITLED: 5,
  VIDEO_MUSIC_GENERATED: 6, COMPLETED: 7,
}

export type StepStatus = 'done' | 'active' | 'running' | 'locked'

export interface MusicOpts { musicPath: string; bgVolume: number }

export interface StepWizardState {
  level: PipelineLevel
  selected: number
  setSelected: (i: number) => void
  showForm: boolean
  setShowForm: (v: boolean) => void
  scriptMode: 'generate' | 'upload'
  setScriptMode: (m: 'generate' | 'upload') => void
  uploadingScript: boolean
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
  handleSubs:         (opts: MusicOpts) => Promise<void>
  handleAssemble:     (opts: MusicOpts) => Promise<void>
  getStatus:  (i: number) => StepStatus
  stepDone:   (i: number) => boolean
}

export function useStepWizard(idea: Idea, onUpdate: () => void): StepWizardState {
  const scriptStep = useJobStep()
  const audioStep  = useJobStep()
  const syncStep   = useJobStep()
  const subsStep   = useJobStep()
  const assemble   = useJobStep()

  const pendingMusic = useRef<MusicOpts | null>(null)

  const [selected, setSelected]            = useState(0)
  const [showForm, setShowForm]            = useState(false)
  const [scriptMode, setScriptMode]        = useState<'generate' | 'upload'>('generate')
  const [uploadingScript, setUploadScript] = useState(false)
  const [reuploadVideos, setReupVideos]    = useState(false)

  const level: PipelineLevel = LEVEL[idea.state]

  useEffect(() => {
    setSelected(Math.min(level, 4))
    setShowForm(false)
    setScriptMode('generate')
    setReupVideos(false)
    pendingMusic.current = null
    ;[scriptStep, audioStep, syncStep, subsStep, assemble].forEach(s => s.reset())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idea.id])

  useEffect(() => {
    const steps = [scriptStep, audioStep, syncStep, assemble]
    for (const step of steps) {
      if (step.done && !step.handled.current) {
        step.handled.current = true
        step.clear()
        onUpdate()
      }
    }

    if (subsStep.done && !subsStep.handled.current) {
      subsStep.handled.current = true
      subsStep.clear()
      onUpdate()
      if (pendingMusic.current) {
        const opts = pendingMusic.current
        pendingMusic.current = null
        api.assemble(idea.id, opts).then(jobId => assemble.start(jobId))
      }
    }
  }, [scriptStep.done, audioStep.done, syncStep.done, subsStep.done, assemble.done, onUpdate, idea.id])

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

  const handleAudio = useCallback(async () => {
    audioStep.start(await api.audio(idea.id, level >= 3))
  }, [idea.id, audioStep, level])

  const handleSync = useCallback(async () => {
    syncStep.start(await api.sync(idea.id))
  }, [idea.id, syncStep])

  const handleSubs = useCallback(async (opts: MusicOpts) => {
    pendingMusic.current = opts
    subsStep.start(await api.subtitles(idea.id))
  }, [idea.id, subsStep])

  const handleAssemble = useCallback(async (opts: MusicOpts) => {
    assemble.start(await api.assemble(idea.id, opts))
  }, [idea.id, assemble])

  const getStatus = useCallback((i: number): StepStatus => {
    const isRunning =
      (i === 0 && !!scriptStep.jobId) ||
      (i === 2 && !!audioStep.jobId)  ||
      (i === 3 && !!syncStep.jobId)   ||
      (i === 4 && !!(subsStep.jobId || assemble.jobId))
    if (isRunning) return 'running'
    const done = i < 4 ? level >= i + 1 : level === 7
    if (done) return 'done'
    const active = i < 4 ? level === i : level >= 4 && level < 7
    if (active) return 'active'
    return 'locked'
  }, [level, scriptStep.jobId, audioStep.jobId, syncStep.jobId, subsStep.jobId, assemble.jobId])

  const stepDone = useCallback((i: number) => getStatus(i) === 'done', [getStatus])

  return {
    level, selected, setSelected,
    showForm, setShowForm,
    scriptMode, setScriptMode,
    uploadingScript,
    reuploadVideos, setReupVideos,
    scriptStep, audioStep, syncStep, subsStep, assemble,
    handleScript, handleScriptUpload,
    handleAudio, handleSync, handleSubs, handleAssemble,
    getStatus, stepDone,
  }
}
