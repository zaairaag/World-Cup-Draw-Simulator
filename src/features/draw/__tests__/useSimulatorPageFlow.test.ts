import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useSimulatorPageFlow } from '../hooks/useSimulatorPageFlow';

describe('useSimulatorPageFlow', () => {
  it('derives the empty state when no teams are selected', () => {
    const { result } = renderHook(() =>
      useSimulatorPageFlow({
        selectedTeamCount: 0,
        requiredTeamCount: 32,
        drawStatus: 'configured',
        hasResult: false,
        lastError: null,
        canRunDraw: false
      })
    );

    expect(result.current.pageState).toBe('empty');
    expect(result.current.primaryActionLabel).toBe('Iniciar sorteio');
    expect(result.current.isConfigurationEnabled).toBe(false);
    expect(result.current.primaryActionEnabled).toBe(false);
  });

  it('derives the selecting state while the setup is incomplete or invalid', () => {
    const { result } = renderHook(() =>
      useSimulatorPageFlow({
        selectedTeamCount: 12,
        requiredTeamCount: 32,
        drawStatus: 'configured',
        hasResult: false,
        lastError: 'Ainda faltam participantes.',
        canRunDraw: false
      })
    );

    expect(result.current.pageState).toBe('selecting');
    expect(result.current.selectionProgressLabel).toBe('12 / 32 seleções');
    expect(result.current.isConfigurationEnabled).toBe(true);
    expect(result.current.showInlineSwapError).toBe(false);
  });

  it('derives the ready state when the draw can run', () => {
    const { result } = renderHook(() =>
      useSimulatorPageFlow({
        selectedTeamCount: 32,
        requiredTeamCount: 32,
        drawStatus: 'configured',
        hasResult: false,
        lastError: null,
        canRunDraw: true
      })
    );

    expect(result.current.pageState).toBe('ready');
    expect(result.current.primaryActionLabel).toBe('Iniciar sorteio');
    expect(result.current.primaryActionEnabled).toBe(true);
    expect(result.current.visibleErrorMessage).toBeNull();
  });

  it('derives the drawing state while the engine is running', () => {
    const { result } = renderHook(() =>
      useSimulatorPageFlow({
        selectedTeamCount: 32,
        requiredTeamCount: 32,
        drawStatus: 'loading',
        hasResult: false,
        lastError: null,
        canRunDraw: false
      })
    );

    expect(result.current.pageState).toBe('drawing');
    expect(result.current.primaryActionLabel).toBe('Sorteando grupos...');
    expect(result.current.primaryActionEnabled).toBe(false);
  });

  it('derives the result state after a successful draw', () => {
    const { result } = renderHook(() =>
      useSimulatorPageFlow({
        selectedTeamCount: 32,
        requiredTeamCount: 32,
        drawStatus: 'drawn',
        hasResult: true,
        lastError: null,
        canRunDraw: true
      })
    );

    expect(result.current.pageState).toBe('result');
    expect(result.current.primaryActionLabel).toBe('Re-sortear');
    expect(result.current.primaryActionEnabled).toBe(true);
  });

  it('derives the swap error state when a rendered result also has an error', () => {
    const { result } = renderHook(() =>
      useSimulatorPageFlow({
        selectedTeamCount: 32,
        requiredTeamCount: 32,
        drawStatus: 'drawn',
        hasResult: true,
        lastError: 'A troca selecionada viola a regra de confederação ativa.',
        canRunDraw: true
      })
    );

    expect(result.current.pageState).toBe('swap_error');
    expect(result.current.showInlineSwapError).toBe(true);
    expect(result.current.primaryActionLabel).toBe('Re-sortear');
    expect(result.current.visibleErrorMessage).toBe(
      'A troca selecionada viola a regra de confederação ativa.'
    );
  });

  it('surfaces a draw error even when the simulator falls back to the ready state', () => {
    const { result } = renderHook(() =>
      useSimulatorPageFlow({
        selectedTeamCount: 32,
        requiredTeamCount: 32,
        drawStatus: 'configured',
        hasResult: false,
        lastError: 'Não foi possível gerar um sorteio válido para a configuração atual.',
        canRunDraw: true
      })
    );

    expect(result.current.pageState).toBe('ready');
    expect(result.current.showInlineSwapError).toBe(false);
    expect(result.current.visibleErrorMessage).toBe(
      'Não foi possível gerar um sorteio válido para a configuração atual.'
    );
  });

  it('drops back to selecting when a stale result disappears after setup changes', () => {
    const { result, rerender } = renderHook(
      ({ hasResult, canRunDraw, selectedTeamCount }) =>
        useSimulatorPageFlow({
          selectedTeamCount,
          requiredTeamCount: 32,
          drawStatus: 'configured',
          hasResult,
          lastError: null,
          canRunDraw
        }),
      {
        initialProps: {
          hasResult: true,
          canRunDraw: true,
          selectedTeamCount: 32
        }
      }
    );

    expect(result.current.pageState).toBe('result');

    rerender({
      hasResult: false,
      canRunDraw: false,
      selectedTeamCount: 28
    });

    expect(result.current.pageState).toBe('selecting');
    expect(result.current.primaryActionEnabled).toBe(false);
  });
});
