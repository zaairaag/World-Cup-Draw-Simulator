import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { createHydratedAppState } from '../app/createHydratedAppState';
import {
  DESKTOP_STICKY_STACK_HEIGHT,
  MOBILE_STICKY_STACK_HEIGHT
} from '../components/layout/stickyHeights';
import {
  DrawConfigurationPanel,
  DrawResultsPanel,
  useDrawFlow,
  useSimulatorPageFlow
} from '../features/draw';
import {
  createSuggestedSavedDrawLabel,
  createSavedDrawEntry,
  loadSavedDrawHistory,
  saveSavedDrawHistory
} from '../features/draw/history/savedDrawHistory';
import { compareSavedDraws } from '../features/draw/history/compareSavedDraws';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { ReadyScene } from '../features/draw/components/ReadyScene';
import { SavedDrawsComparisonTab } from './draw-page/SavedDrawsComparisonTab';
import { SavedDrawsHistoryTab } from './draw-page/SavedDrawsHistoryTab';
import { SaveDrawModal } from '../features/draw/components/SaveDrawModal';
import { useSessionActivity } from '../features/draw/hooks/useSessionActivity';
import { useTeamSearch } from '../features/teams/hooks/useTeamSearch';
import { useTeamSelection } from '../features/teams/hooks/useTeamSelection';
import { shareDrawResult } from '../features/draw/utils/shareDrawResult';
import type { DrawSettings } from '../types';
import { ResultActionsFooter } from './draw-page/ResultActionsFooter';
import { SelectionOverlay } from './draw-page/SelectionOverlay';
import { downloadDrawResultJson, scrollToPageTopIfSupported } from './draw-page/drawPageBrowser';
import {
  getAvailableTeamsEmptyMessage,
  getSettingsChangeSummary,
  hasUnsavedSession
} from './draw-page/drawPageUtils';

type MainTabId = 'simulator' | 'selection' | 'options' | 'history' | 'comparison';
type ComparisonSide = 'left' | 'right';

interface DrawPageProps {
  searchRequestToken: number;
}

