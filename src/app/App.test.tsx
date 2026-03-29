import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS } from '../constants';
import { appTheme } from '../theme/theme';
import { App } from './App';
import { AppProviders } from './AppProviders';

function ThemeProbe() {
  const theme = useTheme();

  return <span>{theme.colors.accent}</span>;
}

describe('App', () => {
  it('routes the header search trigger to the participant combobox', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /^buscar$/i }));

    expect(
      await screen.findByRole('heading', { name: /gestão de participantes/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /buscar seleções/i })).toHaveFocus();
  });

  it('refocuses the participant combobox when search is triggered again', async () => {
    const user = userEvent.setup();

    render(<App />);

    const searchButton = screen.getByRole('button', { name: /^buscar$/i });

    await user.click(searchButton);

    const searchInput = await screen.findByRole('combobox', {
      name: /buscar seleções/i
    });

    expect(searchInput).toHaveFocus();

    await user.click(searchButton);

    expect(searchInput).toHaveFocus();
  });

  it('renders the visible simulator shell', () => {
    render(<App />);

    expect(screen.getAllByText(/^ge$/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /simulador do sorteio/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /monte a fase de grupos com 32 seleções, ajuste as regras do sorteio e gere combinações automáticas para revisar os grupos/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/selecione 32 seleções para sortear/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /participantes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sortear grupos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /editar lista/i })).toBeInTheDocument();
    expect(screen.getByText(/configurações do torneio/i)).toBeInTheDocument();
    expect(screen.getByText(/times prontos para o sorteio/i)).toBeInTheDocument();
    expect(screen.queryByText(/arquitetura definida/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/gates de verificação/i)).not.toBeInTheDocument();
  });

  it('provides the shared theme to child content', () => {
    render(
      <AppProviders>
        <ThemeProbe />
      </AppProviders>
    );

    expect(screen.getByText('#07aa47')).toBeInTheDocument();
    expect(appTheme.colors.accent).toBe('#07aa47');
  });

  it('defaults to light mode when no persisted preference exists', () => {
    const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation(
      () =>
        ({
          matches: true,
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn()
        }) as MediaQueryList
    );

    render(<App />);

    expect(document.documentElement).toHaveAttribute('data-theme-mode', 'light');
    expect(window.localStorage.getItem(STORAGE_KEYS.themeMode)).toBe('light');

    matchMediaSpy.mockRestore();
  });

  it('toggles dark mode from the header and persists the selection', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(document.documentElement).toHaveAttribute('data-theme-mode', 'light');
    expect(screen.queryByText(/^escuro$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^claro$/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /ativar modo escuro/i }));

    expect(document.documentElement).toHaveAttribute('data-theme-mode', 'dark');
    expect(window.localStorage.getItem(STORAGE_KEYS.themeMode)).toBe('dark');
    expect(screen.getByRole('button', { name: /ativar modo claro/i })).toBeInTheDocument();
  });

  it('restores dark mode from persisted preference on startup', () => {
    window.localStorage.setItem(STORAGE_KEYS.themeMode, 'dark');

    render(<App />);

    expect(document.documentElement).toHaveAttribute('data-theme-mode', 'dark');
    expect(screen.getByRole('button', { name: /ativar modo claro/i })).toBeInTheDocument();
  });
});
