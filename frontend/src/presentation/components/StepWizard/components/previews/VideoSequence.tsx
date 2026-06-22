import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

// ─── Iter 1: Estructura base filmstrip + player ───────────────────────────────

const Wrap = styled.div`
  margin-top: 16px;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

const SceneCounter = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accentLight};
  font-variant-numeric: tabular-nums;
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(124, 58, 237, 0.25);
  padding: 2px 8px;
  border-radius: 999px;
`

// ─── Iter 2: Player principal — respeta ratio 9:16 ───────────────────────────

const PlayerSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
  min-height: 240px;
  position: relative;
`

const MainVideo = styled.video`
  height: clamp(220px, 40vh, 380px);
  width: auto;
  max-width: 100%;
  border-radius: 8px;
  background: #000;
  display: block;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`

const PlayerLabel = styled.div`
  position: absolute;
  top: 10px;
  left: 14px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentLight};
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 8px;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
`

const NavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  color: ${({ theme }) => theme.colors.text};
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: background 0.15s, border-color 0.15s;
  z-index: 2;

  &:hover:not(:disabled) {
    background: rgba(124, 58, 237, 0.5);
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
`

const PrevBtn = styled(NavBtn)`left: 8px;`
const NextBtn = styled(NavBtn)`right: 8px;`

// ─── Iter 3: Filmstrip — thumbnails seleccionables ───────────────────────────

const Filmstrip = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 4px 2px 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
`

const ThumbBtn = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  outline: none;
`

// ─── Iter 4: Thumbnail — preload metadata para mostrar primer frame ───────────

const ThumbVideo = styled.video<{ $active: boolean }>`
  width: 54px;
  height: 96px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.accent : theme.colors.border};
  background: #000;
  pointer-events: none;
  display: block;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
  box-shadow: ${({ $active }) =>
    $active ? '0 0 10px rgba(124, 58, 237, 0.45)' : 'none'};

  ${ThumbBtn}:hover & {
    border-color: ${({ theme, $active }) =>
      $active ? theme.colors.accent : theme.colors.borderStrong};
    transform: scale(1.05);
  }
`

const pulse = keyframes`
  0%, 100% { opacity: 1 }
  50% { opacity: 0.5 }
`

const ActiveDot = styled.span<{ $visible: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  animation: ${pulse} 1.5s ease infinite;
`

const ThumbNum = styled.span<{ $active: boolean }>`
  font-size: 10px;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentLight : theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  transition: color 0.15s;
`

// ─── Iter 5: Responsive — funciona bien desde 320px hasta 1100px+ ─────────────

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  margin-top: 16px;
`

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  baseUrl: string
  synced: boolean
  sectionLabel?: string
}

export default function VideoSequence({ baseUrl, synced, sectionLabel }: Props) {
  const [files, setFiles] = useState<string[]>([])
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(true)
  const filmstripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`${baseUrl}/videos?synced=${synced}`)
      .then(r => r.json())
      .then((data: string[]) => {
        setFiles(data)
        setSelected(0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [baseUrl, synced])

  const select = (i: number) => {
    setSelected(i)
    // Scroll thumbnail into view
    const strip = filmstripRef.current
    if (strip) {
      const thumb = strip.children[i] as HTMLElement
      if (thumb) thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }

  const label = sectionLabel ?? (synced ? 'Videos sincronizados' : 'Videos')

  if (loading) return null

  if (!files.length) {
    return <EmptyState>Sin archivos de video</EmptyState>
  }

  return (
    <Wrap>
      <TopBar>
        <SectionLabel>{label}</SectionLabel>
        <SceneCounter>
          {selected + 1} / {files.length} escenas
        </SceneCounter>
      </TopBar>

      {/* Player principal */}
      <PlayerSection>
        <PlayerLabel>Escena #{selected + 1}</PlayerLabel>

        <PrevBtn
          onClick={() => select(Math.max(0, selected - 1))}
          disabled={selected === 0}
          aria-label="Escena anterior"
        >
          ‹
        </PrevBtn>

        <MainVideo
          key={`${baseUrl}-${files[selected]}`}
          src={`${baseUrl}/videos/${files[selected]}`}
          controls
          preload="metadata"
        />

        <NextBtn
          onClick={() => select(Math.min(files.length - 1, selected + 1))}
          disabled={selected === files.length - 1}
          aria-label="Escena siguiente"
        >
          ›
        </NextBtn>
      </PlayerSection>

      {/* Filmstrip */}
      <Filmstrip ref={filmstripRef}>
        {files.map((name, i) => (
          <ThumbBtn
            key={name}
            $active={i === selected}
            onClick={() => select(i)}
            aria-label={`Ir a escena ${i + 1}`}
          >
            <ThumbVideo
              src={`${baseUrl}/videos/${name}`}
              preload="metadata"
              muted
              $active={i === selected}
            />
            <ActiveDot $visible={i === selected} />
            <ThumbNum $active={i === selected}>#{i + 1}</ThumbNum>
          </ThumbBtn>
        ))}
      </Filmstrip>
    </Wrap>
  )
}
