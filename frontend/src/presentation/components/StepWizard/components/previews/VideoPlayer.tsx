import { Wrap, SectionLabel, PlayerWrap, Vid } from './VideoPlayer.styled'

interface Props { src: string; label: string }

export default function VideoPlayer({ src, label }: Props) {
  return (
    <Wrap>
      <SectionLabel>{label}</SectionLabel>
      <PlayerWrap>
        <Vid src={src} controls preload="metadata" />
      </PlayerWrap>
    </Wrap>
  )
}
