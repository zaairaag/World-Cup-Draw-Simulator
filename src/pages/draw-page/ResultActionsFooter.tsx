import styled from 'styled-components';

interface ResultActionsFooterProps {
  onShare: () => void;
  onRestart: () => void;
  onSave: () => void;
}

export function ResultActionsFooter({ onShare, onRestart, onSave }: ResultActionsFooterProps) {
  return (
    <StickyFooter>
      <FooterInner>
        <FooterSecondary onClick={onShare} aria-label="Compartilhar resultado do sorteio">
          <span className="material-symbols-rounded" aria-hidden="true">
            share
          </span>
          Compartilhar
        </FooterSecondary>
        <FooterActionGroup>
          <FooterSecondary onClick={onRestart} aria-label="Re-sortear grupos">
            <span className="material-symbols-rounded" aria-hidden="true">
              refresh
            </span>
            Re-sortear
          </FooterSecondary>
          <FooterPrimary onClick={onSave} aria-label="Salvar resultado do sorteio">
            Salvar Resultado
            <span className="material-symbols-rounded" aria-hidden="true">
              check_circle
            </span>
          </FooterPrimary>
        </FooterActionGroup>
      </FooterInner>
    </StickyFooter>
  );
}

const StickyFooter = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 24px;
  background-color: ${({ theme }) => theme.colors.surfaceGlass};
  backdrop-filter: blur(12px);
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  z-index: 1000;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 12px 16px;
  }
`;

const FooterInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const FooterActionGroup = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    flex-direction: column;
    gap: 8px;
  }
`;

const footerBtnBase = styled.button`
  height: 56px;
  padding: 0 32px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
    background-color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
    border-color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
    color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 48px;
    padding: 0 16px;
    font-size: 12px;
    flex: 1;
  }
`;

const FooterPrimary = styled(footerBtnBase)`
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.headerText};
  border: none;
`;

const FooterSecondary = styled(footerBtnBase)`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.line};
`;
