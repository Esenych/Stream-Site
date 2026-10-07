'use client';

import { useEffect, useState } from 'react';
import { USERS, UserId, ColumnConfig, Proposal } from '@/types';
import { useProposals } from '@/hooks/useProposals';
import { useArchive } from '@/hooks/useArchive';
import { useDropped } from '@/hooks/useDropped'; // <-- Хук брошенных
import { Header } from '@/components/Header';
import { UserSelectModal } from '@/components/UserSelectModal';
import { TutorialModal } from '@/components/TutorialModal';
import { BoardTabs } from '@/components/BoardTabs';
import { CurrentGames } from '@/components/CurrentGames';
import { TopProposals } from '@/components/TopProposals';
import { ProposalColumn } from '@/components/ProposalColumn';
import { ConfirmModal } from '@/components/ConfirmModal';
import { CompleteModal } from '@/components/CompleteModal';
import { ArchiveModal } from '@/components/ArchiveModal';
import { DroppedModal } from '@/components/DroppedModal'; // <-- Модалка брошенных
import { AlertToast } from '@/components/AlertToast';

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState<UserId | null>(null);
  const [activeTab, setActiveTab] = useState<UserId>('stas');
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isDroppedOpen, setIsDroppedOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Стейты модалок
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string; type?: 'proposal' | 'archive' | 'dropped' } | null>(null);
  const [gameToComplete, setGameToComplete] = useState<Proposal | null>(null);
  const [gameToDrop, setGameToDrop] = useState<Proposal | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Хуки данных
  const { proposals, toggleVote, addProposal, deleteProposal, promoteToActive, resetVotes, toggleDropVote } = useProposals();
  const { archive, completeGame, deleteArchiveItem } = useArchive();
  const { dropped, dropGame, deleteDroppedItem } = useDropped();

  // При заходе: проверяем юзера и ПРИНУДИТЕЛЬНО показываем справку v2
  useEffect(() => {
    const savedUser = localStorage.getItem('gv_current_user') as UserId | null;
    if (savedUser && USERS.some((u) => u.id === savedUser)) {
      setCurrentUserId(savedUser);
    }

    const hasSeenV2 = localStorage.getItem('gv_tutorial_v2_seen');
    if (!hasSeenV2) {
      setIsTutorialOpen(true);
    }

    setIsClientLoaded(true);
  }, []);

  const handleSelectUser = (id: UserId) => {
    setCurrentUserId(id);
    localStorage.setItem('gv_current_user', id);
  };

  const handleCloseTutorial = () => {
    setIsTutorialOpen(false);
    localStorage.setItem('gv_tutorial_v2_seen', 'true');
  };

  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      const pass = prompt('Введите пароль админа:');
      if (pass === '1337') {
        setIsAdmin(true);
      } else if (pass !== null) {
        alert('Неверный пароль');
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'archive') {
      await deleteArchiveItem(itemToDelete.id);
    } else if (itemToDelete.type === 'dropped') {
      await deleteDroppedItem(itemToDelete.id);
    } else {
      await deleteProposal(itemToDelete.id);
    }
    setItemToDelete(null);
  };

  const handleConfirmComplete = async (rating: number) => {
    if (!gameToComplete) return;
    await completeGame(gameToComplete.id, activeTab, gameToComplete.title, rating);
    setGameToComplete(null);
  };

  const handleConfirmDrop = async () => {
    if (!gameToDrop) return;
    await dropGame(gameToDrop.id, activeTab, gameToDrop.title, gameToDrop.votes);
    setGameToDrop(null);
  };

  const handleAdd = async (colId: string, title: string) => {
    const res = await addProposal(activeTab, colId, title);
    if (!res.success && res.error) {
      setToastMessage(res.error);
      setTimeout(() => setToastMessage(null), 5000);
    }
    return res.success;
  };

  const currentUser = USERS.find((u) => u.id === currentUserId)?.name || '';
  const isOwner = currentUserId === activeTab;
  const canManageActive = isOwner || isAdmin;

  const currentColumns: ColumnConfig[] = [
    ...USERS.filter((user) => user.id !== activeTab).map((user) => ({
      id: user.id,
      label: `ПРЕДЛОЖЕНИЯ ${user.genitive.toUpperCase()}`,
      color: user.color,
    })),
    {
      id: 'parallel',
      label: 'ЛИЧНЫЕ ПРЕДЛОЖЕНИЯ',
      color: 'border-t-rose-500',
    },
  ];

  const currentTabGames = proposals.filter((p) => p.tab === activeTab);
  const activeCurrentGames = currentTabGames.filter((p) => p.column_name === 'current');
  const currentTabArchiveCount = archive.filter((a) => a.tab === activeTab).length;
  const currentTabDroppedCount = dropped.filter((d) => d.tab === activeTab).length;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans p-4 md:p-8">
      <AlertToast message={toastMessage} onClose={() => setToastMessage(null)} />

      {isClientLoaded && !currentUserId && <UserSelectModal onSelect={handleSelectUser} />}

      {/* Обучение со всеми правилами (откроется у всех автоматически) */}
      <TutorialModal isOpen={isTutorialOpen} onClose={handleCloseTutorial} />

      {/* Оценка пройденной игры */}
      <CompleteModal
        isOpen={!!gameToComplete}
        gameTitle={gameToComplete?.title || ''}
        onConfirm={handleConfirmComplete}
        onCancel={() => setGameToComplete(null)}
      />

      {/* Модалка Архива */}
      <ArchiveModal
        isOpen={isArchiveOpen}
        activeTab={activeTab}
        archive={archive}
        canManage={canManageActive}
        onClose={() => setIsArchiveOpen(false)}
        onDelete={(id, title) => setItemToDelete({ id, title, type: 'archive' })}
      />

      {/* Модалка Брошенных */}
      <DroppedModal
        isOpen={isDroppedOpen}
        activeTab={activeTab}
        dropped={dropped}
        canManage={canManageActive}
        onClose={() => setIsDroppedOpen(false)}
        onDelete={(id, title) => setItemToDelete({ id, title, type: 'dropped' })}
      />

      {/* Подтверждение удаления */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Удаление игры"
        gameName={itemToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Подтверждение дропа */}
      <ConfirmModal
        isOpen={!!gameToDrop}
        title="Дроп игры со стрима"
        gameName={gameToDrop?.title || ''}
        description="Набрано 2+ голоса за дроп. Отправить игру в список «Брошенные»?"
        confirmText="Дропнуть"
        onConfirm={handleConfirmDrop}
        onCancel={() => setGameToDrop(null)}
      />

      {/* Подтверждение сброса голосов */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Сброс голосования"
        gameName={`Доска: ${USERS.find((u) => u.id === activeTab)?.name}`}
        description="Все текущие голоса на этой доске будут сброшены в ноль. Переголосовать?"
        confirmText="Сбросить"
        onConfirm={async () => {
          await resetVotes(activeTab);
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Шапка */}
      <Header
        currentUser={currentUser}
        isAdmin={isAdmin}
        archiveCount={currentTabArchiveCount}
        droppedCount={currentTabDroppedCount}
        onToggleAdmin={handleToggleAdmin}
        onResetUser={() => {
          setCurrentUserId(null);
          localStorage.removeItem('gv_current_user');
        }}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenArchive={() => setIsArchiveOpen(true)}
        onOpenDropped={() => setIsDroppedOpen(true)}
      />

      {/* Вкладки досок */}
      <BoardTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Текущая игра с голосованием за ДРОП */}
      <CurrentGames
        activeTab={activeTab}
        currentUserId={currentUserId}
        currentUser={currentUser}
        isOwner={isOwner}
        isAdmin={isAdmin}
        games={activeCurrentGames}
        onAdd={(title) => handleAdd('current', title)}
        onDelete={(id, title) => setItemToDelete({ id, title, type: 'proposal' })}
        onComplete={(game) => setGameToComplete(game)}
        onToggleDropVote={(game) => toggleDropVote(game, currentUser)}
        onDropGame={(game) => setGameToDrop(game)}
      />

      {/* Топ голосования + Явка + Сброс */}
      <TopProposals
        proposals={currentTabGames}
        activeTab={activeTab}
        isOwner={isOwner}
        isAdmin={isAdmin}
        onPromote={(item) => promoteToActive(activeTab, item.id)}
        onResetVotes={() => setIsResetConfirmOpen(true)}
      />

      {/* Колонки предложений */}
      <div className="max-w-7xl mx-auto mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentColumns.map((col) => {
          const colProposals = currentTabGames
            .filter((p) => p.column_name === col.id)
            .sort((a, b) => b.votes.length - a.votes.length);

          const canManage =
            isAdmin ||
            (col.id === 'parallel'
              ? currentUserId === activeTab
              : currentUserId === col.id);

          return (
            <ProposalColumn
              key={col.id}
              column={col}
              proposals={colProposals}
              currentUser={currentUser}
              canManage={canManage}
              onVote={(item) => toggleVote(item, currentUser)}
              onDelete={(id, title) => setItemToDelete({ id, title, type: 'proposal' })}
              onAdd={(colId, title) => handleAdd(colId, title)}
            />
          );
        })}
      </div>
    </main>
  );
}
