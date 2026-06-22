import styled from 'styled-components'

export const Card = styled.div<{ $done: boolean; $locked: boolean }>`
  display: flex;
  gap: 18px;
  padding: 20px;
  background: ${({ theme, $done }) => ($done ? theme.colors.successBg : theme.colors.surface)};
  border: 1px solid ${({ theme, $done }) => ($done ? theme.colors.successBorder : theme.colors.border)};
  border-radius: 14px;
  margin-bottom: 10px;
  position: relative;
  transition: border-color 0.2s, background 0.2s;
  backdrop-filter: blur(8px);
  opacity: ${({ $locked }) => ($locked ? 0.35 : 1)};
  pointer-events: ${({ $locked }) => ($locked ? 'none' : 'auto')};
`

export const StepNumber = styled.div<{ $done: boolean }>`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme, $done }) => ($done ? 'rgba(16, 185, 129, 0.3)' : theme.colors.borderStrong)};
  line-height: 1;
  min-width: 44px;
  font-variant-numeric: tabular-nums;
`

export const StepContent = styled.div`
  flex: 1;
  min-width: 0;
`

export const StepTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
`

export const StepCheck = styled.div`
  color: ${({ theme }) => theme.colors.success};
  font-size: 18px;
  font-weight: 700;
  align-self: flex-start;
  flex-shrink: 0;
`

export const RegenerateBtn = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  flex-shrink: 0;
  align-self: flex-start;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accentLight};
  }
`
