import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    height: 100%;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text1};
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 15px; line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  #root { min-height: 100vh; display: flex; flex-direction: column; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.bg}; }
  ::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.colors.border}; border-radius: 4px; }
  input::placeholder { color: ${({ theme }) => theme.colors.text3}; }
  textarea::placeholder { color: ${({ theme }) => theme.colors.text3}; }
  select option { background: ${({ theme }) => theme.colors.selectBg}; color: ${({ theme }) => theme.colors.text1}; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to   { transform: translateX(0); }
  }
`;
