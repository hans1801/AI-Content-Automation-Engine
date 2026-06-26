import styled from 'styled-components'

export const Wrap = styled.div`margin-top: 16px;`

export const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`

export const List = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  max-height: calc(100vh - 280px);
  overflow-y: auto;
  scrollbar-width: thin;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Num = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentLight};
  min-width: 28px;
  font-variant-numeric: tabular-nums;
`

export const AudioEl = styled.audio`
  flex: 1;
  height: 28px;
  accent-color: ${({ theme }) => theme.colors.accent};
`
