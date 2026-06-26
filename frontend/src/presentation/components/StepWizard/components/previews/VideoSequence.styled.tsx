import styled, { keyframes } from 'styled-components'

const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.5}`

export const Wrap = styled.div`margin-top: 16px;`

export const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
`

export const Layout = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`

export const Filmstrip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 54px);
  gap: 6px;
  overflow-y: auto;
  max-height: calc(100vh - 280px);
  flex-shrink: 0;
  padding-right: 4px;
  scrollbar-width: thin;
  align-content: start;

  @media (max-width: 900px) { grid-template-columns: repeat(3, 54px); }
  @media (max-width: 700px) { grid-template-columns: repeat(2, 54px); }
  @media (max-width: 500px) {
    grid-template-columns: repeat(auto-fill, minmax(54px, 1fr));
    max-height: 130px;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }
`

export const ThumbWrap = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;
`

export const ThumbVideo = styled.video<{ $active: boolean }>`
  width: 54px;
  height: 96px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid ${({ theme, $active }) => $active ? theme.colors.accent : theme.colors.border};
  background: #000;
  pointer-events: none;
  display: block;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
  box-shadow: ${({ $active }) => $active ? '0 0 10px rgba(124,58,237,0.45)' : 'none'};

  ${ThumbWrap}:hover & {
    border-color: ${({ theme, $active }) => $active ? theme.colors.accent : theme.colors.borderStrong};
    transform: scale(1.04);
  }
`

export const ThumbNum = styled.span<{ $active: boolean }>`
  font-size: 9px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ theme, $active }) => $active ? theme.colors.accentLight : theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`

export const ActiveDot = styled.span<{ $visible: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  animation: ${pulse} 1.5s ease infinite;
`

export const PlayerPane = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

export const PlayerWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  background: rgba(0,0,0,0.3);
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
`

export const MainVideo = styled.video`
  height: clamp(220px, 45vh, 480px);
  width: auto;
  max-width: 100%;
  border-radius: 8px;
  background: #000;
  display: block;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
`

const NavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.55);
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  color: ${({ theme }) => theme.colors.text};
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background 0.15s;
  z-index: 2;

  &:hover:not(:disabled) { background: rgba(124,58,237,0.5); }
  &:disabled { opacity: 0.2; cursor: not-allowed; }
`

export const PrevBtn = styled(NavBtn)`left: 8px;`
export const NextBtn = styled(NavBtn)`right: 8px;`

export const PlayerFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const SceneNum = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentLight};
  font-variant-numeric: tabular-nums;
`

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  background: rgba(255,255,255,0.02);
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  margin-top: 16px;
`
