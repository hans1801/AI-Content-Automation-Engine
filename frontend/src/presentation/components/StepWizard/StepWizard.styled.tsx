import styled from 'styled-components'

export const Wizard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const StepDetail = styled.div`
  flex: 1;
`

export const StepDetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
`

export const StepDetailNum = styled.span`
  font-size: 48px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1;
  font-variant-numeric: tabular-nums;
`

export const StepDetailTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
`

export const StepDetailStatus = styled.span<{ $done?: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme, $done }) => ($done ? theme.colors.success : theme.colors.accentLight)};
  background: ${({ $done }) =>
    $done ? 'rgba(16,185,129,0.1)' : 'rgba(124,58,237,0.1)'};
  border: 1px solid
    ${({ theme, $done }) =>
      $done ? theme.colors.successBorder : 'rgba(124,58,237,0.3)'};
  padding: 3px 10px;
  border-radius: 999px;
  align-self: center;
`

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
`

export const BtnPrimary = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;

  &:hover:not(:disabled) {
    background: #6d28d9;
    box-shadow: 0 0 24px rgba(124, 58, 237, 0.4);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const BtnSecondary = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const DoneText = styled.p<{ $completed?: boolean }>`
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ $completed }) => ($completed ? '16px' : '13px')};
  font-weight: ${({ $completed }) => ($completed ? 700 : 500)};
`

export const ModeTabs = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
`

export const ModeTab = styled.button<{ $active: boolean }>`
  background: ${({ theme, $active }) => ($active ? theme.colors.accent : 'transparent')};
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.colors.textMuted)};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.border)};
  padding: 5px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

export const JsonUploadZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1.5px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: 10px;
  padding: 24px 16px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 400px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: rgba(124, 58, 237, 0.05);
    color: ${({ theme }) => theme.colors.accentLight};
  }

  input {
    display: none;
  }
`

export const WizardHeader = styled.div`margin-bottom: 24px;`
export const WizardTitle = styled.h1`font-size: 24px; font-weight: 800; margin-bottom: 6px;`
export const WizardCategory = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.accentLight};
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
  padding: 3px 10px;
  border-radius: 999px;
`
