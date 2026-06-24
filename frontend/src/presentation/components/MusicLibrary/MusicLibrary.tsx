import { useState, useCallback, useRef, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { MusicNode } from '../../tools/types'
import { api } from '../../tools/api'

// ─── Animations ───────────────────────────────────────────────────────────────

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`

// ─── Layout ───────────────────────────────────────────────────────────────────

const Root = styled.div<{ $dragging: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bg};
  border: 1.5px solid ${({ $dragging, theme }) => $dragging ? theme.colors.accent : theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.15s;
  position: relative;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

const HeaderTitle = styled.span`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  flex: 1;
`

const TrackCount = styled.span`
  font-size: 11px;
  padding: 2px 8px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: 99px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const UploadBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: none;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.12s;
  &:hover {
    background: ${({ theme }) => theme.colors.accentGlow};
    color: ${({ theme }) => theme.colors.accentLight};
    border-color: ${({ theme }) => theme.colors.accentLight};
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

// ─── Tree ─────────────────────────────────────────────────────────────────────

const Tree = styled.div`
  overflow-y: auto;
  max-height: 260px;
  padding: 4px 0;
`

const FolderRow = styled.div<{ $depth: number }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px ${({ $depth }) => 12 + $depth * 18}px;
  cursor: pointer;
  user-select: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.mono};
  &:hover { background: ${({ theme }) => theme.colors.surfaceHover}; }

  .del { display: none; }
  &:hover .del { display: flex; }
`

const FileRow = styled.div<{ $depth: number; $selected: boolean; $previewing: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 6px ${({ $depth }) => 12 + $depth * 18}px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.mono};
  transition: background 0.1s;
  border-left: 2px solid ${({ $selected, theme }) => $selected ? theme.colors.accent : 'transparent'};
  background: ${({ $selected, $previewing, theme }) =>
    $selected ? theme.colors.accentGlow
    : $previewing ? `${theme.colors.successBg}`
    : 'transparent'};
  color: ${({ $selected, theme }) => $selected ? theme.colors.text : theme.colors.textMuted};

  &:hover {
    background: ${({ $selected, theme }) => $selected ? theme.colors.accentGlow : theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }

  .actions { display: none; }
  &:hover .actions { display: flex; }
`

const FileName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const SelectedBadge = styled.span`
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 99px;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  flex-shrink: 0;
`

const ActionBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  padding: 2px 5px;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  &:hover { background: ${({ theme }) => theme.colors.borderStrong}; color: ${({ theme }) => theme.colors.text}; }
`

const FolderCount = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.6;
`

// ─── Drop zone ────────────────────────────────────────────────────────────────

const DropZone = styled.label<{ $active: boolean; $uploading: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 10px 12px;
  padding: 14px;
  border: 1.5px dashed ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  background: ${({ $active, theme }) => $active ? theme.colors.accentGlow : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.textMuted};
  font-size: 12px;
  text-align: center;
  line-height: 1.5;
  animation: ${({ $uploading }) => $uploading ? css`${pulse} 1s ease-in-out infinite` : 'none'};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentGlow};
    color: ${({ theme }) => theme.colors.accent};
  }

  input { display: none; }
`

const DropIcon = styled.span`
  font-size: 20px;
  line-height: 1;
`

// ─── Mini audio player ────────────────────────────────────────────────────────

const Player = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-size: 11px;
  font-family: ${({ theme }) => theme.fonts.mono};
`

const PlayerName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textMuted};
`

const PlayPauseBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #fff;
  flex-shrink: 0;
  &:hover { opacity: 0.85; }
`

const Progress = styled.input`
  flex: 1;
  accent-color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  height: 3px;
`

const TimeLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  min-width: 32px;
  text-align: right;
