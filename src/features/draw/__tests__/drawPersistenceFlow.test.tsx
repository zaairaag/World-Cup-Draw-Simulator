import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '../../../app/App';
import { STORAGE_KEYS } from '../../../constants';
import type { ConfederationPolicy, DrawState, Team } from '../../../types';
import { localTeamRepository } from '../../teams/repositories/localTeamRepository';

function getCatalog() {
  const result = localTeamRepository.loadCatalog();

  if (!result.ok) {
    throw new Error('Expected a valid local team catalog.');
  }

  return result.data;
}

function getTeam(teamId: string): Team {
  const team = getCatalog().find((item) => item.id === teamId);

  if (!team) {
    throw new Error(`Expected team ${teamId}.`);
  }

  return team;
}

function createPersistedDrawState(
  confederationPolicy: ConfederationPolicy = 'fifa-like'
): DrawState {
  const settings = {
    numberOfGroups: 2,
    teamsPerGroup: 2,
    confederationPolicy
  };

  return {
    settings,
    result: {
      groups: [
        {
          id: 'group-a',
          teams: [getTeam('ECU'), getTeam('SEN')]
        },
        {
          id: 'group-b',
          teams: [getTeam('NED'), getTeam('CAN')]
        }
      ],
      settings: {
        ...settings
      },
      seed: 12345,
      timestamp: 1
    },
    status: 'drawn',
    lastError: null,
    undoResult: null
  };
}

function seedPersistedResult() {
  window.localStorage.setItem(
    STORAGE_KEYS.selectedTeams,
    JSON.stringify(['CAN', 'ECU', 'SEN', 'NED'])
  );
  window.localStorage.setItem(STORAGE_KEYS.drawState, JSON.stringify(createPersistedDrawState()));
}

function seedSavedHistory() {
  window.localStorage.setItem(
    STORAGE_KEYS.savedDrawHistory,
    JSON.stringify([
      {
        id: 'history-1',
        savedAt: 1700000000000,
        label: 'Sorteio base',
        summary: '2 grupos · 2 por grupo',
        selectedTeamIds: ['CAN', 'ECU', 'SEN', 'NED'],
        drawState: createPersistedDrawState('none')
      }
    ])
  );
}

function seedSavedHistoryPair() {
  window.localStorage.setItem(
    STORAGE_KEYS.savedDrawHistory,
    JSON.stringify([
      {
        id: 'history-1',
        savedAt: 1700000000000,
        label: 'Sorteio base',
        summary: '2 grupos · 2 por grupo',
        selectedTeamIds: ['CAN', 'ECU', 'SEN', 'NED'],
        drawState: createPersistedDrawState('none')
      },
      {
        id: 'history-2',
        savedAt: 1700003600000,
        label: 'Sorteio alternativo',
        summary: '2 grupos · 2 por grupo',
        selectedTeamIds: ['ESP', 'NED', 'CAN', 'ECU'],
        drawState: {
          settings: {
            numberOfGroups: 2,
            teamsPerGroup: 2,
            confederationPolicy: 'none'
          },
          result: {
            groups: [
              {
                id: 'group-a',
                teams: [getTeam('ESP'), getTeam('NED')]
              },
              {
                id: 'group-b',
                teams: [getTeam('CAN'), getTeam('ECU')]
              }
            ],
            settings: {
              numberOfGroups: 2,
              teamsPerGroup: 2,
              confederationPolicy: 'none'
            },
            timestamp: 2
          },
          status: 'drawn',
          lastError: null,
          undoResult: null
        }
      }
    ])
  );
}

async function openSelectionView(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /buscar/i }));
  await screen.findByRole('heading', { name: /gestão de participantes/i });
}

async function openOptionsView(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('tab', { name: /opções/i }));
  await screen.findByRole('heading', { name: /opções detalhadas/i });
}

async function openSimulatorView(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('tab', { name: /simulador/i }));
  await screen.findByRole('heading', { name: /simulador do sorteio/i });
}

async function openHistoryTab(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('tab', { name: /histórico/i }));
  await screen.findByRole('heading', { name: /sorteios salvos/i });
}

