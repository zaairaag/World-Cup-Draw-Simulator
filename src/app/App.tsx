import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import { AppProviders } from './AppProviders';
import { AppRoutes } from './routes';
import { GlobalNavBar, MainHeader, MainFooter } from '../components/layout/StitchLayout';

export function App() {
  const [searchRequestToken, setSearchRequestToken] = useState(0);

  function handleSearchRequest() {
    setSearchRequestToken((currentToken) => currentToken + 1);
  }

  return (
    <AppProviders>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SkipLink href="#main-content">Ir para o conteúdo principal</SkipLink>
        <GlobalNavBar />
        <MainHeader onSearchRequest={handleSearchRequest} />
        <MainContent id="main-content">
          <AppRoutes searchRequestToken={searchRequestToken} />
        </MainContent>
        <MainFooter />
      </BrowserRouter>
    </AppProviders>
  );
}

const SkipLink = styled.a`
  position: absolute;
  top: -100%;
  left: 16px;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.surface};
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 800;
  border-radius: 0 0 8px 8px;
  z-index: 200;
  text-decoration: underline;

  &:focus {
    top: 0;
  }
`;

const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px 120px;
  min-height: 60vh;
`;
