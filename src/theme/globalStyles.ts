import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    color-scheme: light;
  }

  body {
    margin: 0;
    min-width: 320px;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.typography.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body, button, input, select, textarea {
    font: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.heading};
    color: ${({ theme }) => theme.colors.text};
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  p {
    line-height: 1.65;
    font-weight: 400;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  code {
    font-family: ${({ theme }) => theme.typography.mono};
  }

  .material-symbols-rounded {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 3px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;
