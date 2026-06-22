import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

const scaleIn = keyframes`from { transform: scale(0.96); opacity: 0 } to { transform: scale(1); opacity: 1 }`

const Wrap = styled.div`margin-top: 16px;`

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
`

const Layout = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`

const Filmstrip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 72px);
  gap: 6px;
  overflow-y: auto;
  max-height: calc(100vh - 280px);
  flex-shrink: 0;
  padding-right: 4px;
  scrollbar-width: thin;
  align-content: start;
`

const ThumbWrap = styled.div<{ $selected: boolean }>`
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 6px;
  border: 2px solid ${({ $selected, theme }) => $selected ? theme.colors.accent : theme.colors.border};
  box-shadow: ${({ $selected }) => $selected ? '0 0 12px rgba(124,58,237,0.5)' : 'none'};
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
  overflow: hidden;
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    transform: scale(1.03);
  }
`

const Thumb = styled.img`
  width: 72px;
  height: 128px;
  object-fit: cover;
  display: block;
`

const ThumbLabel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  font-size: 9px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  padding: 2px 0;
`

const PreviewPane = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

const PreviewImg = styled.img`
  max-height: calc(100vh - 320px);
  width: auto;
  max-width: 100%;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
  animation: ${scaleIn} 0.2s ease;
  display: block;
`

const PreviewFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const PreviewNum = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentLight};
  font-variant-numeric: tabular-nums;
`

const NavBtn = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  padding: 5px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.surfaceHover}; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`

export default function ImageSequence({ baseUrl }: { baseUrl: string }) {
  const [files, setFiles] = useState<string[]>([])
  const [selected, setSelected] = useState(0)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`${baseUrl}/images`)
      .then(r => r.json())
      .then(data => { setFiles(data as string[]); setSelected(0) })
      .catch(() => {})
  }, [baseUrl])

  useEffect(() => {
    const el = stripRef.current?.children[selected] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selected])

  if (!files.length) return null

  return (
    <Wrap>
      <SectionLabel>Imágenes — {files.length} escenas</SectionLabel>
      <Layout>
        <Filmstrip ref={stripRef}>
          {files.map((name, i) => (
            <ThumbWrap key={name} $selected={selected === i} onClick={() => setSelected(i)}>
              <Thumb src={`${baseUrl}/images/${name}`} alt={`Escena ${i + 1}`} loading="lazy" />
              <ThumbLabel>#{i + 1}</ThumbLabel>
            </ThumbWrap>
          ))}
        </Filmstrip>

        <PreviewPane>
          <PreviewImg
            key={files[selected]}
            src={`${baseUrl}/images/${files[selected]}`}
            alt={`Escena ${selected + 1}`}
          />
          <PreviewFooter>
            <NavBtn onClick={() => setSelected(s => Math.max(0, s - 1))} disabled={selected === 0}>‹</NavBtn>
            <PreviewNum>#{selected + 1} / {files.length}</PreviewNum>
            <NavBtn onClick={() => setSelected(s => Math.min(files.length - 1, s + 1))} disabled={selected === files.length - 1}>›</NavBtn>
          </PreviewFooter>
        </PreviewPane>
      </Layout>
    </Wrap>
  )
}
