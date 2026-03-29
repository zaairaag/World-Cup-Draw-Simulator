import { DRAW_DEFAULTS } from '../../../constants';
import type { DrawAction, DrawState } from '../../../types';
import { isGroupValidForPolicy } from '../domain/confederationPolicy';

export const initialDrawState: DrawState = {
  settings: {
    ...DRAW_DEFAULTS
  },
  result: null,
  status: 'configured',
  lastError: null,
  undoResult: null
};

function settingsChanged(
  currentSettings: DrawState['settings'],
  nextSettings: DrawState['settings']
) {
  return (
    currentSettings.numberOfGroups !== nextSettings.numberOfGroups ||
    currentSettings.teamsPerGroup !== nextSettings.teamsPerGroup ||
    currentSettings.confederationPolicy !== nextSettings.confederationPolicy
  );
}

export function drawReducer(state: DrawState, action: DrawAction): DrawState {
  switch (action.type) {
    case 'UPDATE_SETTINGS': {
      const nextSettings = {
        ...state.settings,
        ...action.payload
      };

      if (!settingsChanged(state.settings, nextSettings)) {
        return state;
      }

      return {
        ...state,
        settings: nextSettings,
        result: null,
        status: 'configured',
        lastError: null,
        undoResult: null
      };
    }
    case 'SET_LOADING':
      return {
        ...state,
        status: 'loading',
        lastError: null,
        undoResult: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        result: null,
        lastError: action.payload,
        status: 'configured',
        undoResult: null
      };
    case 'SET_RESULT':
      return {
        ...state,
        settings: action.payload.settings,
        result: action.payload,
        status: 'drawn',
        lastError: null,
        undoResult: null
      };
    case 'SWAP_TEAMS': {
      if (state.result === null) {
        return {
          ...state,
          lastError: 'Faça um sorteio antes de tentar trocar equipes.'
        };
      }

      const { sourceGroupId, sourceTeamId, targetGroupId, targetTeamId } = action.payload;

      if (sourceGroupId === targetGroupId && sourceTeamId === targetTeamId) {
        return state;
      }

      if (sourceGroupId === targetGroupId) {
        return {
          ...state,
          lastError: 'Escolha dois grupos diferentes para trocar equipes.'
        };
      }

      const sourceGroupIndex = state.result.groups.findIndex((group) => group.id === sourceGroupId);
      const targetGroupIndex = state.result.groups.findIndex((group) => group.id === targetGroupId);

      if (sourceGroupIndex < 0 || targetGroupIndex < 0) {
        return {
          ...state,
          lastError: 'Escolha grupos válidos antes de confirmar a troca.'
        };
      }

      const sourceGroup = state.result.groups[sourceGroupIndex];
      const targetGroup = state.result.groups[targetGroupIndex];

      if (sourceGroup === undefined || targetGroup === undefined) {
        return {
          ...state,
          lastError: 'Escolha equipes válidas antes de confirmar a troca.'
        };
      }

      const sourceTeamIndex = sourceGroup.teams.findIndex((team) => team.id === sourceTeamId);
      const targetTeamIndex = targetGroup.teams.findIndex((team) => team.id === targetTeamId);

      if (sourceTeamIndex < 0 || targetTeamIndex < 0) {
        return {
          ...state,
          lastError: 'Escolha equipes válidas antes de confirmar a troca.'
        };
      }

      const sourceTeam = sourceGroup.teams[sourceTeamIndex];
      const targetTeam = targetGroup.teams[targetTeamIndex];

      if (sourceTeam === undefined || targetTeam === undefined) {
        return {
          ...state,
          lastError: 'Escolha equipes válidas antes de confirmar a troca.'
        };
      }

      const nextSourceGroup = {
        ...sourceGroup,
        teams: sourceGroup.teams.map((team, teamIndex) =>
          teamIndex === sourceTeamIndex ? targetTeam : team
        )
      };
      const nextTargetGroup = {
        ...targetGroup,
        teams: targetGroup.teams.map((team, teamIndex) =>
          teamIndex === targetTeamIndex ? sourceTeam : team
        )
      };

      if (
        !isGroupValidForPolicy(nextSourceGroup, state.result.settings.confederationPolicy) ||
        !isGroupValidForPolicy(nextTargetGroup, state.result.settings.confederationPolicy)
      ) {
        return {
          ...state,
          lastError: 'A troca selecionada viola a regra de confederação ativa.'
        };
      }

      const groups = state.result.groups.map((group, groupIndex) => {
        if (groupIndex === sourceGroupIndex) {
          return nextSourceGroup;
        }

        if (groupIndex === targetGroupIndex) {
          return nextTargetGroup;
        }

        return group;
      });

      return {
        ...state,
        result: {
          ...state.result,
          groups
        },
        lastError: null,
        undoResult: state.result
      };
    }
    case 'UNDO_LAST_SWAP':
      if (state.undoResult === null) {
        return state;
      }

      return {
        ...state,
        result: state.undoResult,
        lastError: null,
        undoResult: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        lastError: null
      };
    case 'RESET':
      return {
        ...state,
        result: null,
        status: 'configured',
        lastError: null,
        undoResult: null
      };
    case 'RESTORE_STATE':
      return {
        ...action.payload,
        undoResult: action.payload.undoResult ?? null
      };
    default:
      return state;
  }
}
