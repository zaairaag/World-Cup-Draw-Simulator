import { memo, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import styled from 'styled-components';

import type { Group, SwapPayload } from '../../../types';
import { groupLabel } from '../utils/groupLabel';

interface DrawSwapControlsProps {
  groups: Group[];
  canUndoSwap: boolean;
  onUndoLastSwap: () => void;
  onSwapTeams: (payload: SwapPayload) => void;
  onClearError: () => void;
}

export const DrawSwapControls = memo(function DrawSwapControls({
  groups,
  canUndoSwap,
  onUndoLastSwap,
  onSwapTeams,
  onClearError
}: DrawSwapControlsProps) {
  const [sourceGroupId, setSourceGroupId] = useState('');
  const [sourceTeamId, setSourceTeamId] = useState('');
  const [targetGroupId, setTargetGroupId] = useState('');
  const [targetTeamId, setTargetTeamId] = useState('');

  const sourceGroup = useMemo(
    () => groups.find((group) => group.id === sourceGroupId) ?? null,
    [groups, sourceGroupId]
  );
  const targetGroup = useMemo(
    () => groups.find((group) => group.id === targetGroupId) ?? null,
    [groups, targetGroupId]
  );

  useEffect(() => {
    if (sourceGroup === null || sourceGroup.teams.some((team) => team.id === sourceTeamId)) {
      return;
    }

    setSourceTeamId('');
  }, [sourceGroup, sourceTeamId]);

  useEffect(() => {
    if (targetGroup === null || targetGroup.teams.some((team) => team.id === targetTeamId)) {
      return;
    }

    setTargetTeamId('');
  }, [targetGroup, targetTeamId]);

  function handleSourceGroupChange(event: ChangeEvent<HTMLSelectElement>) {
    onClearError();
    setSourceGroupId(event.target.value);
    setSourceTeamId('');
  }

  function handleSourceTeamChange(event: ChangeEvent<HTMLSelectElement>) {
    onClearError();
    setSourceTeamId(event.target.value);
  }

  function handleTargetGroupChange(event: ChangeEvent<HTMLSelectElement>) {
    onClearError();
    setTargetGroupId(event.target.value);
    setTargetTeamId('');
  }

  function handleTargetTeamChange(event: ChangeEvent<HTMLSelectElement>) {
    onClearError();
    setTargetTeamId(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!sourceGroupId || !sourceTeamId || !targetGroupId || !targetTeamId) {
      return;
    }

    onSwapTeams({
      sourceGroupId,
      sourceTeamId,
      targetGroupId,
      targetTeamId
    });
  }

  return (
    <Panel onSubmit={handleSubmit}>
      <PanelHeader>
        <PanelEyebrow>Ajuste pós-sorteio</PanelEyebrow>
        <PanelTitle>Troca manual</PanelTitle>
        <PanelDescription>
          Escolha uma equipe de cada grupo para trocar de posição sem usar arrastar e soltar.
        </PanelDescription>
      </PanelHeader>

      <FieldGrid>
        <Field>
          <FieldLabel htmlFor="swap-source-group">Grupo de origem</FieldLabel>
          <FieldSelect
            id="swap-source-group"
            value={sourceGroupId}
            onChange={handleSourceGroupChange}
          >
            <option value="">Selecione um grupo</option>
            {groups.map((group, index) => (
              <option key={group.id} value={group.id}>
                {groupLabel(index)}
              </option>
            ))}
          </FieldSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="swap-source-team">Equipe de origem</FieldLabel>
          <FieldSelect
            id="swap-source-team"
            value={sourceTeamId}
            onChange={handleSourceTeamChange}
            disabled={sourceGroup === null}
          >
            <option value="">Selecione uma equipe</option>
            {sourceGroup?.teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </FieldSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="swap-target-group">Grupo de destino</FieldLabel>
          <FieldSelect
            id="swap-target-group"
            value={targetGroupId}
            onChange={handleTargetGroupChange}
          >
            <option value="">Selecione um grupo</option>
            {groups.map((group, index) => (
              <option key={group.id} value={group.id}>
                {groupLabel(index)}
              </option>
            ))}
          </FieldSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="swap-target-team">Equipe de destino</FieldLabel>
          <FieldSelect
            id="swap-target-team"
            value={targetTeamId}
            onChange={handleTargetTeamChange}
            disabled={targetGroup === null}
          >
            <option value="">Selecione uma equipe</option>
            {targetGroup?.teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </FieldSelect>
        </Field>
      </FieldGrid>

      <ActionRow>
        {canUndoSwap ? (
          <UndoButton type="button" onClick={onUndoLastSwap}>
            Desfazer última troca
          </UndoButton>
        ) : null}

        <SubmitButton
          type="submit"
          disabled={!sourceGroupId || !sourceTeamId || !targetGroupId || !targetTeamId}
          aria-disabled={!sourceGroupId || !sourceTeamId || !targetGroupId || !targetTeamId}
        >
          Trocar equipes
        </SubmitButton>
      </ActionRow>
    </Panel>
  );
});

const Panel = styled.form`
  margin-top: 64px;
  padding: 48px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: ${({ theme }) => theme.radii.xl};
  display: flex;
  flex-direction: column;
  gap: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 40px;
    padding: 32px 20px;
    gap: 32px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PanelEyebrow = styled.span`
  font-size: 14px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.support};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const PanelTitle = styled.h2`
  font-size: 32px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.04em;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
  }
`;

const PanelDescription = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
  max-width: 600px;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
  }
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FieldSelect = styled.select`
  height: 56px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid rgba(188, 202, 186, 0.4);
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 0 16px;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'%3E%3Cpath d='M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;

  &:hover:not(:disabled) {
    background-color: white;
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  height: 64px;
  background-color: ${({ theme }) => theme.colors.support};
  color: white;
  font-weight: 900;
  font-size: 18px;
  text-transform: uppercase;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 320px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #004699;
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 88, 189, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
`;

const UndoButton = styled.button`
  min-height: 56px;
  padding: 0 24px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.support};
  font-weight: 900;
  font-size: 15px;
  text-transform: uppercase;
  border: 1px solid rgba(0, 88, 189, 0.24);
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: rgba(0, 88, 189, 0.42);
    background-color: rgba(0, 88, 189, 0.05);
  }
`;
