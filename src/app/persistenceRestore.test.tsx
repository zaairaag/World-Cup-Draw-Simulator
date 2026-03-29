import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { DrawState } from '../types';
import { STORAGE_KEYS } from '../constants';
import { App } from './App';

function createPersistedDrawState(): DrawState {
  return {
    settings: {
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    },
    status: 'drawn',
    lastError: null,
    undoResult: null,
    result: {
      settings: {
        numberOfGroups: 2,
        teamsPerGroup: 2,
        confederationPolicy: 'none'
      },
      seed: 12345,
      timestamp: 123,
      groups: [
        {
          id: 'group-a',
          teams: [
            {
              id: 'ECU',
              name: 'Ecuador',
              code: 'ECU',
              confederation: 'CONMEBOL'
            },
            {
              id: 'SEN',
              name: 'Senegal',
              code: 'SEN',
              confederation: 'CAF'
            }
          ]
        },
        {
          id: 'group-b',
          teams: [
            {
              id: 'NED',
              name: 'Netherlands',
              code: 'NED',
              confederation: 'UEFA'
            },
            {
              id: 'CAN',
              name: 'Canada',
              code: 'CAN',
              confederation: 'CONCACAF'
            }
          ]
        }
      ]
    }
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('persistence restore flow', () => {
  it('restores the saved selection, settings, and draw result on reload', async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(
      STORAGE_KEYS.selectedTeams,
      JSON.stringify(['CAN', 'ECU', 'SEN', 'NED'])
    );
    window.localStorage.setItem(STORAGE_KEYS.drawState, JSON.stringify(createPersistedDrawState()));

    render(<App />);

    expect(await screen.findByRole('heading', { name: /grupos do sorteio/i })).toBeInTheDocument();
    expect(screen.getByText(/ecuador/i)).toBeInTheDocument();
    expect(screen.getByText(/canada/i)).toBeInTheDocument();
    expect(screen.getByText(/gerado em/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /opções/i }));

    expect(await screen.findByRole('heading', { name: /opções detalhadas/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/quantidade de grupos/i)).toHaveValue(2);
    expect(screen.getByLabelText(/equipes por grupo/i)).toHaveValue(2);
    expect(screen.getByLabelText(/regra de confederação/i)).toHaveValue('none');

    await user.click(screen.getByRole('tab', { name: /participantes/i }));

    expect(
      await screen.findByRole('heading', { name: /gestão de participantes/i })
    ).toBeInTheDocument();

    const selectedPanel = screen.getByRole('region', {
      name: /participantes selecionados/i
    });

    expect(within(selectedPanel).getByText(/vagas preenchidas\s*\(4\/4\)/i)).toBeInTheDocument();
    expect(within(selectedPanel).getByText(/ecuador/i)).toBeInTheDocument();
    expect(within(selectedPanel).getByText(/canada/i)).toBeInTheDocument();
  }, 15000);

  it('falls back safely when storage contains invalid json', async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(STORAGE_KEYS.selectedTeams, '{bad-json');
    window.localStorage.setItem(STORAGE_KEYS.drawState, '{bad-json');

    render(<App />);

    expect(screen.getByRole('heading', { name: /simulador do sorteio/i })).toBeInTheDocument();
    expect(screen.getByText(/selecione 32 seleções para sortear/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /participantes/i }));

    expect(
      await screen.findByRole('heading', { name: /gestão de participantes/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/nenhum participante selecionado ainda/i)).toBeInTheDocument();
  });

  it('keeps the ui usable even when storage writes fail', async () => {
    const user = userEvent.setup();

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    render(<App />);

    await user.click(screen.getByRole('button', { name: /^buscar$/i }));

    const searchInput = await screen.findByRole('combobox', {
      name: /buscar seleções/i
    });

    await user.type(searchInput, 'can');
    await screen.findByRole('option', { name: /canada/i });
    await user.keyboard('{ArrowDown}{Enter}');

    const selectedPanel = screen.getByRole('region', {
      name: /participantes selecionados/i
    });

    expect(within(selectedPanel).getByText(/canada/i)).toBeInTheDocument();
  });
});
