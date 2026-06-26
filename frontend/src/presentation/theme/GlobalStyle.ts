import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 14px;
    line-height: 1.5;
    background-image:
      radial-gradient(ellipse 60% 80% at 15% 60%, rgba(124, 58, 237, 0.07) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 85% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 60%);
    background-attachment: fixed;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes blink {
    50% { opacity: 0; }
  }
`
