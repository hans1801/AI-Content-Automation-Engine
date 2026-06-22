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
  padding: 0 24px;
  height: 52px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(8, 8, 17, 0.85);
  backdrop-filter: blur(20px);
  flex-shrink: 0;
  z-index: 10;
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

export const Sidebar = styled.aside`
  width: 290px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`

export const Main = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 32px;
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
