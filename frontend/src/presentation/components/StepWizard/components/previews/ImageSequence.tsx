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

const Strip = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: thin;
`

const Item = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const Thumb = styled.img`
  width: 90px;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    transform: scale(1.03);
  }
`

const Label = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`

export default function ImageSequence({ baseUrl }: { baseUrl: string }) {
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    fetch(`${baseUrl}/images`)
      .then(r => r.json())
      .then(data => setFiles(data as string[]))
      .catch(() => {})
  }, [baseUrl])

  if (!files.length) return null

  return (
    <Wrap>
      <SectionLabel>Imágenes — {files.length} escenas</SectionLabel>
      <Strip>
        {files.map((name, i) => (
          <Item key={name}>
            <Thumb
              src={`${baseUrl}/images/${name}`}
              alt={`Escena ${i + 1}`}
              loading="lazy"
              onClick={() => window.open(`${baseUrl}/images/${name}`, '_blank')}
            />
            <Label>#{i + 1}</Label>
          </Item>
        ))}
      </Strip>
    </Wrap>
  )
}