`

// ─── Drag overlay ─────────────────────────────────────────────────────────────

const DragOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.accentGlow};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  pointer-events: none;
  z-index: 10;
`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countFiles(nodes: MusicNode[]): number {
  return nodes.reduce((acc, n) => acc + (n.type === 'file' ? 1 : countFiles(n.children)), 0)
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

// ─── Tree node ────────────────────────────────────────────────────────────────

function TreeNode({
  node, depth, selected, previewing, onSelect, onPreview, onDelete,
}: {
  node: MusicNode
  depth: number
  selected: string
  previewing: string
  onSelect: (path: string) => void
  onPreview: (path: string) => void
  onDelete: (path: string, isDir: boolean) => void
}) {
  const [open, setOpen] = useState(true)

  if (node.type === 'dir') {
    const count = countFiles(node.children)
    return (
      <>
        <FolderRow $depth={depth} onClick={() => setOpen(o => !o)}>
          <span style={{ fontSize: 10 }}>{open ? '▾' : '▸'}</span>
          <span>📁</span>
          <span style={{ flex: 1, color: 'inherit' }}>{node.name}</span>
          <FolderCount>{count} {count === 1 ? 'pista' : 'pistas'}</FolderCount>
          <ActionBtn
            className="del"
            title="Eliminar carpeta"
            onClick={e => { e.stopPropagation(); onDelete(node.path, true) }}
          >✕</ActionBtn>
        </FolderRow>
        {open && node.children.map(child => (
          <TreeNode
            key={child.path} node={child} depth={depth + 1}
            selected={selected} previewing={previewing}
            onSelect={onSelect} onPreview={onPreview}
            onDelete={onDelete}
          />
        ))}
      </>
    )
  }

  const isSelected = selected === node.path
  const isPreviewing = previewing === node.path

  return (
    <FileRow
      $depth={depth} $selected={isSelected} $previewing={isPreviewing}
      onClick={() => onSelect(isSelected ? '' : node.path)}
    >
      <span style={{ fontSize: 13 }}>♫</span>
      <FileName title={node.name}>{node.name}</FileName>
      {isSelected && <SelectedBadge>✓ seleccionada</SelectedBadge>}
      <div className="actions" style={{ display: 'flex', gap: 2 }}>
        <ActionBtn
          title={isPreviewing ? 'Detener' : 'Vista previa'}
          onClick={e => { e.stopPropagation(); onPreview(isPreviewing ? '' : node.path) }}
        >
          {isPreviewing ? '■' : '▶'}
        </ActionBtn>
        <ActionBtn
          title="Eliminar"
          onClick={e => { e.stopPropagation(); onDelete(node.path, false) }}
        >✕</ActionBtn>
      </div>
    </FileRow>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Props {
  selected: string
  onSelect: (path: string) => void
}

export default function MusicLibrary({ selected, onSelect }: Props) {
  const uploadRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [nodes, setNodes] = useState<MusicNode[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(0)
  const [previewing, setPreviewing] = useState('')
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const refresh = useCallback(async () => {
    setNodes(await api.music.list())
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // Audio preview
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!previewing) { audio.pause(); audio.src = ''; setPlaying(false); return }
    audio.src = api.music.streamUrl(previewing)
    audio.play().then(() => setPlaying(true)).catch(() => {})
  }, [previewing])

  // Upload
  const uploadFiles = useCallback(async (files: File[]) => {
    if (!files.length) return
    setUploading(true)
    try {
      await api.music.upload(files)
      await refresh()
    } finally {
      setUploading(false)
    }
  }, [refresh])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(Array.from(e.target.files ?? []))
    e.target.value = ''
  }, [uploadFiles])

  // Drag & drop
  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); setDragging(d => d + 1) }
  const handleDragLeave = () => setDragging(d => Math.max(0, d - 1))
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(0)
    const files = Array.from(e.dataTransfer.files).filter(
      f => f.type.startsWith('audio/') || /\.(mp3|wav|ogg|aac|m4a|flac)$/i.test(f.name)
    )
    uploadFiles(files)
  }

  // Delete
  const handleDelete = useCallback(async (path: string, isDir: boolean) => {
    const label = isDir ? `la carpeta "${path}" y su contenido` : `"${path}"`
    if (!confirm(`¿Eliminar ${label}?`)) return
    await api.music.delete(path)
    if (selected === path) onSelect('')
    if (previewing === path) setPreviewing('')
    await refresh()
  }, [selected, previewing, onSelect, refresh])

  const totalTracks = countFiles(nodes)

  return (
    <Root
      $dragging={dragging > 0}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onDurationChange={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <Header>
        <HeaderTitle>🎵 Librería de música</HeaderTitle>
        {totalTracks > 0 && <TrackCount>{totalTracks} {totalTracks === 1 ? 'pista' : 'pistas'}</TrackCount>}
        <UploadBtn onClick={() => uploadRef.current?.click()} disabled={uploading}>
          {uploading ? '⏳ Subiendo…' : '↑ Subir pistas'}
        </UploadBtn>
        <input
          ref={uploadRef}
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a,.flac"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
      </Header>

      {nodes.length > 0 && (
        <Tree>
          {nodes.map(node => (
            <TreeNode
              key={node.path} node={node} depth={0}
              selected={selected} previewing={previewing}
              onSelect={onSelect} onPreview={setPreviewing}
              onDelete={handleDelete}
            />
          ))}
        </Tree>
      )}

      <DropZone $active={dragging > 0} $uploading={uploading}>
        <DropIcon>{uploading ? '⏳' : dragging > 0 ? '🎵' : '☁'}</DropIcon>
        <span>
          {uploading ? 'Subiendo…'
          : dragging > 0 ? 'Suelta los archivos aquí'
          : nodes.length === 0 ? 'Arrastra pistas de audio aquí\no haz clic para seleccionar'
          : 'Arrastra más pistas aquí o haz clic'}
        </span>
        <input
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a,.flac"
          multiple
          onChange={handleFileInput}
        />
      </DropZone>

      {previewing && (
        <Player>
          <PlayPauseBtn onClick={() => {
            if (playing) audioRef.current?.pause()
            else audioRef.current?.play()
          }}>
            {playing ? '❚❚' : '▶'}
          </PlayPauseBtn>
          <PlayerName title={previewing}>{previewing.split('/').pop()}</PlayerName>
          <Progress
            type="range" min={0} max={duration || 1} step={0.1} value={currentTime}
            onChange={e => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value) }}
          />
          <TimeLabel>{formatTime(currentTime)}</TimeLabel>
          <ActionBtn onClick={() => setPreviewing('')} title="Cerrar">✕</ActionBtn>
        </Player>
      )}

      {dragging > 0 && (
        <DragOverlay>
          <span style={{ fontSize: 32 }}>🎵</span>
          <span>Suelta para subir</span>
        </DragOverlay>
      )}
    </Root>
  )
}
