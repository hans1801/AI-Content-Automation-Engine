import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const IdeaListRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`

export const IdeaCount = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 500;
`

export const NewBtn = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
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

export const Spinner = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`

export const GenTerminal = styled.div`
  background: rgba(0, 0, 0, 0.6);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 10px 14px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  max-height: 140px;
  overflow-y: auto;
  flex-shrink: 0;
`

export const LogLine = styled.div`
  color: ${({ theme }) => theme.colors.logText};
  margin-bottom: 2px;
`

export const LogCursor = styled.div`
  color: ${({ theme }) => theme.colors.logText};
`

export const IdeaItems = styled.div`
  padding: 8px;
  overflow-y: auto;
  flex: 1;
`

export const NoIdeas = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 32px 16px;
  font-size: 13px;
`

export const IdeaItem = styled.div<{ $active: boolean }>`
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(124, 58, 237, 0.4)' : 'transparent')};
  background: ${({ theme, $active }) => ($active ? theme.colors.surface : 'transparent')};
  box-shadow: ${({ $active }) => ($active ? 'inset 0 0 0 1px rgba(124, 58, 237, 0.2)' : 'none')};
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`

export const IdeaTitle = styled.div`
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const IdeaMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
`

export const IdeaCategory = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const StateBadge = styled.span<{ $color: string }>`
  font-size: 9px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  letter-spacing: 0.04em;
  white-space: nowrap;
  flex-shrink: 0;
  background: ${({ $color }) => $color + '22'};
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $color }) => $color + '44'};
`
