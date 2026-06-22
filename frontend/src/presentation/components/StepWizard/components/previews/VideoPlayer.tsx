import styled from 'styled-components'

const Wrap = styled.div`margin-top: 16px;`

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`

const PlayerWrap = styled.div`
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
`

const Vid = styled.video`
  display: block;
  max-height: 520px;
  width: auto;
  max-width: 100%;
  border-radius: 8px;
  background: #000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`

export default function VideoPlayer({ src, label }: { src: string; label: string }) {
  return (
    <Wrap>
      <SectionLabel>{label}</SectionLabel>
      <PlayerWrap>
        <Vid src={src} controls preload="metadata" />
      </PlayerWrap>
    </Wrap>
  )
}
