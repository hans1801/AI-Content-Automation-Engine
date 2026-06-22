import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Wrap = styled.div`margin-top: 16px;`

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 260px;
  overflow-y: auto;
  scrollbar-width: thin;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const Num = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentLight};
  min-width: 28px;
  font-variant-numeric: tabular-nums;
`

const AudioEl = styled.audio`
  flex: 1;
  height: 28px;
  accent-color: ${({ theme }) => theme.colors.accent};
`

export default function AudioSequence({ baseUrl }: { baseUrl: string }) {
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    fetch(`${baseUrl}/audios`)
      .then(r => r.json())
      .then(data => setFiles(data as string[]))
      .catch(() => {})
  }, [baseUrl])

  if (!files.length) return null

  return (
    <Wrap>
      <SectionLabel>Audio — {files.length} escenas</SectionLabel>
      <List>
        {files.map((name, i) => (
          <Row key={name}>
            <Num>#{i + 1}</Num>
            <AudioEl
              src={`${baseUrl}/audios/${name}`}
              controls
              preload="none"
            />
          </Row>
        ))}
      </List>
    </Wrap>
  )
}
