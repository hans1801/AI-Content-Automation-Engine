import { useEffect, useState } from 'react'
import styled from 'styled-components'

interface Subject { description: string; action: string }
interface ImagePrompt {
  subjects: Subject[]
  environment: string
  lighting: string
  composition: string
  style: string
  aspect_ratio: string
}
interface VideoPrompt {
  motion: string
  camera_movement: string
  transition: string
  duration_hint: string
}
interface Scene {
  scene_number: number
  narration: string
  image_prompt: ImagePrompt
  video_prompt: VideoPrompt
}
interface Script { scenes: Scene[] }

const Wrap = styled.div`
  margin-top: 16px;
`

const Label = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
`

const SceneList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
`

const CardTop = styled.div`
  display: flex;
  gap: 10px;
  align-items: baseline;
  padding: 10px 14px;
`

const Num = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentLight};
  flex-shrink: 0;
`

const Narration = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 14px;
`

const CardBottom = styled.div`
  display: flex;
  padding: 10px 0;
`

const Section = styled.div<{ $right?: boolean }>`
  flex: 1;
  min-width: 0;
  padding: 0 14px;
  border-right: ${({ $right, theme }) => $right ? `1px solid ${theme.colors.border}` : 'none'};
`

const SectionTitle = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  opacity: 0.7;
  margin-bottom: 8px;
`

const Row = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 11px;
  line-height: 1.4;
`

const Key = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
  width: 72px;
  font-weight: 500;
`

const Val = styled.span`
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.85;
`

export default function ScriptViewer({ url }: { url: string }) {
  const [script, setScript] = useState<Script | null>(null)

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(data => setScript(data as Script))
      .catch(() => {})
  }, [url])

  if (!script) return null

  return (
    <Wrap>
      <Label>Script — {script.scenes.length} escenas</Label>
      <SceneList>
        {script.scenes.map(s => (
          <Card key={s.scene_number}>
            <CardTop>
              <Num>#{s.scene_number}</Num>
              <Narration>{s.narration}</Narration>
            </CardTop>
            <Divider />
            <CardBottom>
              <Section $right>
                <SectionTitle>Prompt imagen</SectionTitle>
                {s.image_prompt.subjects.map((sub, i) => (
                  <Row key={i}>
                    <Key>Sujeto {i + 1}</Key>
                    <Val>{sub.description} — {sub.action}</Val>
                  </Row>
                ))}
                <Row><Key>Entorno</Key><Val>{s.image_prompt.environment}</Val></Row>
                <Row><Key>Iluminación</Key><Val>{s.image_prompt.lighting}</Val></Row>
                <Row><Key>Composición</Key><Val>{s.image_prompt.composition}</Val></Row>
                <Row><Key>Estilo</Key><Val>{s.image_prompt.style}</Val></Row>
              </Section>
              <Section>
                <SectionTitle>Prompt video</SectionTitle>
                <Row><Key>Movimiento</Key><Val>{s.video_prompt.motion}</Val></Row>
                <Row><Key>Cámara</Key><Val>{s.video_prompt.camera_movement}</Val></Row>
                <Row><Key>Transición</Key><Val>{s.video_prompt.transition}</Val></Row>
                <Row><Key>Duración</Key><Val>{s.video_prompt.duration_hint}</Val></Row>
              </Section>
            </CardBottom>
          </Card>
        ))}
      </SceneList>
    </Wrap>
  )
}
