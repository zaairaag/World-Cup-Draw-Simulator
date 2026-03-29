import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '../../../app/App';
import { STORAGE_KEYS } from '../../../constants';
import { appTheme } from '../../../theme/theme';
import type { DrawResult, Team } from '../../../types';
import * as drawEngineModule from '../domain/drawEngine';
import { localStorageRepository } from '../../../repositories';
import { localTeamRepository } from '../../teams/repositories/localTeamRepository';
import { DrawResultsPanel } from '../components/DrawResultsPanel';

const hadOwnNavigatorShare = Object.prototype.hasOwnProperty.call(navigator, 'share');
const originalNavigatorShare = (navigator as Navigator & { share?: unknown }).share;
const originalClipboardWriteTextDescriptor = navigator.clipboard
  ? Object.getOwnPropertyDescriptor(navigator.clipboard, 'writeText')
  : undefined;
const originalCreateObjectURLDescriptor = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
const originalRevokeObjectURLDescriptor = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');
const catalogResult = localTeamRepository.loadCatalog();

if (!catalogResult.ok) {
  throw new Error(catalogResult.error);
}

const catalogByCode = new Map<string, Team>(catalogResult.data.map((team) => [team.code, team]));

async function configureTwoByTwo(user: ReturnType<typeof userEvent.setup>) {
  await user.clear(screen.getByLabelText(/quantidade de grupos/i));
  await user.type(screen.getByLabelText(/quantidade de grupos/i), '2');
  await user.clear(screen.getByLabelText(/equipes por grupo/i));
  await user.type(screen.getByLabelText(/equipes por grupo/i), '2');
}

async function selectFourTeams(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /canada/i }));
  await user.click(screen.getByRole('button', { name: /ecuador/i }));
  await user.click(screen.getByRole('button', { name: /senegal/i }));
  await user.click(screen.getByRole('button', { name: /netherlands/i }));
}

async function selectFifaLikePolicy(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByLabelText(/regra de confederação/i),
    screen.getByText(/^regra fifa-like$/i, { selector: 'option' })
  );
}

async function openSelectionView(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /^buscar$/i }));

  const searchInput = await screen.findByRole('combobox', {
    name: /buscar seleções/i
  });

  expect(searchInput).toHaveFocus();
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

async function drawKnownResult(user: ReturnType<typeof userEvent.setup>) {
  render(<App />);

  await openSelectionView(user);
  await selectFourTeams(user);
  await openOptionsView(user);
  await configureTwoByTwo(user);
  await openSimulatorView(user);
  await user.click(screen.getByRole('button', { name: /sortear grupos/i }));

  await screen.findByRole('heading', { name: /grupo a/i });
}

function getTeam(code: string) {
  const team = catalogByCode.get(code);

  if (!team) {
    throw new Error(`Missing team in catalog: ${code}`);
  }

  return team;
}

function createMockResult(
  timestamp: number,
  groupA: [string, string],
  groupB: [string, string]
): DrawResult {
  return {
    groups: [
      {
        id: 'group-a',
        teams: groupA.map(getTeam)
      },
      {
        id: 'group-b',
        teams: groupB.map(getTeam)
      }
    ],
    settings: {
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    },
    timestamp
  };
}

async function drawKnownFifaLikeResult(user: ReturnType<typeof userEvent.setup>) {
  render(<App />);

  await openSelectionView(user);
  await user.click(screen.getByRole('button', { name: /japan/i }));
  await openOptionsView(user);
  await configureTwoByTwo(user);
  await selectFifaLikePolicy(user);
  await openSelectionView(user);
  await user.click(screen.getByRole('button', { name: /ecuador/i }));
  await user.click(screen.getByRole('button', { name: /iran/i }));
  await user.click(screen.getByRole('button', { name: /netherlands/i }));
  await openSimulatorView(user);
  await user.click(screen.getByRole('button', { name: /sortear grupos/i }));

  await screen.findByRole('heading', { name: /grupo a/i });
}

async function returnToReadySceneAfterSharing(user: ReturnType<typeof userEvent.setup>) {
  await openOptionsView(user);
  await user.selectOptions(screen.getByLabelText(/regra de confedera/i), 'fifa-like');

  await openSimulatorView(user);
}