async function openComparisonTab(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('tab', { name: /comparar/i }));
  await screen.findByRole('heading', { name: /comparar sorteios/i });
}

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('draw persistence flow', () => {
  it('restores a saved result in the simulator shell', () => {
    seedPersistedResult();
    render(<App />);

    expect(screen.getByRole('heading', { name: /grupos do sorteio/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /grupo a/i })).toBeInTheDocument();
    expect(screen.getByText(/ecuador/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /re-sortear/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /salvar resultado/i })).toBeEnabled();
  });

  it('restores persisted configuration values in the options tab', async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(STORAGE_KEYS.selectedTeams, JSON.stringify(['CAN']));
    window.localStorage.setItem(
      STORAGE_KEYS.drawState,
      JSON.stringify({
        settings: {
          numberOfGroups: 2,
          teamsPerGroup: 2,
          confederationPolicy: 'fifa-like'
        },
        result: null,
        status: 'configured',
        lastError: null,
        undoResult: null
      })
    );

    render(<App />);

    await openOptionsView(user);
    expect(screen.getByLabelText(/quantidade de grupos/i)).toHaveValue(2);
    expect(screen.getByLabelText(/equipes por grupo/i)).toHaveValue(2);
    expect(screen.getByLabelText(/regra de confederação/i)).toHaveValue('fifa-like');
  });

  it('defaults restored legacy settings to unrestricted policy', async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(STORAGE_KEYS.selectedTeams, JSON.stringify(['CAN']));
    window.localStorage.setItem(
      STORAGE_KEYS.drawState,
      JSON.stringify({
        settings: {
          numberOfGroups: 2,
          teamsPerGroup: 2
        },
        result: null,
        status: 'configured',
        lastError: null
      })
    );

    render(<App />);

    await openOptionsView(user);
    expect(screen.getByLabelText(/regra de confederação/i)).toHaveValue('none');
  });

  it('invalidates a restored result when the participant selection changes', async () => {
    const user = userEvent.setup();

    seedPersistedResult();
    render(<App />);

    await openSelectionView(user);
    const selectedPanel = await screen.findByRole('region', {
      name: /participantes selecionados/i
    });

    await user.click(within(selectedPanel).getByRole('button', { name: /limpar tudo/i }));
    await openSimulatorView(user);

    expect(screen.queryByRole('heading', { name: /grupos do sorteio/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sortear grupos/i })).toBeDisabled();
  });

  it('invalidates a valid result immediately after configuration changes in options', async () => {
    const user = userEvent.setup();

    seedPersistedResult();
    render(<App />);

    expect(screen.getByRole('heading', { name: /grupos do sorteio/i })).toBeInTheDocument();

    await openOptionsView(user);
    expect(screen.queryByRole('button', { name: /re-sortear/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/quantidade de grupos/i)).toHaveValue(2);

    await user.clear(screen.getByLabelText(/quantidade de grupos/i));
    await user.type(screen.getByLabelText(/quantidade de grupos/i), '3');

    expect(screen.getByText(/status: configurado/i)).toBeInTheDocument();

    await openSimulatorView(user);

    expect(screen.queryByRole('heading', { name: /grupos do sorteio/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sortear grupos/i })).toBeDisabled();
  });

  it('restores a saved draw from history into the active session', async () => {
    const user = userEvent.setup();

    seedSavedHistory();
    render(<App />);

    await openHistoryTab(user);
    await user.click(await screen.findByRole('button', { name: /abrir sorteio salvo/i }));

    expect(await screen.findByRole('heading', { name: /grupos do sorteio/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /grupo a/i })).toBeInTheDocument();
    expect(screen.getByText(/ecuador/i)).toBeInTheDocument();
  });

  it('asks for confirmation before replacing an unsaved active session with a saved draw', async () => {
    const user = userEvent.setup();

    seedSavedHistory();
    render(<App />);

    await openSelectionView(user);
    await user.click(screen.getByRole('button', { name: /canada/i }));
    await openSimulatorView(user);
    await openHistoryTab(user);
    await user.click(screen.getByRole('button', { name: /abrir sorteio salvo/i }));

    expect(
      await screen.findByText('A sessão atual será substituída. Deseja continuar?')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^cancelar$/i }));

    expect(screen.queryByRole('heading', { name: /grupos do sorteio/i })).not.toBeInTheDocument();
    await openSimulatorView(user);
    expect(screen.getByText('1', { selector: '.current' })).toBeInTheDocument();
  });

  it('restores the saved draw after confirming replacement of an unsaved active session', async () => {
    const user = userEvent.setup();

    seedSavedHistory();
    render(<App />);

    await openSelectionView(user);
    await user.click(screen.getByRole('button', { name: /canada/i }));
    await openSimulatorView(user);
    await openHistoryTab(user);
    await user.click(screen.getByRole('button', { name: /abrir sorteio salvo/i }));
    await user.click(screen.getByRole('button', { name: /^ok$/i }));

    expect(await screen.findByRole('heading', { name: /grupos do sorteio/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /grupo a/i })).toBeInTheDocument();
    expect(screen.getByText(/ecuador/i)).toBeInTheDocument();
  });

  it('opens a saved draw comparison after selecting two history entries', async () => {
    const user = userEvent.setup();

    seedSavedHistoryPair();
    render(<App />);

    await openComparisonTab(user);
    await user.selectOptions(screen.getByLabelText(/sorteio a/i), 'history-1');
    await user.selectOptions(screen.getByLabelText(/sorteio b/i), 'history-2');

    expect(
      await screen.findByRole('region', { name: /comparação de sorteios salvos/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /restaurar este sorteio/i })).toHaveLength(2);
  });

  it('restores the chosen side from the saved draw comparison', async () => {
    const user = userEvent.setup();

    seedSavedHistoryPair();
    render(<App />);

    await openComparisonTab(user);
    await user.selectOptions(screen.getByLabelText(/sorteio a/i), 'history-1');
    await user.selectOptions(screen.getByLabelText(/sorteio b/i), 'history-2');
    const restoreButtons = await screen.findAllByRole('button', {
      name: /restaurar este sorteio/i
    });
    const restoreRightButton = restoreButtons[1];

    if (!restoreRightButton) {
      throw new Error('Expected the right-side restore button to be rendered.');
    }

    await user.click(restoreRightButton);

    expect(await screen.findByRole('heading', { name: /grupos do sorteio/i })).toBeInTheDocument();
    expect(screen.getByText(/spain/i)).toBeInTheDocument();
    expect(screen.getByText(/netherlands/i)).toBeInTheDocument();
  });
});
