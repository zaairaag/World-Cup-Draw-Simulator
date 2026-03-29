import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '../../../app/App';
import * as drawEngineModule from '../domain/drawEngine';

async function configureTwoByTwo(user: ReturnType<typeof userEvent.setup>) {
  await user.clear(screen.getByLabelText(/quantidade de grupos/i));
  await user.type(screen.getByLabelText(/quantidade de grupos/i), '2');
  await user.clear(screen.getByLabelText(/equipes por grupo/i));
  await user.type(screen.getByLabelText(/equipes por grupo/i), '2');
}

async function configureSixteenByFour(user: ReturnType<typeof userEvent.setup>) {
  await user.clear(screen.getByLabelText(/quantidade de grupos/i));
  await user.type(screen.getByLabelText(/quantidade de grupos/i), '16');
  await user.clear(screen.getByLabelText(/equipes por grupo/i));
  await user.type(screen.getByLabelText(/equipes por grupo/i), '4');
}

async function selectFifaLikePolicy(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByLabelText(/regra de confederação/i),
    screen.getByText(/^regra fifa-like$/i, { selector: 'option' })
  );
}

async function selectTeam(user: ReturnType<typeof userEvent.setup>, teamName: RegExp) {
  await user.click(screen.getByRole('button', { name: teamName }));
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

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('draw configuration flow', () => {
  it('shows real session activity in the ready state', async () => {
    const user = userEvent.setup();

    render(<App />);

    await openSelectionView(user);
    await selectTeam(user, /canada/i);

    await openOptionsView(user);
    await configureTwoByTwo(user);
    await user.click(screen.getByRole('tab', { name: /participantes/i }));
    await screen.findByRole('heading', { name: /gestão de participantes/i });
    await user.click(screen.getByRole('button', { name: /preencher automaticamente/i }));

    await openSimulatorView(user);

    expect(screen.getByText(/seleção canada adicionada/i)).toBeInTheDocument();
    expect(screen.getByText(/configuração alterada para 2 grupos\./i)).toBeInTheDocument();
    expect(
      screen.getByText(/configuração alterada para 2 equipes por grupo\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/preenchimento automático concluiu 4 participantes/i)
    ).toBeInTheDocument();
  }, 20000);

  it('logs the actual autofill delta when the catalog cannot meet the requested capacity', async () => {
    const user = userEvent.setup();

    render(<App />);

    await openSelectionView(user);
    await selectTeam(user, /canada/i);

    await openOptionsView(user);
    await configureSixteenByFour(user);
    await user.click(screen.getByRole('tab', { name: /participantes/i }));
    await screen.findByRole('heading', { name: /gestão de participantes/i });

    await user.click(screen.getByRole('button', { name: /preencher automaticamente/i }));

    await openSimulatorView(user);

    expect(
      screen.getByText(
        /preenchimento automático adicionou 31 participantes\. total atual: 32 de 64\./i
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText(/preenchimento automático/i)).toHaveLength(1);

    await user.click(screen.getByRole('tab', { name: /participantes/i }));
    await screen.findByRole('heading', { name: /gestão de participantes/i });
    await user.click(screen.getByRole('button', { name: /preencher automaticamente/i }));

    await openSimulatorView(user);

    expect(screen.getAllByText(/preenchimento automático/i)).toHaveLength(1);
    expect(
      screen.queryByText(/preenchimento automático concluiu 64 participantes/i)
    ).not.toBeInTheDocument();
  }, 20000);

  it('starts with the challenge defaults for a 32-team tournament', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.queryByText(/sessão iniciada com/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/configuração inicial:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/base do desafio carregada/i)).not.toBeInTheDocument();
    expect(screen.getByText('0', { selector: '.current' })).toBeInTheDocument();
    expect(screen.getByText('/ 32', { selector: '.divider' })).toBeInTheDocument();
    expect(screen.getByText(/selecione 32 seleções para sortear/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sortear grupos/i })).toBeDisabled();

    await openOptionsView(user);

    expect(screen.getByLabelText(/quantidade de grupos/i)).toHaveValue(8);
    expect(screen.getByLabelText(/equipes por grupo/i)).toHaveValue(4);
    expect(screen.getByLabelText(/quantidade de grupos/i)).toBeDisabled();
    expect(screen.getByLabelText(/equipes por grupo/i)).toBeDisabled();
    expect(screen.getByLabelText(/regra de confederação/i)).toBeDisabled();
  });

  it('unlocks the configuration rail progressively, supports assisted fill, and stores a generated result', async () => {
    const user = userEvent.setup();

    render(<App />);

    await openOptionsView(user);
    expect(screen.getByLabelText(/quantidade de grupos/i)).toBeDisabled();

    await openSelectionView(user);
    await selectTeam(user, /canada/i);

    await openOptionsView(user);
    expect(screen.getByLabelText(/quantidade de grupos/i)).toBeEnabled();
    expect(screen.getByLabelText(/regra de confederação/i)).toBeEnabled();

    await configureTwoByTwo(user);
    await user.click(screen.getByRole('tab', { name: /participantes/i }));
    await screen.findByRole('heading', { name: /gestão de participantes/i });
    await user.click(screen.getByRole('button', { name: /preencher automaticamente/i }));

    await openSimulatorView(user);

    const drawButton = screen.getByRole('button', { name: /sortear grupos/i });

    expect(drawButton).toBeEnabled();

    await user.click(drawButton);

    expect(
      await screen.findByRole('heading', { name: /processo de sorteio/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /grupos do sorteio/i })).not.toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: /grupos do sorteio/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /grupo a/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /grupo b/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /re-sortear/i })).toBeEnabled();
  }, 20000);

  it('records confederation policy changes in session activity', async () => {
    const user = userEvent.setup();

    render(<App />);

    await openSelectionView(user);
    await selectTeam(user, /canada/i);
    await openOptionsView(user);
    await selectFifaLikePolicy(user);
    await openSimulatorView(user);

    expect(
      screen.getByText(/configuração alterada para regra de confederação fifa-like\./i)
    ).toBeInTheDocument();
  });

  it('applies a preset through the same settings flow and invalidates the current result', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const user = userEvent.setup();

    render(<App />);

    await openSelectionView(user);
    await selectTeam(user, /canada/i);
    await openOptionsView(user);
    await configureTwoByTwo(user);
    await user.click(screen.getByRole('tab', { name: /participantes/i }));
    await screen.findByRole('heading', { name: /gestão de participantes/i });
    await user.click(screen.getByRole('button', { name: /preencher automaticamente/i }));
    await openSimulatorView(user);
    await user.click(screen.getByRole('button', { name: /sortear grupos/i }));
    await screen.findByRole('heading', { name: /grupos do sorteio/i });

    await openOptionsView(user);
    await user.click(await screen.findByRole('button', { name: /padrão do desafio/i }));

    expect(screen.getByLabelText(/quantidade de grupos/i)).toHaveValue(8);
    expect(screen.getByLabelText(/equipes por grupo/i)).toHaveValue(4);
    expect(screen.getByLabelText(/regra de confederação/i)).toHaveValue('none');

    await openSimulatorView(user);

    expect(screen.queryByRole('heading', { name: /grupos do sorteio/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sortear grupos/i })).toBeDisabled();
  }, 20000);

  it('shows validation feedback and disables the draw button under fifa-like policy', async () => {
    const user = userEvent.setup();

    render(<App />);

    await openSelectionView(user);
    await selectTeam(user, /canada/i);
    await openOptionsView(user);
    await configureTwoByTwo(user);
    await selectFifaLikePolicy(user);
    await user.click(screen.getByRole('tab', { name: /participantes/i }));
    await screen.findByRole('heading', { name: /gestão de participantes/i });
    await user.click(screen.getByRole('button', { name: /limpar tudo/i }));
    await selectTeam(user, /japan/i);
    await selectTeam(user, /iran/i);
    await selectTeam(user, /saudi arabia/i);
    await selectTeam(user, /netherlands/i);

    await openOptionsView(user);

    expect(
      screen.getByText(
        /não é possível distribuir 3 equipes da afc em 2 grupos com limite de 1 por grupo/i
      )
    ).toBeInTheDocument();

    await openSimulatorView(user);

    expect(screen.getByRole('button', { name: /sortear grupos/i })).toBeDisabled();
  }, 20000);

  it('runs a successful draw for a viable set under fifa-like policy', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const user = userEvent.setup();

    render(<App />);

    await openSelectionView(user);
    await selectTeam(user, /canada/i);

    await openOptionsView(user);
    await configureTwoByTwo(user);
    await selectFifaLikePolicy(user);
    await user.click(screen.getByRole('tab', { name: /participantes/i }));
    await screen.findByRole('heading', { name: /gestão de participantes/i });
    await selectTeam(user, /ecuador/i);
    await selectTeam(user, /senegal/i);
    await selectTeam(user, /netherlands/i);

    await openSimulatorView(user);
    const drawButton = screen.getByRole('button', { name: /sortear grupos/i });

    expect(drawButton).toBeEnabled();

    await user.click(drawButton);

    expect(
      await screen.findByRole('heading', { name: /processo de sorteio/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /grupos do sorteio/i })).not.toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: /grupos do sorteio/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /grupo a/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /grupo b/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /re-sortear/i })).toBeEnabled();
  }, 20000);

  it('keeps the draw in loading state until the configured delay finishes', () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /buscar/i }));
    fireEvent.click(screen.getByRole('button', { name: /canada/i }));
    fireEvent.click(screen.getByRole('tab', { name: /opções/i }));
    fireEvent.change(screen.getByLabelText(/quantidade de grupos/i), {
      target: { value: '2' }
    });
    fireEvent.change(screen.getByLabelText(/equipes por grupo/i), {
      target: { value: '2' }
    });
    fireEvent.click(screen.getByRole('tab', { name: /participantes/i }));
    fireEvent.click(screen.getByRole('button', { name: /preencher automaticamente/i }));
    fireEvent.click(screen.getByRole('tab', { name: /simulador/i }));
    fireEvent.click(screen.getByRole('button', { name: /sortear grupos/i }));

    expect(screen.getByRole('heading', { name: /processo de sorteio/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /grupos do sorteio/i })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(screen.queryByRole('heading', { name: /grupos do sorteio/i })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByRole('heading', { name: /grupos do sorteio/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /grupo a/i })).toBeInTheDocument();
  });

  it('shows a visible simulator error when the draw engine fails after starting the draw', () => {
    vi.useFakeTimers();
    vi.spyOn(drawEngineModule, 'drawEngine').mockReturnValue({
      ok: false,
      error: 'Não foi possível gerar um sorteio válido para a configuração atual.'
    });

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /buscar/i }));
    fireEvent.click(screen.getByRole('button', { name: /canada/i }));
    fireEvent.click(screen.getByRole('tab', { name: /opções/i }));
    fireEvent.change(screen.getByLabelText(/quantidade de grupos/i), {
      target: { value: '2' }
    });
    fireEvent.change(screen.getByLabelText(/equipes por grupo/i), {
      target: { value: '2' }
    });
    fireEvent.click(screen.getByRole('tab', { name: /participantes/i }));
    fireEvent.click(screen.getByRole('button', { name: /preencher automaticamente/i }));
    fireEvent.click(screen.getByRole('tab', { name: /simulador/i }));
    fireEvent.click(screen.getByRole('button', { name: /sortear grupos/i }));

    expect(screen.getByRole('heading', { name: /processo de sorteio/i })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.queryByRole('heading', { name: /grupos do sorteio/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /simulador do sorteio/i })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(
      /não foi possível gerar um sorteio válido para a configuração atual\./i
    );
    expect(screen.getByRole('button', { name: /sortear grupos/i })).toBeEnabled();
  }, 15000);

  it('clears the stale draw error after the participant selection changes', () => {
    vi.useFakeTimers();
    vi.spyOn(drawEngineModule, 'drawEngine').mockReturnValue({
      ok: false,
      error: 'Não foi possível gerar um sorteio válido para a configuração atual.'
    });

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /buscar/i }));
    fireEvent.click(screen.getByRole('button', { name: /canada/i }));
    fireEvent.click(screen.getByRole('tab', { name: /opções/i }));
    fireEvent.change(screen.getByLabelText(/quantidade de grupos/i), {
      target: { value: '2' }
    });
    fireEvent.change(screen.getByLabelText(/equipes por grupo/i), {
      target: { value: '2' }
    });
    fireEvent.click(screen.getByRole('tab', { name: /participantes/i }));
    fireEvent.click(screen.getByRole('button', { name: /preencher automaticamente/i }));
    fireEvent.click(screen.getByRole('tab', { name: /simulador/i }));
    fireEvent.click(screen.getByRole('button', { name: /sortear grupos/i }));

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByRole('alert')).toHaveTextContent(
      /não foi possível gerar um sorteio válido para a configuração atual\./i
    );

    fireEvent.click(screen.getByRole('tab', { name: /participantes/i }));
    fireEvent.click(screen.getByRole('button', { name: /limpar tudo/i }));
    fireEvent.click(screen.getByRole('tab', { name: /simulador/i }));

    expect(
      screen.queryByRole('alert', {
        name: /não foi possível gerar um sorteio válido para a configuração atual\./i
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/não foi possível gerar um sorteio válido para a configuração atual\./i)
    ).not.toBeInTheDocument();
  }, 20000);
});
