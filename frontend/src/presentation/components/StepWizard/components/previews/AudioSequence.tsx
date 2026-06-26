import { useEffect, useState } from 'react'
import { Wrap, SectionLabel, List, Row, Num, AudioEl } from './AudioSequence.styled'

export default function AudioSequence({ baseUrl, hideLabel }: { baseUrl: string; hideLabel?: boolean }) {
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
      {!hideLabel && <SectionLabel>Audio — {files.length} escenas</SectionLabel>}
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
