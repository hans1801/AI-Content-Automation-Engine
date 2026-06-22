import styled, { keyframes } from 'styled-components'

const blink = keyframes`
  50% { opacity: 0; }
`

export const TerminalBox = styled.div`
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 12px 14px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  max-height: 220px;
  overflow-y: auto;
  margin-top: 10px;
`

export const LogLine = styled.div`
  color: ${({ theme }) => theme.colors.logText};
  margin-bottom: 2px;
  word-break: break-all;
  white-space: pre-wrap;
`

export const LogCursor = styled.div`
  color: ${({ theme }) => theme.colors.logText};
  animation: ${blink} 1s step-end infinite;
`
