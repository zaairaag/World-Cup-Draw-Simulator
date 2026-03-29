import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent, RefObject } from 'react';
import { useId } from 'react';
import styled from 'styled-components';

import type { Team } from '../../../types';

interface TeamSearchComboboxProps {
  query: string;
  isOpen: boolean;
  activeIndex: number;
  teams: Team[];
  onQueryChange: (query: string) => void;
  onKeyDown: (key: string) => void;
  onSelectTeam: (teamId: string) => void;
  onOpen: () => void;
  onClose: () => void;
  inputRef?: RefObject<HTMLInputElement>;
}

interface SuggestionOptionProps {
  optionId: string;
  team: Team;
  isActive: boolean;
  onSelectTeam: (teamId: string) => void;
}

function SuggestionOption({ optionId, team, isActive, onSelectTeam }: SuggestionOptionProps) {
  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  function handleClick() {
    onSelectTeam(team.id);
  }

  return (
    <SuggestionButton
      id={optionId}
      type="button"
      role="option"
      aria-selected={isActive}
      $isActive={isActive}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <span>{team.name}</span>
      <SuggestionCode>{team.code}</SuggestionCode>
    </SuggestionButton>
  );
}

export function TeamSearchCombobox({
  query,
  isOpen,
  activeIndex,
  teams,
  onQueryChange,
  onKeyDown,
  onSelectTeam,
  onOpen,
  onClose,
  inputRef
}: TeamSearchComboboxProps) {
  const listboxId = useId();
  const showSuggestions = isOpen && teams.length > 0;

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget;

    if (!event.currentTarget.contains(nextTarget)) {
      onClose();
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      onKeyDown(event.key);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    onQueryChange(event.target.value);
  }

  const activeTeam = activeIndex >= 0 ? teams[activeIndex] : undefined;

  return (
    <Wrapper onBlur={handleBlur}>
      <SearchInput
        ref={inputRef}
        id="team-search-input"
        type="text"
        role="combobox"
        aria-label="Buscar seleções"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-controls={listboxId}
        aria-activedescendant={activeTeam ? `${listboxId}-${activeTeam.id}` : undefined}
        placeholder="Digite o nome ou o código da seleção"
        value={query}
        onChange={handleInputChange}
        onFocus={onOpen}
        onKeyDown={handleInputKeyDown}
      />

      {showSuggestions ? (
        <SuggestionList id={listboxId} role="listbox" aria-label="Sugestões de seleções">
          {teams.map((team, index) => (
            <li key={team.id}>
              <SuggestionOption
                optionId={`${listboxId}-${team.id}`}
                team={team}
                isActive={index === activeIndex}
                onSelectTeam={onSelectTeam}
              />
            </li>
          ))}
        </SuggestionList>
      ) : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 0 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
  }

  &:focus {
    background-color: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.accentDark};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accentSoft};
    outline: none;
  }
`;

const SuggestionList = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 50;
  margin: 0;
  padding: 8px;
  list-style: none;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.line};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 240px;
  overflow-y: auto;
`;

const SuggestionButton = styled.button<{ $isActive: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.background : 'transparent'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  span:first-child {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const SuggestionCode = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  background-color: ${({ theme }) => theme.colors.surfaceMuted};
  padding: 2px 6px;
  border-radius: 4px;
`;
