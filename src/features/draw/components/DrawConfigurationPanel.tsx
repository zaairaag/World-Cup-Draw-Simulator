import type { ChangeEvent } from 'react';
import styled from 'styled-components';

import type { DrawSettings, DrawStatus } from '../../../types';
import {
  applyDrawPreset,
  DRAW_PRESETS,
  matchesDrawPreset,
  type DrawPresetId
} from '../configuration/drawPresets';

function formatDrawStatus(status: DrawStatus) {
  switch (status) {
    case 'loading':
      return 'Sorteando';
    case 'drawn':
      return 'Concluído';
    default:
      return 'Configurado';
  }
}

interface DrawConfigurationPanelProps {
  settings: DrawSettings;
  selectedTeamCount: number;
  requiredTeamCount: number;
  status: DrawStatus;
  validationMessage: string | null;
  isConfigurationEnabled: boolean;
  onSettingsChange: (patch: Partial<DrawSettings>) => void;
}

export function DrawConfigurationPanel({
  settings,
  selectedTeamCount,
  requiredTeamCount,
  status,
  validationMessage,
  isConfigurationEnabled,
  onSettingsChange
}: DrawConfigurationPanelProps) {
  function handlePresetClick(presetId: DrawPresetId) {
    const nextSettings = applyDrawPreset(presetId, settings);

    onSettingsChange(nextSettings);
  }

  function handleNumberOfGroupsChange(event: ChangeEvent<HTMLInputElement>) {
    onSettingsChange({
      numberOfGroups: Number(event.target.value)
    });
  }

  function handleTeamsPerGroupChange(event: ChangeEvent<HTMLInputElement>) {
    onSettingsChange({
      teamsPerGroup: Number(event.target.value)
    });
  }

  function handleConfederationPolicyChange(event: ChangeEvent<HTMLSelectElement>) {
    onSettingsChange({
      confederationPolicy: event.target.value as DrawSettings['confederationPolicy']
    });
  }

  return (
    <Panel>
      <PresetRail aria-label="Presets rápidos de configuração">
        {DRAW_PRESETS.map((preset) => (
          <PresetButton
            key={preset.id}
            type="button"
            disabled={!isConfigurationEnabled}
            $active={matchesDrawPreset(preset.id, settings)}
            onClick={() => handlePresetClick(preset.id)}
          >
            {preset.label}
          </PresetButton>
        ))}
      </PresetRail>

      <FieldGrid>
        <Field>
          <FieldLabel htmlFor="draw-number-of-groups">Quantidade de grupos</FieldLabel>
          <FieldInput
            id="draw-number-of-groups"
            type="number"
            min={2}
            inputMode="numeric"
            value={settings.numberOfGroups}
            disabled={!isConfigurationEnabled}
            onChange={handleNumberOfGroupsChange}
            aria-invalid={validationMessage !== null}
            aria-describedby={validationMessage ? 'draw-validation-message' : undefined}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="draw-teams-per-group">Equipes por grupo</FieldLabel>
          <FieldInput
            id="draw-teams-per-group"
            type="number"
            min={2}
            inputMode="numeric"
            value={settings.teamsPerGroup}
            disabled={!isConfigurationEnabled}
            onChange={handleTeamsPerGroupChange}
            aria-invalid={validationMessage !== null}
            aria-describedby={validationMessage ? 'draw-validation-message' : undefined}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="draw-confederation-policy">Regra de confederação</FieldLabel>
          <FieldSelect
            id="draw-confederation-policy"
            value={settings.confederationPolicy}
            disabled={!isConfigurationEnabled}
            onChange={handleConfederationPolicyChange}
          >
            <option value="none">Sem restrição</option>
            <option value="fifa-like">Regra FIFA-like</option>
          </FieldSelect>
        </Field>
      </FieldGrid>

      <SelectionSummary>
        <strong>{selectedTeamCount}</strong> selecionadas / <strong>{requiredTeamCount}</strong>{' '}
        necessárias
      </SelectionSummary>

      <ChallengeNote>Base atual: conjunto exemplo de 32 seleções do desafio.</ChallengeNote>

      <StatusPill $status={status}>
        {status === 'loading' ? 'Sorteando grupos' : `Status: ${formatDrawStatus(status)}`}
      </StatusPill>

      {validationMessage ? (
        <ValidationMessage id="draw-validation-message" role="alert">
          {validationMessage}
        </ValidationMessage>
      ) : null}
    </Panel>
  );
}

const Panel = styled.div`
  display: grid;
  gap: 16px;
`;

const PresetRail = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const PresetButton = styled.button<{ $active: boolean }>`
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.line)};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $active, theme }) => ($active ? theme.colors.accentSoft : theme.colors.surface)};
  color: ${({ $active, theme }) => ($active ? theme.colors.accentStrong : theme.colors.text)};
  font: inherit;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const FieldGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`;

const Field = styled.div`
  display: grid;
  gap: 8px;
`;

const FieldLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const FieldInput = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  padding: 14px 16px;
  font: inherit;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background: ${({ theme }) => theme.colors.surfaceMuted};
  }
`;

const FieldSelect = styled.select`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  padding: 14px 16px;
  font: inherit;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background: ${({ theme }) => theme.colors.surfaceMuted};
  }
`;

const SelectionSummary = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const ChallengeNote = styled.p`
  margin: -4px 0 0;
  color: ${({ theme }) => theme.colors.support};
  font-size: 0.85rem;
  font-weight: 600;
`;

const StatusPill = styled.p<{ $status: DrawStatus }>`
  margin: 0;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: ${({ theme, $status }) =>
    $status === 'drawn'
      ? theme.colors.accentSoft
      : $status === 'loading'
        ? 'rgba(244, 197, 66, 0.14)'
        : theme.colors.surfaceMuted};
  color: ${({ theme, $status }) =>
    $status === 'drawn' ? theme.colors.accentStrong : theme.colors.text};
  font-size: 0.88rem;
  font-weight: 700;
  text-transform: capitalize;
`;

const ValidationMessage = styled.p`
  margin: 0;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(255, 143, 58, 0.12);
  border: 1px solid rgba(255, 143, 58, 0.32);
  color: ${({ theme }) => theme.colors.text};
`;
