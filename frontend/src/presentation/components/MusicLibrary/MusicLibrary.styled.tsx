import styled, { css, keyframes } from 'styled-components'

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`

export const Root = styled.div<{ $dragging: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bg};
  border: 1.5px solid ${({ $dragging, theme }) => $dragging ? theme.colors.accent : theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.15s;
  position: relative;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

export const HeaderTitle = styled.span`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  flex: 1;
`

export const TrackCount = styled.span`
  font-size: 11px;
  padding: 2px 8px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: 99px;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const UploadBtn = styled.button`
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

export const Tree = styled.div`
  overflow-y: auto;
  max-height: 260px;
  padding: 4px 0;
`

export const FolderRow = styled.div<{ $depth: number }>`
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

export const FileRow = styled.div<{ $depth: number; $selected: boolean; $previewing: boolean }>`
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

export const FileName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const SelectedBadge = styled.span`
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 99px;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  flex-shrink: 0;
`

export const ActionBtn = styled.button`
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

export const FolderCount = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.6;
`

export const DropZone = styled.label<{ $active: boolean; $uploading: boolean }>`
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

export const DropIcon = styled.span`
  font-size: 20px;
  line-height: 1;
`

export const Player = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-size: 11px;
  font-family: ${({ theme }) => theme.fonts.mono};
`

export const PlayerName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const PlayPauseBtn = styled.button`
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

export const Progress = styled.input`
  flex: 1;
  accent-color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  height: 3px;
`

export const TimeLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  min-width: 32px;
  text-align: right;
`

export const DragOverlay = styled.div`
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
