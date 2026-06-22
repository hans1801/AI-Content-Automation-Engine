import styled, { keyframes, css, DefaultTheme } from 'styled-components'

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 36px;
  padding: 20px 0 0;
`

export const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

export const Connector = styled.div<{ $filled: boolean }>`
  flex: 1;
  height: 2px;
  margin-top: 21px;
  background: ${({ theme, $filled }) =>
    $filled ? theme.colors.success : theme.colors.border};
  transition: background 0.3s;
  min-width: 12px;
`

const spin = keyframes`to { transform: rotate(360deg) }`

const runningRing = css`
  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.accent};
    animation: ${spin} 0.8s linear infinite;
  }
`

export const Circle = styled.button<{
  $status: 'done' | 'active' | 'locked' | 'running'
  $selected: boolean
}>`
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid
    ${({ theme, $status, $selected }) => {
      if ($selected) return theme.colors.accent
      if ($status === 'done') return theme.colors.success
      if ($status === 'active' || $status === 'running') return theme.colors.accent
      return theme.colors.border
    }};
  background: ${({ theme, $status, $selected }) => {
    if ($status === 'done') return 'rgba(16, 185, 129, 0.15)'
    if ($selected || $status === 'active' || $status === 'running')
      return 'rgba(124, 58, 237, 0.2)'
    return theme.colors.surface
  }};
  color: ${({ theme, $status }) => {
    if ($status === 'done') return theme.colors.success
    if ($status === 'active' || $status === 'running') return theme.colors.accentLight
    return theme.colors.textMuted
  }};
  font-size: 13px;
  font-weight: 700;
  cursor: ${({ $status }) => ($status === 'locked' ? 'not-allowed' : 'pointer')};
  opacity: ${({ $status }) => ($status === 'locked' ? 0.35 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: ${({ theme, $selected }) =>
    $selected ? `0 0 0 3px ${theme.colors.accentGlow}` : 'none'};

  &:hover:not(:disabled) {
    border-color: ${({ theme, $status }) =>
      $status !== 'locked' ? theme.colors.accent : theme.colors.border};
    box-shadow: ${({ theme, $status }) =>
      $status !== 'locked' ? `0 0 0 3px ${theme.colors.accentGlow}` : 'none'};
  }

  ${({ $status }) => $status === 'running' && runningRing}
`

export const StepLabel = styled.span<{ $selected: boolean; $locked: boolean }>`
  font-size: 10px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  color: ${({ theme, $selected, $locked }) =>
    $locked
      ? theme.colors.border
      : $selected
      ? theme.colors.accentLight
      : theme.colors.textMuted};
  white-space: nowrap;
  transition: color 0.2s;
  text-align: center;
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
`
