import styled from 'styled-components'

export const UploaderRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const DropZone = styled.div<{ $dragging: boolean; $hasFiles: boolean }>`
  border: 2px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: 10px;
  min-height: 110px;
  display: flex;
  align-items: ${({ $hasFiles }) => ($hasFiles ? 'flex-start' : 'center')};
  justify-content: center;
  cursor: ${({ $hasFiles }) => ($hasFiles ? 'default' : 'pointer')};
  transition: border-color 0.2s, background 0.2s;
  padding: 16px;

  ${({ theme, $dragging }) =>
    $dragging &&
    `
    border-color: ${theme.colors.accent};
    background: ${theme.colors.accentGlow};
  `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentGlow};
  }
`

export const DropHint = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const DropIcon = styled.div`
  font-size: 28px;
  margin-bottom: 8px;
`

export const DropLabel = styled.p`
  font-size: 13px;
  margin-bottom: 4px;
`

export const DropSmall = styled.small`
  font-size: 11px;
`

export const FileList = styled.div`
  width: 100%;
`

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 12px;

  &:last-of-type {
    border-bottom: none;
  }
`

export const SceneNum = styled.span`
  color: ${({ theme }) => theme.colors.accentLight};
  font-weight: 600;
  min-width: 64px;
  font-size: 11px;
`

export const FileName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text};
`

export const FileSize = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
  flex-shrink: 0;
`

export const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0 2px;
  flex-shrink: 0;
  transition: color 0.15s;

  &:hover {
    color: #ef4444;
  }
`

export const AddMoreBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accentLight};
  font-size: 12px;
  cursor: pointer;
  padding: 8px 0 0;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.7;
  }
`

export const UploadBtn = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #6d28d9;
    box-shadow: 0 0 24px rgba(124, 58, 237, 0.4);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`
