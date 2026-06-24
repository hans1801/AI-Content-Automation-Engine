import { useState } from 'react'
import { PipelineLevel } from '../../../tools/types'
import Terminal from '../components/Terminal/Terminal'
import VideoPlayer from '../components/previews/VideoPlayer'
import MusicLibrary from '../../MusicLibrary/MusicLibrary'
import { ActionRow, BtnPrimary, BtnSecondary, DoneText } from '../StepWizard.styled'
import { JobStep } from '../../../tools/hooks/useJobStep'
import styled from 'styled-components'

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const VolumeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`

const VolumeLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  min-width: 56px;
`

const VolumeSlider = styled.input`
  flex: 1;
  accent-color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
`

const VolumePct = styled.span`
  font-size: 13px;
  font-weight: 600;
  min-width: 38px;
  text-align: right;
  color: ${({ theme }) => theme.colors.text};
`

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

  const videoSrc = level >= 8
    ? `${base}/video`
    : `${base}/editions/subtitled_video.mp4`

  const videoLabel = level >= 8 ? 'Video final' : 'Video con subtítulos'

  return (
    <>
      {level === 5 && !anyRunning && (
        <ActionRow><BtnPrimary onClick={onSubs}>Generar Subtítulos</BtnPrimary></ActionRow>
      )}

      {subsStep.jobId && <Terminal logs={subsStep.logs} running />}

      {level >= 6 && !anyRunning && (
        <TwoCol>
          {/* Left — music controls */}
          <Left>
            <MusicLibrary
              selected={selectedPath}
              onSelect={setSelectedPath}
            />

            <VolumeRow>
              <VolumeLabel>Volumen</VolumeLabel>
              <VolumeSlider
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
              />
              <VolumePct>{volume}%</VolumePct>
            </VolumeRow>

            {level >= 6 && level < 8 && (
              <ActionRow>
                <BtnPrimary onClick={handleAssemble} disabled={!selectedPath}>
                  Agregar Música y Finalizar
                </BtnPrimary>
                <BtnSecondary onClick={onSubs}>↺ Regenerar Subtítulos</BtnSecondary>
              </ActionRow>
            )}

            {level === 8 && (
              <ActionRow>
                <DoneText $completed>🎬 Video completado</DoneText>
                <BtnSecondary onClick={() => window.open(`${base}/video`, '_blank')}>
                  Descargar
                </BtnSecondary>
                <BtnSecondary onClick={handleAssemble} disabled={!selectedPath}>
                  ↺ Re-finalizar
                </BtnSecondary>
              </ActionRow>
            )}
          </Left>

          {/* Right — video preview */}
          <VideoPlayer src={videoSrc} label={videoLabel} />
        </TwoCol>
      )}

      {assembleStep.jobId && <Terminal logs={assembleStep.logs} running />}
    </>
  )
}
