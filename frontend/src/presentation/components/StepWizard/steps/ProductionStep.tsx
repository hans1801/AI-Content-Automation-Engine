import { useState } from 'react'
import { PipelineLevel } from '../../../tools/types'
import Terminal from '../components/Terminal/Terminal'
import VideoPlayer from '../components/previews/VideoPlayer'
import MusicLibrary from '../../MusicLibrary/MusicLibrary'
import { ActionRow, BtnPrimary, BtnSecondary, DoneText } from '../StepWizard.styled'
import { JobStep } from '../../../tools/hooks/useJobStep'
import { TwoCol, Left, VolumeRow, VolumeLabel, VolumeSlider, VolumePct, MusicHint } from './ProductionStep.styled'

interface Props {
  base: string
  level: PipelineLevel
  subsStep: JobStep
  assembleStep: JobStep
  onSubs: () => void
  onAssemble: (opts: { musicPath: string; bgVolume: number }) => void
}

export default function ProductionStep({ base, level, subsStep, assembleStep, onSubs, onAssemble }: Props) {
  const [selectedPath, setSelectedPath] = useState('')
  const [volume, setVolume] = useState(18)

  const anyRunning = !!(subsStep.jobId || assembleStep.jobId)

  function handleAssemble() {
    if (!selectedPath) return
    onAssemble({ musicPath: selectedPath, bgVolume: volume / 100 })
  }

  const videoSrc = level >= 7
    ? `${base}/video`
    : level >= 5
      ? `${base}/editions/subtitled_video.mp4`
      : `${base}/editions/raw_video.mp4`

  const videoLabel = level >= 7
    ? 'Video final'
    : level >= 5
      ? 'Video con subtítulos'
      : 'Video ensamblado (sin subtítulos)'

  if (anyRunning) {
    return (
      <>
        {subsStep.jobId    && <Terminal logs={subsStep.logs}    running />}
        {assembleStep.jobId && <Terminal logs={assembleStep.logs} running />}
      </>
    )
  }

  return (
    <TwoCol>
      <Left>
        <MusicLibrary selected={selectedPath} onSelect={setSelectedPath} volume={volume / 100} />

        <VolumeRow>
          <VolumeLabel>Volumen</VolumeLabel>
          <VolumeSlider
            type="range" min={0} max={100} value={volume}
            onChange={e => setVolume(Number(e.target.value))}
          />
          <VolumePct>{volume}%</VolumePct>
        </VolumeRow>

        {level === 4 && (
          <ActionRow>
            <BtnPrimary onClick={onSubs} disabled={!selectedPath}>
              Poner música y generar subtítulos
            </BtnPrimary>
            {!selectedPath && (
              <MusicHint>Selecciona un archivo de música para continuar.</MusicHint>
            )}
          </ActionRow>
        )}

        {level >= 5 && level < 7 && (
          <>
            <ActionRow>
              <BtnPrimary onClick={handleAssemble} disabled={!selectedPath}>
                Agregar Música y Finalizar
              </BtnPrimary>
              <BtnSecondary onClick={onSubs}>↺ Regenerar Subtítulos</BtnSecondary>
            </ActionRow>
            {!selectedPath && (
              <MusicHint>Selecciona un archivo de música para continuar.</MusicHint>
            )}
          </>
        )}

        {level === 7 && (
          <ActionRow>
            <DoneText $completed>🎬 Video completado</DoneText>
            <BtnSecondary onClick={handleAssemble} disabled={!selectedPath}>
              ↺ Re-finalizar
            </BtnSecondary>
          </ActionRow>
        )}
      </Left>

      <VideoPlayer src={videoSrc} label={videoLabel} />
    </TwoCol>
  )
}
