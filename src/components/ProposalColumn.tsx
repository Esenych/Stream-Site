import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Proposal, ColumnConfig } from '@/types';
import { ProposalCard } from './ProposalCard';

interface Props {
  column: ColumnConfig;
  proposals: Proposal[];
  currentUser: string;
  canManage: boolean; // может ли юзер добавлять/удалять тут
  onVote: (item: Proposal) => void;
  onDelete: (id: string, title: string) => void;
  onAdd: (columnId: string, title: string) => Promise<boolean>;
}

export function ProposalColumn({
  column,
  proposals,
  currentUser,
  canManage,
  onVote,
  onDelete,
  onAdd,
}: Props) {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = async () => {
    if (!newTitle.trim() || !canManage) return;
    const ok = await onAdd(column.id, newTitle);
    if (ok) setNewTitle('');
  };

  return (
    <div className={`flex flex-col bg-[#121212] border border-neutral-800 border-t-2 ${column.color}`}>
      <div className="flex items-center justify-between p-3 border-b border-neutral-800/80 bg-neutral-900/30">
        <h2 className="font-bold text-xs tracking-wider uppercase text-neutral-300">
          {column.label}
        </h2>
        <span className="text-[11px] bg-neutral-800 text-neutral-400 px-2 py-0.5 font-mono border border-neutral-700/50">
          {proposals.length}
        </span>
      </div>

      <div className="flex-1 p-2 space-y-1.5 overflow-y-auto max-h-[58vh]">
        {proposals.map((item) => (
          <ProposalCard
            key={item.id}
            item={item}
            currentUser={currentUser}
            canDelete={canManage}
            onVote={onVote}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Поле добавления только для владельца колонки */}
      {canManage && (
        <div className="p-2 border-t border-neutral-800 bg-neutral-900/30 flex gap-1">
          <input
            type="text"
            placeholder="ДОБАВИТЬ..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1 bg-black border border-neutral-800 px-2.5 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-emerald-500 transition font-mono"
          />
          <button
            onClick={handleSubmit}
            className="bg-neutral-800 hover:bg-emerald-600 hover:text-black text-neutral-300 px-3 py-1.5 transition border border-neutral-700 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}