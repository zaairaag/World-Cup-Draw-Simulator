import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from 'styled-components';
import { describe, expect, it } from 'vitest';

import { App } from './App';
import { AppProviders } from './AppProviders';
import { appTheme } from '../theme/theme';

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
});
