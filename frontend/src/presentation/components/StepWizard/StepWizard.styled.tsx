import styled from 'styled-components'

export const Wizard = styled.div`
  max-width: 680px;
`

export const WizardHeader = styled.div`
  margin-bottom: 28px;
`

export const WizardTitle = styled.h2`
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.3;
`

export const WizardCategory = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.accentLight};
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
  padding: 3px 10px;
  border-radius: 999px;
`

export const BtnPrimary = styled.button`
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

export const StepHint = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`

export const DoneText = styled.p<{ $completed?: boolean }>`
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ $completed }) => ($completed ? '16px' : '13px')};
  font-weight: ${({ $completed }) => ($completed ? 700 : 500)};
`

export const BtnSecondary = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`
