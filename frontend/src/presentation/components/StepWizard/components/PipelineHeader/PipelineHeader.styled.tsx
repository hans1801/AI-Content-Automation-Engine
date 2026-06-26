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

  /* Border */
  border: ${({ $selected }) => ($selected ? '3px' : '2px')} solid
    ${({ theme, $status, $selected }) => {
      if ($selected)             return '#fff'
      if ($status === 'done')    return theme.colors.success
      if ($status === 'active')  return 'rgba(255,255,255,0.6)'
      if ($status === 'running') return theme.colors.accent
      return theme.colors.border
    }};

  /* Background — selected gets solid white-tinted fill regardless of status */
  background: ${({ theme, $status, $selected }) => {
    if ($selected) {
      if ($status === 'done')    return 'rgba(16, 185, 129, 0.35)'
      if ($status === 'running') return 'rgba(124, 58, 237, 0.35)'
      return 'rgba(255,255,255,0.15)'
    }
    if ($status === 'done')    return 'rgba(16, 185, 129, 0.12)'
    if ($status === 'active')  return 'rgba(255,255,255,0.06)'
    if ($status === 'running') return 'rgba(124, 58, 237, 0.2)'
    return theme.colors.surface
  }};

  /* Text/icon color */
  color: ${({ theme, $status, $selected }) => {
    if ($selected)             return '#fff'
    if ($status === 'done')    return theme.colors.success
    if ($status === 'active')  return 'rgba(255,255,255,0.7)'
    if ($status === 'running') return theme.colors.accentLight
    return theme.colors.textMuted
  }};

  font-size: 13px;
  font-weight: 700;
  cursor: ${({ $status }) => ($status === 'locked' ? 'not-allowed' : 'pointer')};
  opacity: ${({ $status }) => ($status === 'locked' ? 0.4 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  /* Selected: glow blanco prominente */
  box-shadow: ${({ $selected }) =>
    $selected ? '0 0 0 4px rgba(255,255,255,0.25), 0 0 12px rgba(255,255,255,0.1)' : 'none'};

  &:hover:not(:disabled) {
    box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
  }

  ${({ $status }) => $status === 'running' && runningRing}
`

export const StepLabel = styled.span<{ $selected: boolean; $locked: boolean; $done: boolean }>`
  font-size: 11px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  color: ${({ theme, $selected, $locked, $done }) => {
    if ($selected) return '#fff'
    if ($done)     return theme.colors.success
    if ($locked)   return theme.colors.textMuted
    return theme.colors.text
  }};
  white-space: normal;
  word-break: break-word;
  transition: color 0.2s;
  text-align: center;
  max-width: 80px;
  line-height: 1.3;
`
