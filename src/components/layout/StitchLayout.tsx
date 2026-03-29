import styled from 'styled-components';

import { useThemeMode } from '../../theme/themeModeContext';

import { ECOSYSTEM_NAV_HEIGHT, DESKTOP_HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from './stickyHeights';

interface MainHeaderProps {
  onSearchRequest?: () => void;
}

export function GlobalNavBar() {
  return (
    <EcosystemNav aria-label="Sites Globo">
      <NavContainer>
        <EcosystemLink color="#1e4b9b" href="https://globo.com">
          globo.com
        </EcosystemLink>
        <EcosystemLink color="#c4170c" href="https://g1.globo.com">
          g1
        </EcosystemLink>
        <EcosystemLink color="#07aa47" href="https://ge.globo.com">
          ge
        </EcosystemLink>
        <EcosystemLink color="#ec7d00" href="https://gshow.globo.com">
          gshow
        </EcosystemLink>
        <EcosystemLink color="#fb0735" href="https://globoplay.globo.com">
          globoplay
        </EcosystemLink>
        <EcosystemLink color="#e3662b" href="https://cartola.globo.com">
          cartola
        </EcosystemLink>
        <EcosystemLink color="#323333" href="https://sportv.globo.com">
          sportv
        </EcosystemLink>
      </NavContainer>
    </EcosystemNav>
  );
}

export function MainHeader({ onSearchRequest }: MainHeaderProps) {
  const { mode, toggleMode } = useThemeMode();
  const toggleLabel = mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro';

  return (
    <Header>
      <HeaderContainer>
        <HeaderLeft>
          <HeaderButton aria-label="Menu" type="button">
            <span className="material-symbols-rounded" aria-hidden="true">
              menu
            </span>
            <Label aria-hidden="true">MENU</Label>
          </HeaderButton>
          <HeaderButton aria-label="Times" type="button">
            <span className="material-symbols-rounded" aria-hidden="true">
              shield
            </span>
            <Label aria-hidden="true">TIMES</Label>
          </HeaderButton>
        </HeaderLeft>

        <Logo aria-label="ge - Portal de esportes">ge</Logo>

        <HeaderRight>
          <SearchButton aria-label="Buscar" type="button" onClick={onSearchRequest}>
            <span aria-hidden="true" className="material-symbols-rounded">
              search
            </span>
            <Label aria-hidden="true">BUSCAR</Label>
          </SearchButton>
          <ThemeToggleButton
            aria-label={toggleLabel}
            aria-pressed={mode === 'dark'}
            title={toggleLabel}
            type="button"
            onClick={toggleMode}
          >
            <span aria-hidden="true" className="material-symbols-rounded">
              {mode === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </ThemeToggleButton>
          <UserBadge>
            <Avatar>Z</Avatar>
            <UserName>Olá, Zaíra</UserName>
          </UserBadge>
        </HeaderRight>
      </HeaderContainer>
    </Header>
  );
}

export function MainFooter() {
  return (
    <Footer>
      <FooterContainer>
        <FooterTop>
          <FooterBrand>
            <FooterLogo>ge</FooterLogo>
            <Divider />
            <FooterNav aria-label="Navegação do rodapé">
              <FooterNavLink href="#">agenda</FooterNavLink>
              <FooterNavLink href="#">tabelas</FooterNavLink>
              <FooterNavLink href="#">campeonatos</FooterNavLink>
              <FooterNavLink href="#">seleções</FooterNavLink>
            </FooterNav>
          </FooterBrand>

          <FooterLegal>
            <FooterLegalLink href="#">princípios editoriais</FooterLegalLink>
            <FooterLegalLink href="#">política de privacidade</FooterLegalLink>
            <FooterLegalLink href="#">minha conta</FooterLegalLink>
            <FooterLegalLink href="#">anuncie conosco</FooterLegalLink>
          </FooterLegal>
        </FooterTop>

        <FooterBottom>
          <Copyright>© Copyright 2000-2026 Globo Comunicação e Participações S.A.</Copyright>
        </FooterBottom>
      </FooterContainer>
    </Footer>
  );
}

const Container = styled.div`
  max-width: 1250px;
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavContainer = styled(Container)`
  gap: 20px;
`;

const EcosystemNav = styled.nav`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  height: ${ECOSYSTEM_NAV_HEIGHT}px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  transition:
    background-color ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.easing},
    border-color ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.easing};

  & > div {
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    flex-wrap: nowrap;
    white-space: nowrap;
  }
