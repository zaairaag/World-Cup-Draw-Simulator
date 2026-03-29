import { useMemo } from 'react';

import type { DrawStatus, SimulatorPageState } from '../../../types';

interface UseSimulatorPageFlowArgs {
  selectedTeamCount: number;
  requiredTeamCount: number;
  drawStatus: DrawStatus;
  hasResult: boolean;
  lastError: string | null;
  canRunDraw: boolean;
}

interface SimulatorPageFlow {
  pageState: SimulatorPageState;
  primaryActionLabel: string;
  primaryActionEnabled: boolean;
  selectionProgressLabel: string;
  isConfigurationEnabled: boolean;
  visibleErrorMessage: string | null;
  showInlineSwapError: boolean;
}

function resolvePageState({
  selectedTeamCount,
  drawStatus,
  hasResult,
  lastError,
  canRunDraw
}: UseSimulatorPageFlowArgs): SimulatorPageState {
  if (drawStatus === 'loading') {
    return 'drawing';
  }

  if (hasResult && lastError) {
    return 'swap_error';
  }

  if (hasResult) {
    return 'result';
  }

  if (selectedTeamCount === 0) {
    return 'empty';
  }

  if (canRunDraw) {
    return 'ready';
  }

  return 'selecting';
}

function resolvePrimaryActionLabel(pageState: SimulatorPageState) {
  if (pageState === 'drawing') {
    return 'Sorteando grupos...';
  }

  if (pageState === 'result' || pageState === 'swap_error') {
    return 'Re-sortear';
  }

  return 'Iniciar sorteio';
}

export function useSimulatorPageFlow(args: UseSimulatorPageFlowArgs): SimulatorPageFlow {
  return useMemo(() => {
    const pageState = resolvePageState(args);
    const isConfigurationEnabled = args.selectedTeamCount > 0;

    return {
      pageState,
      primaryActionLabel: resolvePrimaryActionLabel(pageState),
      primaryActionEnabled:
        pageState === 'ready' || pageState === 'result' || pageState === 'swap_error',
      selectionProgressLabel: `${args.selectedTeamCount} / ${args.requiredTeamCount} seleções`,
      isConfigurationEnabled,
      visibleErrorMessage: args.lastError,
      showInlineSwapError: pageState === 'swap_error'
    };
  }, [args]);
}
