import styled from 'styled-components'

export const UploadLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  margin-top: 4px;
  align-self: flex-start;

  &:hover { color: ${({ theme }) => theme.colors.text}; }
`

export const UploadWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const BackLink = styled(UploadLink)`margin-top: 0;`
