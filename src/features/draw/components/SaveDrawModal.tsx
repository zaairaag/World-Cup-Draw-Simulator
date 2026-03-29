import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

interface SaveDrawModalProps {
  open: boolean;
  initialValue: string;
  onConfirm: (label: string) => void;
  onCancel: () => void;
}

export function SaveDrawModal({ open, initialValue, onConfirm, onCancel }: SaveDrawModalProps) {
  const titleId = useId();
  const descId = useId();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState(initialValue);

  useEffect(() => {
    if (!open) {
      return;
    }

    setLabel(initialValue);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    queueMicrotask(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [initialValue, onCancel, open]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onConfirm(label);
  }

  return createPortal(
    <Backdrop
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <Panel
        as="form"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <AccentBar />
        <Title id={titleId}>Salvar resultado</Title>
        <Message id={descId}>
          Dê um nome para encontrar este sorteio com facilidade no histórico local.
        </Message>
        <Field>
          <FieldLabel htmlFor={inputId}>Nome do sorteio</FieldLabel>
          <FieldInput
            ref={inputRef}
            id={inputId}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
        </Field>
        <Actions>
          <SecondaryButton type="button" onClick={onCancel}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton type="submit">Confirmar salvamento</PrimaryButton>
        </Actions>
      </Panel>
    </Backdrop>,
    document.body
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(4px);
`;

const Panel = styled.div`
  width: min(100%, 440px);
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.panel};
  padding: ${({ theme }) => theme.spacing.lg};
  outline: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const AccentBar = styled.div`
  height: 4px;
  margin: calc(-1 * ${({ theme }) => theme.spacing.lg})
    calc(-1 * ${({ theme }) => theme.spacing.lg}) ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md} 0 0;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.accentStrong},
    ${({ theme }) => theme.colors.accent}
  );
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Message = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FieldInput = styled.input`
  height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  font-family: inherit;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SecondaryButton = styled.button`
  height: 40px;
  min-width: 112px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accentDark};
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;

const PrimaryButton = styled.button`
  height: 40px;
  min-width: 112px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.headerText};
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentStrong};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;
