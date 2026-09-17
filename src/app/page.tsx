'use client';

import { useEffect, useState } from 'react';
import { USERS, UserId, ColumnConfig } from '@/types';
import { useProposals } from '@/hooks/useProposals';
import { Header } from '@/components/Header';
import { UserSelectModal } from '@/components/UserSelectModal';
import { TutorialModal } from '@/components/TutorialModal'; // <-- Импорт
import { BoardTabs } from '@/components/BoardTabs';
import { CurrentGames } from '@/components/CurrentGames';
import { TopProposals } from '@/components/TopProposals';
import { ProposalColumn } from '@/components/ProposalColumn';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState<UserId | null>(null);
  const [activeTab, setActiveTab] = useState<UserId>('stas');
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false); // Стейт модалки обучения

  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  const { proposals, toggleVote, addProposal, deleteProposal, promoteToActive } = useProposals();

  useEffect(() => {
    const savedUser = localStorage.getItem('gv_current_user') as UserId | null;
    if (savedUser && USERS.some((u) => u.id === savedUser)) {
      setCurrentUserId(savedUser);
    }
    setIsClientLoaded(true);
  }, []);

  // При выборе пользователя проверяем, видел ли он обучение
  const handleSelectUser = (id: UserId) => {
    setCurrentUserId(id);
    localStorage.setItem('gv_current_user', id);

    const hasSeenTutorial = localStorage.getItem('gv_tutorial_seen');
    if (!hasSeenTutorial) {
      setIsTutorialOpen(true);
    }
  };

  const handleCloseTutorial = () => {
    setIsTutorialOpen(false);
    localStorage.setItem('gv_tutorial_seen', 'true');
  };

  const handleResetUser = () => {
    setCurrentUserId(null);
    localStorage.removeItem('gv_current_user');
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    await deleteProposal(itemToDelete.id);
    setItemToDelete(null);
  };

  const currentUser = USERS.find((u) => u.id === currentUserId)?.name || '';
  const isOwner = currentUserId === activeTab;

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

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans p-4 md:p-8">
      {/* 1. Выбор роли при первом заходе */}
      {isClientLoaded && !currentUserId && <UserSelectModal onSelect={handleSelectUser} />}

      {/* 2. Модалка с обучением */}
      <TutorialModal isOpen={isTutorialOpen} onClose={handleCloseTutorial} />

      {/* 3. Модалка подтверждения удаления */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Удаление предложения"
        gameName={itemToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Шапка с кнопкой справки */}
      <Header
        currentUser={currentUser}
        onResetUser={handleResetUser}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      <BoardTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      <CurrentGames
        activeTab={activeTab}
        isOwner={isOwner}
        games={activeCurrentGames}
        onAdd={(title) => addProposal(activeTab, 'current', title)}
        onDelete={(id, title) => setItemToDelete({ id, title })}
      />

      <TopProposals
        proposals={currentTabGames}
        activeTab={activeTab}
        isOwner={isOwner}
        onPromote={(item) => promoteToActive(activeTab, item.id)}
      />

      <div className="max-w-7xl mx-auto mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentColumns.map((col) => {
          const colProposals = currentTabGames
            .filter((p) => p.column_name === col.id)
            .sort((a, b) => b.votes.length - a.votes.length);

          const canManage =
            col.id === 'parallel'
              ? currentUserId === activeTab
              : currentUserId === col.id;

          return (
            <ProposalColumn
              key={col.id}
              column={col}
              proposals={colProposals}
              currentUser={currentUser}
              canManage={canManage}
              onVote={(item) => toggleVote(item, currentUser)}
              onDelete={(id, title) => setItemToDelete({ id, title })}
              onAdd={(colId, title) => addProposal(activeTab, colId, title)}
            />
          );
        })}
      </div>
    </main>
  );
}
