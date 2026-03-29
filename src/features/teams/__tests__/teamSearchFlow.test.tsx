import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { App } from '../../../app/App';

describe('team search and selection flow', () => {
  it('opens the participant view from the shell and allows keyboard selection by code', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /^buscar$/i }));

    expect(
      await screen.findByRole('heading', { name: /gestão de participantes/i })
    ).toBeInTheDocument();

    const searchInput = screen.getByRole('combobox', { name: /buscar seleções/i });

    expect(searchInput).toHaveFocus();

    await user.type(searchInput, 'mex');

    const mexicoOption = await screen.findByRole('option', { name: /mexico/i });

    expect(mexicoOption).toBeInTheDocument();

    await user.keyboard('{ArrowDown}{Enter}');

    const selectedPanel = screen.getByRole('region', {
      name: /participantes selecionados/i
    });

    expect(within(selectedPanel).getByText('Mexico')).toBeInTheDocument();
  }, 15000);

  it('updates the suggestion list only after the debounce delay', () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /^buscar$/i }));

    const searchInput = screen.getByRole('combobox', { name: /buscar seleções/i });

    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, {
      target: { value: 'bra' }
    });

    expect(screen.queryByRole('option', { name: /brazil/i })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(199);
    });

    expect(screen.queryByRole('option', { name: /brazil/i })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByRole('option', { name: /brazil/i })).toBeInTheDocument();
  });

  it('supports code search, remove, clear all, and empty feedback', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /^buscar$/i }));

    expect(
      await screen.findByRole('heading', { name: /gestão de participantes/i })
    ).toBeInTheDocument();

    const searchInput = screen.getByRole('combobox', { name: /buscar seleções/i });

    await user.type(searchInput, 'zzz');

    expect(await screen.findByText(/nenhuma seleção encontrada/i)).toBeInTheDocument();

    await user.clear(searchInput);
    await user.type(searchInput, 'arg');
    await screen.findByRole('option', { name: /argentina/i });
    await user.keyboard('{ArrowDown}{Enter}');

    await user.clear(searchInput);
    await user.type(searchInput, 'mex');
    await screen.findByRole('option', { name: /mexico/i });
    await user.keyboard('{ArrowDown}{Enter}');

    const selectedPanel = screen.getByRole('region', {
      name: /participantes selecionados/i
    });

    expect(within(selectedPanel).getByText('Argentina')).toBeInTheDocument();
    expect(within(selectedPanel).getByText('Mexico')).toBeInTheDocument();

    await user.click(within(selectedPanel).getByRole('button', { name: /remover argentina/i }));

    expect(within(selectedPanel).queryByText('Argentina')).not.toBeInTheDocument();

    await user.click(within(selectedPanel).getByRole('button', { name: /limpar tudo/i }));

    expect(screen.getByText(/nenhum participante selecionado ainda/i)).toBeInTheDocument();
  });

  it('clears the stale no-match feedback as soon as a new query starts', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /^buscar$/i }));

    const searchInput = await screen.findByRole('combobox', {
      name: /buscar seleções/i
    });

    await user.type(searchInput, 'zzz');

    expect(await screen.findByText(/nenhuma seleção encontrada/i)).toBeInTheDocument();

    await user.clear(searchInput);
    await user.type(searchInput, 'mex');

    expect(screen.queryByText(/nenhuma seleção encontrada/i)).not.toBeInTheDocument();

    expect(await screen.findByRole('option', { name: /mexico/i })).toBeInTheDocument();
  });

  it('removes stale catalog matches as soon as the query changes', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /^buscar$/i }));

    const searchInput = await screen.findByRole('combobox', {
      name: /buscar seleções/i
    });

    await user.type(searchInput, 'arg');

    expect(await screen.findByRole('option', { name: /argentina/i })).toBeInTheDocument();
    expect(screen.getAllByText('Argentina').length).toBeGreaterThan(0);

    await user.clear(searchInput);
    await user.type(searchInput, 'mex');

    expect(screen.queryAllByText('Argentina')).toHaveLength(0);
    expect(screen.getAllByText('Mexico').length).toBeGreaterThan(0);
  });

  it('filters the catalog by confederation and keeps the query composed with the active chip', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /^buscar$/i }));

    const searchInput = await screen.findByRole('combobox', {
      name: /buscar seleções/i
    });

    const quickFilterBar = screen.getByLabelText(/filtros rápidos do catálogo/i);
    await user.click(within(quickFilterBar).getByRole('button', { name: /^uefa$/i }));

    expect(screen.getAllByText('Netherlands').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Canada')).toHaveLength(0);

    await user.type(searchInput, 'net');

    expect(screen.getAllByText('Netherlands').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Japan')).toHaveLength(0);
  });

  it('shows selected teams in the catalog when the selected quick filter is active', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /^buscar$/i }));

    await screen.findByRole('heading', { name: /gestão de participantes/i });
    await user.click(screen.getByRole('button', { name: /canada/i }));
    await user.click(screen.getByRole('button', { name: /ecuador/i }));
    const quickFilterBar = screen.getByLabelText(/filtros rápidos do catálogo/i);
    await user.click(within(quickFilterBar).getByRole('button', { name: /selecionadas/i }));

    const canadaCatalogButton = screen
      .getAllByRole('button', { name: /canada/i })
      .find((button) => button.hasAttribute('disabled'));
    const ecuadorCatalogButton = screen
      .getAllByRole('button', { name: /ecuador/i })
      .find((button) => button.hasAttribute('disabled'));

    if (!canadaCatalogButton || !ecuadorCatalogButton) {
      throw new Error('Expected selected teams to remain visible as disabled catalog items.');
    }

    expect(canadaCatalogButton).toBeDisabled();
    expect(ecuadorCatalogButton).toBeDisabled();
  });
});
