import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';

import { appTheme } from '../../theme/theme';
import { localTeamRepository } from '../../features/teams/repositories/localTeamRepository';
import { ResultActionsFooter } from './ResultActionsFooter';
import { SelectionOverlay } from './SelectionOverlay';

const catalogResult = localTeamRepository.loadCatalog();

if (!catalogResult.ok) {
  throw new Error(catalogResult.error);
}

const firstTeam = catalogResult.data[0];
const secondTeam = catalogResult.data[1];

if (!firstTeam || !secondTeam) {
  throw new Error('Expected at least two teams in the catalog.');
}

describe('draw page sections', () => {
  it('renders the selection overlay with the current participant counts', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <SelectionOverlay
          query=""
          isOpen={false}
          activeIndex={-1}
          suggestionTeams={[]}
          filteredTeams={[firstTeam]}
          quickFilter="all"
          selectedTeams={[firstTeam, secondTeam]}
          selectedIds={[firstTeam.id, secondTeam.id]}
          requiredTeamCount={32}
          availableTeamsEmptyMessage="Busque seleções para adicionar à lista."
          inputRef={undefined}
          onClose={() => undefined}
          onQueryChange={() => undefined}
          onKeyDown={() => undefined}
          onSelectTeam={() => undefined}
          onQuickFilterChange={() => undefined}
          onOpenSuggestions={() => undefined}
          onCloseSuggestions={() => undefined}
          onRemoveTeam={() => undefined}
          onClearSelection={() => undefined}
          onFillSelection={() => undefined}
        />
      </ThemeProvider>
    );

    expect(screen.getByRole('heading', { name: /gestão de participantes/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /seleções confirmadas \(2\/32\)/i })
    ).toBeInTheDocument();
  });

  it('routes footer actions through the provided callbacks', async () => {
    const onShare = vi.fn();
    const onRestart = vi.fn();
    const onSave = vi.fn();
    const user = userEvent.setup();

    render(
      <ThemeProvider theme={appTheme}>
        <ResultActionsFooter onShare={onShare} onRestart={onRestart} onSave={onSave} />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: /compartilhar/i }));
    await user.click(screen.getByRole('button', { name: /re-sortear/i }));
    await user.click(screen.getByRole('button', { name: /salvar resultado/i }));

    expect(onShare).toHaveBeenCalledTimes(1);
    expect(onRestart).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
