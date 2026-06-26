import { useEffect, useRef, useState } from 'react'
import {
  Wrap, SectionLabel, Layout, Filmstrip,
  ThumbWrap, ThumbVideo, ThumbNum, ActiveDot,
  PlayerPane, PlayerWrap, MainVideo,
  PrevBtn, NextBtn, PlayerFooter, SceneNum, EmptyState,
} from './VideoSequence.styled'

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
      .then((data: string[]) => { setFiles(data); setSelected(0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [baseUrl, synced])

  const select = (i: number) => {
    setSelected(i)
    const el = filmstripRef.current?.children[i] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const label = sectionLabel ?? (synced ? 'Videos sincronizados' : 'Videos')

  if (loading) return null
  if (!files.length) return <EmptyState>Sin archivos de video</EmptyState>

  return (
    <Wrap>
      {label && <SectionLabel>{label} — {files.length} escenas</SectionLabel>}
      <Layout>
        <Filmstrip ref={filmstripRef}>
          {files.map((name, i) => (
            <ThumbWrap key={name} $active={i === selected} onClick={() => select(i)}>
              <ThumbVideo
                src={`${baseUrl}/videos/${name}`}
                preload="metadata"
                muted
                $active={i === selected}
              />
              <ActiveDot $visible={i === selected} />
              <ThumbNum $active={i === selected}>#{i + 1}</ThumbNum>
            </ThumbWrap>
          ))}
        </Filmstrip>

        <PlayerPane>
          <PlayerWrap>
            <PrevBtn onClick={() => select(Math.max(0, selected - 1))} disabled={selected === 0}>‹</PrevBtn>
            <MainVideo
              key={`${baseUrl}-${files[selected]}`}
              src={`${baseUrl}/videos/${files[selected]}`}
              controls
              preload="metadata"
            />
            <NextBtn onClick={() => select(Math.min(files.length - 1, selected + 1))} disabled={selected === files.length - 1}>›</NextBtn>
          </PlayerWrap>

          <PlayerFooter>
            <SceneNum>#{selected + 1} / {files.length}</SceneNum>
          </PlayerFooter>
        </PlayerPane>
      </Layout>
    </Wrap>
  )
}