`;

const EcosystemLink = styled.a<{ color: string }>`
  color: ${({ color }) => color};
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.02em;
  text-decoration: none;
  transition: filter ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};
  padding: 4px 0;
  flex-shrink: 0;

  &:hover {
    filter: brightness(1.15);
    text-decoration: none;
  }
`;

const Header = styled.header`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent} 0%,
    ${({ theme }) => theme.colors.accentStrong} 100%
  );
  height: ${DESKTOP_HEADER_HEIGHT}px;
  display: flex;
  align-items: center;
  position: sticky;
  top: ${ECOSYSTEM_NAV_HEIGHT}px;
  z-index: 40;
  color: ${({ theme }) => theme.colors.headerText};
  box-shadow: ${({ theme }) => theme.shadows.soft};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: ${MOBILE_HEADER_HEIGHT}px;
    top: ${ECOSYSTEM_NAV_HEIGHT}px;
  }
`;

const HeaderContainer = styled(Container)`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 0 8px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  justify-self: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 0;
  }
`;

const HeaderButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  transition:
    background-color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
    transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    transform: translateY(-1px);
  }

  .material-symbols-rounded {
    font-size: 22px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 0 8px;

    & > span:last-child {
      display: none;
    }
  }
`;

const Label = styled.span`
  font-weight: 800;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.02em;

  @media (max-width: 992px) {
    display: none;
  }
`;

const Logo = styled.span`
  justify-self: center;
  align-self: center;
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 56px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: -0.08em;
  line-height: 0.75;
  display: flex;
  align-items: center;
  user-select: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 42px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-self: end;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 8px;
  }
`;

const HeaderAction = styled.button`
  background: rgba(255, 255, 255, 0.15);
  height: 38px;
  padding: 0 16px;
  border: none;
  border-radius: 999px;
  color: inherit;
  font: inherit;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
    transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

  .material-symbols-rounded {
    font-size: 20px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.24);
    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    min-width: 0;
    width: 38px;
    padding: 0;
    justify-content: center;
    background: rgba(255, 255, 255, 0.12);
  }
`;

const SearchButton = styled(HeaderAction)`
  min-width: 140px;
`;

const ThemeToggleButton = styled(HeaderAction)`
  width: 38px;
  min-width: 38px;
  padding: 0;
  justify-content: center;

  @media (max-width: 600px) {
    min-width: 0;
  }
`;

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(5, 113, 45, 0.42);
  padding: 3px 14px 3px 3px;
  border-radius: 20px;
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
    background-color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

  &:hover {
    transform: translateY(-1px);
    background: rgba(5, 113, 45, 0.58);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 3px 8px 3px 3px;
    gap: 4px;
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  background: ${({ theme }) => theme.colors.support};
  color: ${({ theme }) => theme.colors.headerText};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
`;

const UserName = styled.span`
  font-size: 13px;
  font-weight: 700;

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 11px;
    max-width: 56px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const Footer = styled.footer`
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.accentStrong} 0%,
    ${({ theme }) => theme.colors.accentDark} 100%
  );
  color: ${({ theme }) => theme.colors.headerText};
  padding: 40px 0 32px;
  margin-top: 64px;
`;

const FooterContainer = styled(Container)`
  flex-direction: column;
  gap: 24px;
`;

const FooterTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const FooterLogo = styled.span`
  font-size: 40px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: -0.06em;
  line-height: 1;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.25);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const FooterNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const FooterNavLink = styled.a`
  font-size: 14px;
  font-weight: 700;
  transition:
    opacity ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
    transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

  &:hover {
    opacity: 1;
    transform: translateY(-1px);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const FooterLegal = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  font-size: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 4px;
  }
`;

const FooterLegalLink = styled.a`
  opacity: 0.8;
  transition: opacity ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

  &:hover {
    opacity: 1;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const FooterBottom = styled.div`
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: left;
  }
`;

const Copyright = styled.span`
  font-size: 11px;
  opacity: 0.65;
`;
