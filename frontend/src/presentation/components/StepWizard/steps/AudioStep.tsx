import { useEffect, useState } from 'react'
import { PipelineLevel } from '../../../tools/types'
import Terminal from '../components/Terminal/Terminal'
import { ActionRow, BtnPrimary, BtnSecondary } from '../StepWizard.styled'
import { JobStep } from '../../../tools/hooks/useJobStep'
import {
  Header, ColLabel, SceneList, SceneRow,
  NarrationCell, SceneNum, NarrationText,
  AudioCell, AudioEl, PendingBar,
} from './AudioStep.styled'

interface Scene { scene_number: number; narration: string }

function useScript(url: string) {
  const [scenes, setScenes] = useState<Scene[]>([])
  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then((d: { scenes: Scene[] }) => setScenes(d.scenes ?? []))
      .catch(() => {})
  }, [url])
  return scenes
}

function useAudioFiles(url: string, enabled: boolean) {
  const [files, setFiles] = useState<string[]>([])
  useEffect(() => {
    if (!enabled) return
    fetch(`${url}/audios`)
      .then(r => r.json())
      .then(d => setFiles(d as string[]))
      .catch(() => {})
  }, [url, enabled])
  return files
}

interface Props {
  base: string
  level: PipelineLevel
  jobStep: JobStep
  onGenerate: () => void
}

export default function AudioStep({ base, level, jobStep, onGenerate }: Props) {
  const scenes     = useScript(base + '/script')
  const audioFiles = useAudioFiles(base, level >= 3)
  const generated  = level >= 3

  if (jobStep.jobId) return <Terminal logs={jobStep.logs} running />

  return (
    <>
      <ActionRow>
        {generated
          ? <BtnSecondary onClick={onGenerate}>↺ Regenerar Audio</BtnSecondary>
          : <BtnPrimary   onClick={onGenerate}>Generar Audio</BtnPrimary>
        }
      </ActionRow>

      <Header>
        <ColLabel>Guion — {scenes.length} escenas</ColLabel>
        <ColLabel>{generated ? `Voz en off — ${audioFiles.length} pistas` : 'Voz en off — pendiente'}</ColLabel>
      </Header>

      <SceneList>
        {scenes.map((s, i) => (
          <SceneRow key={s.scene_number}>
            <NarrationCell>
              <SceneNum>#{s.scene_number}</SceneNum>
              <NarrationText>{s.narration}</NarrationText>
            </NarrationCell>

            <AudioCell>
              {generated && audioFiles[i]
                ? <AudioEl src={`${base}/audios/${audioFiles[i]}`} controls preload="none" />
                : <PendingBar>▷ — sin generar</PendingBar>
              }
            </AudioCell>
          </SceneRow>
        ))}
      </SceneList>
    </>
  )
}