afterEach(() => {
  vi.restoreAllMocks();
  try {
    if (hadOwnNavigatorShare) {
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: originalNavigatorShare
      });
    } else {
      Reflect.deleteProperty(navigator, 'share');
    }
  } catch {
    void 0;
  }
  try {
    if (navigator.clipboard) {
      if (originalClipboardWriteTextDescriptor) {
        Object.defineProperty(
          navigator.clipboard,
          'writeText',
          originalClipboardWriteTextDescriptor
        );
      } else {
        Reflect.deleteProperty(navigator.clipboard, 'writeText');
      }
    }
  } catch {
    void 0;
  }
  try {
    if (originalCreateObjectURLDescriptor) {
      Object.defineProperty(URL, 'createObjectURL', originalCreateObjectURLDescriptor);
    } else {
      Reflect.deleteProperty(URL, 'createObjectURL');
    }

    if (originalRevokeObjectURLDescriptor) {
      Object.defineProperty(URL, 'revokeObjectURL', originalRevokeObjectURLDescriptor);
    } else {
      Reflect.deleteProperty(URL, 'revokeObjectURL');
    }
  } catch {
    void 0;
  }
});

describe('draw results panel', () => {
  it('uses the challenge wording when no draw result is available yet', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <DrawResultsPanel
          status="idle"
          result={null}
          error={null}
          canUndoSwap={false}
          onUndoLastSwap={() => undefined}
          onSwapTeams={() => undefined}
          onClearError={() => undefined}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/selecione 32 seleções para sortear/i)).toBeInTheDocument();
  });

  it('uses neutral loading copy while the draw is in progress', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <DrawResultsPanel
          status="loading"
          result={null}
          error={null}
          canUndoSwap={false}
          onUndoLastSwap={() => undefined}
          onSwapTeams={() => undefined}
          onClearError={() => undefined}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByText(/distribuindo as seleções conforme as regras configuradas/i)
    ).toBeInTheDocument();
  });

  it('shows the current draw data in the result header and description', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const user = userEvent.setup();

    await drawKnownResult(user);

    expect(screen.getByRole('heading', { name: /grupos do sorteio/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /confira o resultado da simulação com 2 grupos gerados e 2 equipes por grupo/i
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /grupo a/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /grupo b/i })).toBeInTheDocument();
  }, 20000);

  it('renders an executive summary for the current result', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <DrawResultsPanel
          status="drawn"
          result={createMockResult(1, ['CAN', 'ECU'], ['SEN', 'NED'])}
          error={null}
          canUndoSwap={false}
          onUndoLastSwap={() => undefined}
          onSwapTeams={() => undefined}
          onClearError={() => undefined}
        />
      </ThemeProvider>
    );

    const summaryRegion = screen.getByRole('region', {
      name: /resumo executivo do sorteio/i
    });

    expect(summaryRegion).toBeInTheDocument();
    expect(within(summaryRegion).getByText(/^grupos gerados$/i)).toBeInTheDocument();
    expect(within(summaryRegion).getByText(/^equipes por grupo$/i)).toBeInTheDocument();
    expect(within(summaryRegion).getByText(/^política ativa$/i)).toBeInTheDocument();
  });

  it('updates the executive summary after the result data changes', () => {
    const view = render(
      <ThemeProvider theme={appTheme}>
        <DrawResultsPanel
          status="drawn"
          result={createMockResult(1, ['CAN', 'ECU'], ['SEN', 'NED'])}
          error={null}
          canUndoSwap={false}
          onUndoLastSwap={() => undefined}
          onSwapTeams={() => undefined}
          onClearError={() => undefined}
        />
      </ThemeProvider>
    );

    expect(
      within(screen.getByRole('region', { name: /resumo executivo do sorteio/i })).getByText('0', {
        selector: 'strong'
      })
    ).toBeInTheDocument();

    view.rerender(
      <ThemeProvider theme={appTheme}>
        <DrawResultsPanel
          status="drawn"
          result={createMockResult(2, ['ESP', 'NED'], ['CAN', 'ECU'])}
          error={null}
          canUndoSwap={false}
          onUndoLastSwap={() => undefined}
          onSwapTeams={() => undefined}
          onClearError={() => undefined}
        />
      </ThemeProvider>
    );

    expect(screen.getByRole('region', { name: /resumo executivo do sorteio/i })).toHaveTextContent(
      /grupos com 2 uefa/i
    );
    expect(screen.getAllByText('1', { selector: 'strong' }).length).toBeGreaterThan(0);
  });

  it('shares the current draw result through the Web Share API when available and logs the session feedback', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const share = vi.fn<(payload: ShareData) => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: share
    });
    const user = userEvent.setup();

    await drawKnownResult(user);
    await user.click(screen.getByRole('button', { name: /compartilhar/i }));

    expect(share).toHaveBeenCalled();
    const sharePayload = share.mock.calls[0]![0];
    expect(sharePayload.title ?? '').toMatch(/resultado do sorteio/i);
    expect(sharePayload.text ?? '').toMatch(/grupo a/i);
    expect(sharePayload.text ?? '').toMatch(/ecuador/i);
    expect(sharePayload.text ?? '').toMatch(/canada/i);

    await returnToReadySceneAfterSharing(user);

    expect(screen.getByText(/resumo do sorteio compartilhado\./i)).toBeInTheDocument();
  }, 20000);

  it('copies the current draw result through the visible CTA when share is unavailable and logs the clipboard fallback', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined
    });
    vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeText);
    const user = userEvent.setup();

    await drawKnownResult(user);
    await user.click(screen.getByRole('button', { name: /compartilhar/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });
    expect(writeText.mock.calls[0]![0]).toMatch(/grupo a/i);
    expect(writeText.mock.calls[0]![0]).toMatch(/ecuador/i);
    expect(writeText.mock.calls[0]![0]).toMatch(/canada/i);

    await returnToReadySceneAfterSharing(user);

    expect(
      screen.getByText(/resumo do sorteio copiado para a área de transferência\./i)
    ).toBeInTheDocument();
  }, 20000);

  it('reports clipboard failure when clipboard writeText rejects and logs the session feedback', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined
    });
    const writeText = vi.fn().mockRejectedValue(new Error('clipboard failed'));
    vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeText);
    const user = userEvent.setup();

    await drawKnownResult(user);
    await user.click(screen.getByRole('button', { name: /compartilhar/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
    });
    expect(writeText.mock.calls[0]![0]).toMatch(/grupo a/i);
    expect(writeText.mock.calls[0]![0]).toMatch(/ecuador/i);

    await returnToReadySceneAfterSharing(user);

    await screen.findByText(/log de atividade/i);
    const logHeader = screen.getByText(/log de atividade/i);
    const logBox = logHeader.parentElement;
    expect(logBox?.textContent ?? '').toMatch(/n.o foi poss.vel copiar/i);
    expect(logBox?.textContent ?? '').toMatch(/https|contexto seguro|tente novamente/i);
  }, 20000);

  it('reports sharing unavailable when neither Web Share nor clipboard is available', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined
    });
    Object.defineProperty(navigator.clipboard, 'writeText', {
      configurable: true,
      value: undefined
    });
    const user = userEvent.setup();

    await drawKnownResult(user);
    await user.click(screen.getByRole('button', { name: /compartilhar/i }));
    await returnToReadySceneAfterSharing(user);

    expect(
      screen.getByText(/compartilhamento indisponível neste navegador\./i)
    ).toBeInTheDocument();
  }, 20000);

  it('opens a save-name modal with a suggested label before saving the result', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const user = userEvent.setup();

    await drawKnownResult(user);
    await user.click(screen.getByRole('button', { name: /salvar resultado/i }));

    expect(await screen.findByRole('dialog', { name: /salvar resultado/i })).toBeInTheDocument();
    const saveNameInput = screen.getByLabelText(/nome do sorteio/i);
    expect(saveNameInput).toHaveValue((saveNameInput as HTMLInputElement).value);
    expect((saveNameInput as HTMLInputElement).value).toMatch(/sorteio/i);
  }, 20000);

  it('cancels the save-name flow without clearing the active session', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    const user = userEvent.setup();

    await drawKnownResult(user);
    await user.click(screen.getByRole('button', { name: /salvar resultado/i }));
    await user.click(screen.getByRole('button', { name: /^cancelar$/i }));

    expect(click).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: /grupos do sorteio/i })).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEYS.savedDrawHistory)).toBeNull();
  }, 20000);

  it('downloads the json, stores the draw in history, and clears the active session when saving', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    if (!('createObjectURL' in URL)) {
      Object.defineProperty(URL, 'createObjectURL', {
        configurable: true,
        value: () => 'blob:test'
      });
    }
    if (!('revokeObjectURL' in URL)) {
      Object.defineProperty(URL, 'revokeObjectURL', {
        configurable: true,
        value: () => undefined
      });
    }
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    const user = userEvent.setup();

    await drawKnownResult(user);
    await user.click(screen.getByRole('button', { name: /salvar resultado/i }));
    await user.click(screen.getByRole('button', { name: /confirmar salvamento/i }));

    expect(click).toHaveBeenCalled();
    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();
    expect(
      JSON.parse(window.localStorage.getItem(STORAGE_KEYS.savedDrawHistory) ?? '[]')
    ).toHaveLength(1);
    expect(await screen.findByRole('button', { name: /sortear grupos/i })).toBeDisabled();
    expect(screen.getByText('0', { selector: '.current' })).toBeInTheDocument();
    await openHistoryTab(user);
    expect(screen.getByRole('button', { name: /abrir sorteio salvo/i })).toBeInTheDocument();
  }, 20000);

  it('stores a custom label in saved history after confirming the modal', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    if (!('createObjectURL' in URL)) {
      Object.defineProperty(URL, 'createObjectURL', {
        configurable: true,
        value: () => 'blob:test'
      });
    }
    if (!('revokeObjectURL' in URL)) {
      Object.defineProperty(URL, 'revokeObjectURL', {
        configurable: true,
        value: () => undefined
      });
    }
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const user = userEvent.setup();

    await drawKnownResult(user);
    await user.click(screen.getByRole('button', { name: /salvar resultado/i }));
    await user.clear(screen.getByLabelText(/nome do sorteio/i));
    await user.type(screen.getByLabelText(/nome do sorteio/i), 'Cenário de revisão');
    await user.click(screen.getByRole('button', { name: /confirmar salvamento/i }));

    await openHistoryTab(user);
    expect(screen.getByText('Cenário de revisão')).toBeInTheDocument();
  }, 20000);

  it('keeps the active session when saving to history fails', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    if (!('createObjectURL' in URL)) {
      Object.defineProperty(URL, 'createObjectURL', {
        configurable: true,
        value: () => 'blob:test'
      });
    }
    if (!('revokeObjectURL' in URL)) {
      Object.defineProperty(URL, 'revokeObjectURL', {
        configurable: true,
        value: () => undefined
      });
    }
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    vi.spyOn(localStorageRepository, 'save').mockReturnValue({
      ok: false,
      error: 'Quota exceeded'
    });
    const user = userEvent.setup();

    await drawKnownResult(user);
    await user.click(screen.getByRole('button', { name: /salvar resultado/i }));
    await user.click(screen.getByRole('button', { name: /confirmar salvamento/i }));

    expect(click).toHaveBeenCalled();
    expect(createObjectURL).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();
    expect(window.localStorage.getItem(STORAGE_KEYS.savedDrawHistory)).toBeNull();
    expect(screen.getByRole('heading', { name: /grupos do sorteio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar resultado/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /abrir sorteio salvo/i })).not.toBeInTheDocument();
  }, 20000);

  it('re-sorts the active session without saving or downloading', async () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    vi.spyOn(drawEngineModule, 'drawEngine')
      .mockReturnValueOnce({
        ok: true,
        data: createMockResult(1, ['CAN', 'ECU'], ['SEN', 'NED'])
      })
      .mockReturnValueOnce({
        ok: true,
        data: createMockResult(2, ['NED', 'SEN'], ['ECU', 'CAN'])
      });
    const user = userEvent.setup();

    render(<App />);

    await openSelectionView(user);
    await selectFourTeams(user);
    await openOptionsView(user);
    await configureTwoByTwo(user);
    await openSimulatorView(user);
    await user.click(screen.getByRole('button', { name: /sortear grupos/i }));
    await screen.findByRole('heading', { name: /grupo a/i });

    const firstGroupCard = screen
      .getByRole('heading', { name: /grupo a/i })
      .closest('div')?.parentElement;

    expect(firstGroupCard).not.toBeNull();
    expect(
      within(firstGroupCard!).getByText(/^canada$/i, { selector: 'span' })
    ).toBeInTheDocument();
    expect(
      within(firstGroupCard!).getByText(/^ecuador$/i, { selector: 'span' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /re-sortear/i }));

    expect(click).not.toHaveBeenCalled();
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(revokeObjectURL).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(STORAGE_KEYS.savedDrawHistory)).toBeNull();
    expect(screen.getByRole('heading', { name: /processo de sorteio/i })).toBeInTheDocument();
    await screen.findByRole('heading', { name: /grupo a/i });

    const restartedGroupCard = screen
      .getByRole('heading', { name: /grupo a/i })
      .closest('div')?.parentElement;

    expect(restartedGroupCard).not.toBeNull();
    expect(
      within(restartedGroupCard!).getByText(/^netherlands$/i, { selector: 'span' })
    ).toBeInTheDocument();
    expect(
      within(restartedGroupCard!).getByText(/^senegal$/i, { selector: 'span' })
    ).toBeInTheDocument();
    expect(
      within(restartedGroupCard!).queryByText(/^canada$/i, { selector: 'span' })
    ).not.toBeInTheDocument();
  }, 20000);

  it('shows an alert when the swap keeps both teams in the same group', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const user = userEvent.setup();

    await drawKnownResult(user);

    await user.selectOptions(screen.getByLabelText(/grupo de origem/i), 'group-a');
    await user.selectOptions(screen.getByLabelText(/equipe de origem/i), 'ECU');
    await user.selectOptions(screen.getByLabelText(/grupo de destino/i), 'group-a');
    await user.selectOptions(screen.getByLabelText(/equipe de destino/i), 'SEN');
    await user.click(screen.getByRole('button', { name: /trocar equipes/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      /escolha dois grupos diferentes para trocar equipes/i
    );
    expect(screen.getByText(/^ecuador$/i, { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText(/^senegal$/i, { selector: 'span' })).toBeInTheDocument();
  }, 20000);

  it('shows an alert and preserves teams when a swap violates the active confederation policy', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const user = userEvent.setup();

    await drawKnownFifaLikeResult(user);

    await user.selectOptions(screen.getByLabelText(/grupo de origem/i), 'group-a');
    await user.selectOptions(screen.getByLabelText(/equipe de origem/i), 'JPN');
    await user.selectOptions(screen.getByLabelText(/grupo de destino/i), 'group-b');
    await user.selectOptions(screen.getByLabelText(/equipe de destino/i), 'ECU');
    await user.click(screen.getByRole('button', { name: /trocar equipes/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      /a troca selecionada viola a regra de confederação ativa/i
    );
    expect(screen.getByText(/^japan$/i, { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText(/^ecuador$/i, { selector: 'span' })).toBeInTheDocument();
  }, 20000);

  it('restores the previous group composition after undoing the last swap', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const user = userEvent.setup();

    await drawKnownResult(user);

    await user.selectOptions(screen.getByLabelText(/grupo de origem/i), 'group-b');
    await user.selectOptions(screen.getByLabelText(/equipe de origem/i), 'CAN');
    await user.selectOptions(screen.getByLabelText(/grupo de destino/i), 'group-a');
    await user.selectOptions(screen.getByLabelText(/equipe de destino/i), 'SEN');
    await user.click(screen.getByRole('button', { name: /trocar equipes/i }));

    expect(screen.getByRole('button', { name: /desfazer última troca/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /desfazer última troca/i }));

    expect(screen.getByText(/^canada$/i, { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText(/^senegal$/i, { selector: 'span' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /desfazer última troca/i })
    ).not.toBeInTheDocument();
  }, 20000);
});