export function DrawPage({ searchRequestToken }: DrawPageProps) {
  const [activeTab, setActiveTab] = useState<MainTabId>('simulator');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousSearchRequestTokenRef = useRef(searchRequestToken);
  const shouldFocusSearchRef = useRef(false);
  const {
    catalog,
    selectedIds,
    selectedTeams,
    selectTeam,
    deselectTeam,
    fillSelection,
    clearSelection,
    restoreSelection
  } = useTeamSelection();
  const [savedHistory, setSavedHistory] = useState(() => loadSavedDrawHistory());
  const [comparisonSelection, setComparisonSelection] = useState<{
    leftId: string | null;
    rightId: string | null;
  }>({
    leftId: null,
    rightId: null
  });
  const [pendingRestoreEntryId, setPendingRestoreEntryId] = useState<string | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [pendingSaveLabel, setPendingSaveLabel] = useState('');

  function handleSelectTeam(teamId: string) {
    if (selectedIds.includes(teamId)) {
      return;
    }

    selectTeam(teamId);

    const team = catalog.find((item) => item.id === teamId);
    addEntry(`Seleção ${team?.name ?? teamId} adicionada.`);
  }

  const {
    query,
    quickFilter,
    isOpen,
    activeIndex,
    filteredTeams,
    suggestionTeams,
    setQuickFilter,
    handleQueryChange,
    handleKeyDown,
    openSuggestions,
    closeSuggestions,
    selectTeam: selectTeamFromSearch
  } = useTeamSearch({
    teams: catalog,
    selectedIds,
    onSelectTeam: handleSelectTeam
  });

  const {
    settings,
    status,
    result,
    lastError,
    canUndoSwap,
    requiredTeamCount,
    validationMessage,
    canRunDraw,
    handleSettingsChange,
    runDraw,
    swapTeams,
    undoLastSwap,
    clearError,
    resetDrawSession,
    restoreDrawState,
    defaults: drawDefaults
  } = useDrawFlow(selectedTeams);

  const pageFlow = useSimulatorPageFlow({
    selectedTeamCount: selectedTeams.length,
    requiredTeamCount,
    drawStatus: status,
    hasResult: result !== null,
    lastError,
    canRunDraw
  });
  const { entries: activityEntries, addEntry, resetEntries } = useSessionActivity(6);
  const availableTeamsEmptyMessage = useMemo(
    () =>
      getAvailableTeamsEmptyMessage({
        hasSearchQuery: query.trim().length > 0,
        filteredTeamCount: filteredTeams.length,
        selectedTeamCount: selectedIds.length,
        catalogTeamCount: catalog.length,
        quickFilter
      }),
    [query, filteredTeams.length, selectedIds.length, catalog.length, quickFilter]
  );

  useEffect(() => {
    if (previousSearchRequestTokenRef.current === searchRequestToken) {
      return;
    }

    previousSearchRequestTokenRef.current = searchRequestToken;

    if (activeTab === 'selection') {
      searchInputRef.current?.focus();
      return;
    }

    shouldFocusSearchRef.current = true;
    setActiveTab('selection');
  }, [activeTab, searchRequestToken]);

  useEffect(() => {
    if (activeTab !== 'selection' || !shouldFocusSearchRef.current) {
      return;
    }

    shouldFocusSearchRef.current = false;
    searchInputRef.current?.focus();
  }, [activeTab]);

  function handleFillSelection() {
    const capacity = Math.min(requiredTeamCount, catalog.length);
    const addedCount = capacity - selectedTeams.length;

    if (addedCount <= 0) {
      return;
    }

    fillSelection(requiredTeamCount);

    if (capacity < requiredTeamCount) {
      addEntry(
        `Preenchimento automático adicionou ${addedCount} participantes. Total atual: ${capacity} de ${requiredTeamCount}.`
      );
      return;
    }

    addEntry(`Preenchimento automático concluiu ${capacity} participantes.`);
  }

  function handleSettingsChangeWithActivity(patch: Partial<DrawSettings>) {
    const changeSummary = getSettingsChangeSummary(settings, patch);

    handleSettingsChange(patch);

    if (changeSummary === null) {
      return;
    }

    addEntry(`Configuração alterada para ${changeSummary}.`);
  }

  function openSaveResultFlow() {
    if (result === null) {
      return;
    }

    const suggestedLabel = `Sorteio ${createSuggestedSavedDrawLabel(Date.now())}`;
    setPendingSaveLabel(suggestedLabel);
    setSaveModalOpen(true);
  }

  function handleConfirmSaveResult(label: string) {
    if (result === null || typeof window === 'undefined') {
      return;
    }

    downloadDrawResultJson(result, window, document);

    const entry = createSavedDrawEntry({
      label,
      selectedTeamIds: selectedIds,
      drawState: {
        settings,
        result,
        status,
        lastError,
        undoResult: null
      }
    });
    const nextHistory = [entry, ...savedHistory].slice(0, 8);
    const saveHistoryResult = saveSavedDrawHistory(nextHistory);

    if (!saveHistoryResult.ok) {
      addEntry('Não foi possível salvar o sorteio no histórico local.');
      setSaveModalOpen(false);
      return;
    }

    setSavedHistory(nextHistory);
    setSaveModalOpen(false);
    resetCurrentSession();
  }

  function handleCancelSaveResult() {
    setSaveModalOpen(false);
  }

  function resetCurrentSession() {
    clearSelection();
    resetDrawSession();
    resetEntries();
    setActiveTab('simulator');
  }

  function applyRestoreSavedDraw(entryId: string) {
    const entry = savedHistory.find((item) => item.id === entryId);

    if (!entry) {
      return;
    }

    const hydratedState = createHydratedAppState(catalog, entry.selectedTeamIds, entry.drawState);

    restoreSelection(hydratedState.teamsState.selectedIds);
    restoreDrawState(hydratedState.drawState);
    resetEntries();
    setActiveTab('simulator');
  }

  function handleRestoreSavedDraw(entryId: string) {
    const entry = savedHistory.find((item) => item.id === entryId);

    if (!entry) {
      return;
    }

    if (
      hasUnsavedSession({
        selectedTeamCount: selectedIds.length,
        result,
        settings,
        defaults: drawDefaults
      }) &&
      typeof window !== 'undefined'
    ) {
      setPendingRestoreEntryId(entryId);
      return;
    }

    applyRestoreSavedDraw(entryId);
  }

  function handleComparisonSelectionChange(side: ComparisonSide, entryId: string) {
    setComparisonSelection((current) => ({
      ...current,
      [`${side}Id`]: entryId || null
    }));
  }

  function handleConfirmReplaceSession() {
    if (pendingRestoreEntryId !== null) {
      applyRestoreSavedDraw(pendingRestoreEntryId);
    }
    setPendingRestoreEntryId(null);
  }

  function handleDismissReplaceSession() {
    setPendingRestoreEntryId(null);
  }

  async function handleShareResult() {
    if (result === null || typeof navigator === 'undefined') {
      return;
    }

    const shareApi =
      typeof navigator.share === 'function' ? navigator.share.bind(navigator) : undefined;
    const outcome = await shareDrawResult(result, shareApi, navigator.clipboard);

    if (outcome === 'shared') {
      addEntry('Resumo do sorteio compartilhado.');
      return;
    }

    if (outcome === 'clipboard') {
      addEntry('Resumo do sorteio copiado para a área de transferência.');
      return;
    }

    if (outcome === 'clipboard_failed') {
      addEntry(
        'Não foi possível copiar para a área de transferência. Verifique se o navegador permite cópia, se a página está em um contexto seguro (HTTPS), ou tente novamente.'
      );
      return;
    }

    if (outcome === 'unavailable') {
      addEntry('Compartilhamento indisponível neste navegador.');
    }
  }

  function handleRestartDraw() {
    if (typeof window !== 'undefined') {
      scrollToPageTopIfSupported(window);
    }

    runDraw();
  }

  const leftComparisonEntry = useMemo(
    () =>
      comparisonSelection.leftId === null
        ? null
        : (savedHistory.find((e) => e.id === comparisonSelection.leftId) ?? null),
    [comparisonSelection.leftId, savedHistory]
  );
  const rightComparisonEntry = useMemo(
    () =>
      comparisonSelection.rightId === null
        ? null
        : (savedHistory.find((e) => e.id === comparisonSelection.rightId) ?? null),
    [comparisonSelection.rightId, savedHistory]
  );
  const savedDrawComparison = useMemo(
    () =>
      leftComparisonEntry !== null && rightComparisonEntry !== null
        ? compareSavedDraws(leftComparisonEntry, rightComparisonEntry)
        : null,
    [leftComparisonEntry, rightComparisonEntry]
  );

  return (
    <PageLayout>
      <ConfirmModal
        open={pendingRestoreEntryId !== null}
        message="A sessão atual será substituída. Deseja continuar?"
        onConfirm={handleConfirmReplaceSession}
        onCancel={handleDismissReplaceSession}
      />
      <SaveDrawModal
        open={saveModalOpen}
        initialValue={pendingSaveLabel}
        onConfirm={handleConfirmSaveResult}
        onCancel={handleCancelSaveResult}
      />
      {(pageFlow.pageState === 'empty' ||
        pageFlow.pageState === 'selecting' ||
        pageFlow.pageState === 'ready' ||
        pageFlow.pageState === 'result' ||
        pageFlow.pageState === 'swap_error') && (
        <LocalNav aria-label="Seções do simulador">
          <LocalNavContainer role="tablist">
            <LocalTabButton
              role="tab"
              aria-selected={activeTab === 'selection'}
              $active={activeTab === 'selection'}
              onClick={() => setActiveTab('selection')}
            >
              PARTICIPANTES
            </LocalTabButton>
            <LocalTabButton
              role="tab"
              aria-selected={activeTab === 'options'}
              $active={activeTab === 'options'}
              onClick={() => setActiveTab('options')}
            >
              OPÇÕES
            </LocalTabButton>
            <LocalTabButton
              role="tab"
              aria-selected={activeTab === 'simulator'}
              $active={activeTab === 'simulator'}
              onClick={() => setActiveTab('simulator')}
            >
              SIMULADOR
            </LocalTabButton>
            <LocalTabButton
              role="tab"
              aria-selected={activeTab === 'history'}
              $active={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
            >
              HISTÓRICO
            </LocalTabButton>
            <LocalTabButton
              role="tab"
              aria-selected={activeTab === 'comparison'}
              $active={activeTab === 'comparison'}
              onClick={() => setActiveTab('comparison')}
            >
              COMPARAR
            </LocalTabButton>
          </LocalNavContainer>
        </LocalNav>
      )}

      <ContentArea role="tabpanel" aria-label={activeTab}>
        {activeTab === 'simulator' && (
          <>
            {pageFlow.pageState === 'empty' ||
            pageFlow.pageState === 'selecting' ||
            pageFlow.pageState === 'ready' ? (
              <ReadyScene
                selectedTeams={selectedTeams}
                requiredTeamCount={requiredTeamCount}
                settings={settings}
                validationMessage={
                  selectedTeams.length === requiredTeamCount ? validationMessage : null
                }
                errorMessage={pageFlow.visibleErrorMessage}
                actionDisabled={!pageFlow.primaryActionEnabled}
                onRunDraw={runDraw}
                onEditSelection={() => setActiveTab('selection')}
                activityEntries={activityEntries}
              />
            ) : null}

            {(pageFlow.pageState === 'drawing' ||
              pageFlow.pageState === 'result' ||
              pageFlow.pageState === 'swap_error') && (
              <DrawResultsPanel
                status={status}
                result={result}
                error={pageFlow.visibleErrorMessage}
                canUndoSwap={canUndoSwap}
                onUndoLastSwap={undoLastSwap}
                onSwapTeams={swapTeams}
                onClearError={clearError}
              />
            )}
          </>
        )}

        {activeTab === 'selection' && (
          <SelectionOverlay
            query={query}
            isOpen={isOpen}
            activeIndex={activeIndex}
            suggestionTeams={suggestionTeams}
            filteredTeams={filteredTeams}
            quickFilter={quickFilter}
            selectedTeams={selectedTeams}
            selectedIds={selectedIds}
            requiredTeamCount={requiredTeamCount}
            availableTeamsEmptyMessage={availableTeamsEmptyMessage}
            inputRef={searchInputRef}
            onClose={() => setActiveTab('simulator')}
            onQueryChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            onSelectTeam={selectTeamFromSearch}
            onQuickFilterChange={setQuickFilter}
            onOpenSuggestions={openSuggestions}
            onCloseSuggestions={closeSuggestions}
            onRemoveTeam={deselectTeam}
            onClearSelection={clearSelection}
            onFillSelection={handleFillSelection}
          />
        )}

        {activeTab === 'options' && (
          <ExtendedOptionsView>
            <OptionsHeader>
              <OptionsTitle>Opções Detalhadas</OptionsTitle>
              <OptionsDescription>
                Ajuste a quantidade de grupos, equipes por grupo e a regra de confederação.
              </OptionsDescription>
            </OptionsHeader>

            <DrawConfigurationPanel
              settings={settings}
              selectedTeamCount={selectedTeams.length}
              requiredTeamCount={requiredTeamCount}
              status={status}
              validationMessage={validationMessage}
              isConfigurationEnabled={pageFlow.isConfigurationEnabled}
              onSettingsChange={handleSettingsChangeWithActivity}
            />
          </ExtendedOptionsView>
        )}

        {activeTab === 'history' && (
          <SavedDrawsHistoryTab
            savedHistory={savedHistory}
            onRestoreSavedDraw={handleRestoreSavedDraw}
          />
        )}

        {activeTab === 'comparison' && (
          <SavedDrawsComparisonTab
            savedHistory={savedHistory}
            comparisonSelection={comparisonSelection}
            comparison={savedDrawComparison}
            onComparisonSelectionChange={handleComparisonSelectionChange}
            onRestoreSavedDraw={handleRestoreSavedDraw}
          />
        )}
      </ContentArea>

      {activeTab === 'simulator' &&
        (pageFlow.pageState === 'result' || pageFlow.pageState === 'swap_error') && (
          <ResultActionsFooter
            onShare={() => void handleShareResult()}
            onRestart={handleRestartDraw}
            onSave={openSaveResultFlow}
          />
        )}
    </PageLayout>
  );
}

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const LocalNav = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 2px solid ${({ theme }) => theme.colors.line};
  margin-bottom: 0px;
  position: sticky;
  top: ${DESKTOP_STICKY_STACK_HEIGHT}px;
  z-index: 30;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    top: ${MOBILE_STICKY_STACK_HEIGHT}px;
    margin-bottom: 0px;
  }
`;

const LocalNavContainer = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  padding: 0 16px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  -webkit-overflow-scrolling: touch;
`;

const LocalTabButton = styled.button<{ $active: boolean }>`
  height: 56px;
  padding: 0 24px;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? '900' : '600')};
  color: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.textMuted)};
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 4px;
    background-color: ${({ theme }) => theme.colors.accent};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transition: transform 0.2s ease-in-out;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 48px;
    font-size: 13px;
    padding: 0 16px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 0 12px;
    font-size: 12px;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 0px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 24px;
  }
`;

const ExtendedOptionsView = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 48px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.line};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 24px 16px;
    border-radius: 0;
    gap: 24px;
  }
`;

const OptionsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionsTitle = styled.h2`
  font-size: 32px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
  }
`;

const OptionsDescription = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.secondary};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
  }
`;
