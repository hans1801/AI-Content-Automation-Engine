import styled from 'styled-components'

export const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 20px;
  margin-bottom: 10px;
`

export const ColLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const SceneList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: calc(100vh - 280px);
  overflow-y: auto;
  scrollbar-width: thin;
`

export const SceneRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 20px;
  align-items: center;
  min-height: 44px;
`

export const NarrationCell = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: rgba(255,255,255,0.02);
  height: 100%;
  box-sizing: border-box;
`

export const SceneNum = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentLight};
  flex-shrink: 0;
  min-width: 22px;
`

export const NarrationText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.9;
`

export const AudioCell = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

export const AudioEl = styled.audio`
  width: 100%;
  height: 32px;
  accent-color: ${({ theme }) => theme.colors.accent};
`

export const PendingBar = styled.div`
  width: 100%;
  height: 32px;
  border-radius: 6px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
  opacity: 0.5;
  user-select: none;
`
