import { Trash2, ThumbsUp } from 'lucide-react';
import { Proposal } from '@/types';

interface Props {
  item: Proposal;
  currentUser: string;
  canDelete: boolean; // право на удаление
  onVote: (item: Proposal) => void;
  onDelete: (id: string, title: string) => void;
}

export function ProposalCard({ item, currentUser, canDelete, onVote, onDelete }: Props) {
  const isVoted = currentUser ? item.votes.includes(currentUser) : false;

  return (
    <div className="group bg-[#171717] hover:bg-[#1f1f1f] border border-neutral-800/70 p-3 transition flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-neutral-200 leading-snug">{item.title}</span>
        
        {/* Корзина видна ТОЛЬКО владельцу */}
        {canDelete && (
          <button
            onClick={() => onDelete(item.id, item.title)}
            className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-400 transition"
            title="Удалить"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-neutral-800/40">
        <div className="flex flex-wrap gap-1">
          {item.votes.map((voter) => (
            <span
              key={voter}
              className="text-[9px] bg-neutral-800 text-neutral-400 border border-neutral-700/60 px-1.5 py-0.5 font-mono uppercase"
            >
              {voter}
            </span>
          ))}
        </div>

        <button
          onClick={() => onVote(item)}
          className={`flex items-center gap-1.5 text-xs px-2 py-1 transition font-mono border ${
            isVoted
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
              : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:text-white hover:border-neutral-500'
          }`}
        >
          <ThumbsUp className={`w-3 h-3 ${isVoted ? 'fill-emerald-400' : ''}`} />
          <span>{item.votes.length}</span>
        </button>
      </div>
    </div>
  );
}