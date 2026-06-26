import styled from 'styled-components'

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const VolumeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`

export const VolumeLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  min-width: 56px;
`

export const VolumeSlider = styled.input`
  flex: 1;
  accent-color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
`

export const VolumePct = styled.span`
  font-size: 13px;
  font-weight: 600;
  min-width: 38px;
  text-align: right;
  color: ${({ theme }) => theme.colors.text};
`

export const MusicHint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`
