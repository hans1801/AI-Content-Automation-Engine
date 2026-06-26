import styled from 'styled-components'

export const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 52px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(8, 8, 17, 0.85);
  backdrop-filter: blur(20px);
  flex-shrink: 0;
  z-index: 10;
`

export const ApiKeyBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.text};
  }
`

export const ApiKeyDot = styled.span<{ $ok: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $ok }) => ($ok ? '#10b981' : '#ef4444')};
  box-shadow: ${({ $ok }) => ($ok ? '0 0 6px #10b981' : '0 0 6px #ef4444')};
`

export const HeaderLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const LogoDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentLight};
  box-shadow: 0 0 8px ${({ theme }) => theme.colors.accent};
`

export const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(130deg, #c4b5fd, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const Layout = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

export const Sidebar = styled.aside<{ $open: boolean }>`
  width: ${({ $open }) => ($open ? '290px' : '48px')};
  min-width: ${({ $open }) => ($open ? '290px' : '48px')};
  overflow: hidden;
  transition: width 0.25s ease, min-width 0.25s ease;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`

export const Main = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  min-width: 0;
`

export const EmptyState = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const EmptyIcon = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.colors.borderStrong};
`
