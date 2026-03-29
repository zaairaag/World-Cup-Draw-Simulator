import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AppProviders } from './AppProviders';
import { AppRoutes } from './routes';

describe('AppRoutes', () => {
  it('renders the draw page on the root route', () => {
    render(
      <AppProviders>
        <MemoryRouter
          initialEntries={['/']}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <AppRoutes />
        </MemoryRouter>
      </AppProviders>
    );

    expect(screen.getByRole('heading', { name: /simulador do sorteio/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /monte a fase de grupos com 32 seleções, ajuste as regras do sorteio e gere combinações automáticas para revisar os grupos/i
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /simulador/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /participantes/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /opções/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sortear grupos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /editar lista/i })).toBeInTheDocument();
    expect(screen.queryByText(/arquitetura definida/i)).not.toBeInTheDocument();
  });
});
