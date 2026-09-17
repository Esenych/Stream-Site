import { Trash2, ThumbsUp, Clock } from 'lucide-react';
import { Proposal } from '@/types';

interface Props {
  item: Proposal;
  currentUser: string;
  canDelete: boolean;
  onVote: (item: Proposal) => void;
  onDelete: (id: string, title: string) => void;
}

// 1. Официальный логотип Steam (SVG)
function SteamIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.029 4.524 4.524s-2.03 4.524-4.524 4.524h-.105l-4.076 2.811c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zM7.55 18.06c-1.13 0-2.046-.917-2.046-2.047 0-1.13.916-2.046 2.046-2.046 1.13 0 2.046.916 2.046 2.046 0 1.13-.916 2.047-2.046 2.047zm8.953-6.602c-1.4 0-2.535-1.135-2.535-2.535s1.135-2.535 2.535-2.535 2.535 1.135 2.535 2.535-1.135 2.535-2.535 2.535z" />
    </svg>
  );
}

// 2. Официальный логотип Google (4 цвета SVG)
function GoogleIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.14C3.25 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.14z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.59l4.01 3.14c.95-2.83 3.6-4.98 6.72-4.98z" />
    </svg>
  );
}

export function ProposalCard({ item, currentUser, canDelete, onVote, onDelete }: Props) {
  const isVoted = currentUser ? item.votes.includes(currentUser) : false;

  const steamUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(item.title)}`;
  const hltbUrl = `https://howlongtobeat.com/?q=${encodeURIComponent(item.title)}`;
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(item.title + ' игра')}`;

  return (
    <div className="group bg-[#171717] hover:bg-[#1f1f1f] border border-neutral-800/70 p-3 transition flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-neutral-200 leading-snug">
          {item.title}
        </span>

        {/* Панель оригинальных иконок */}
        <div className="flex items-center gap-1.5 shrink-0 opacity-70 group-hover:opacity-100 transition">
          {/* Steam */}
          <a
            href={steamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-neutral-500 hover:text-[#66c0f4] hover:bg-neutral-800/80 transition"
            title="Открыть в Steam"
          >
            <SteamIcon className="w-3.5 h-3.5" />
          </a>

          {/* HowLongToBeat */}
          <a
            href={hltbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-tight text-neutral-400 hover:text-amber-400 bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition flex items-center gap-1"
            title="Сколько проходить? (HowLongToBeat)"
          >
            <Clock className="w-2.5 h-2.5 text-amber-400" />
            <span>HLTB</span>
          </a>

          {/* Google */}
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-neutral-800/80 transition opacity-80 hover:opacity-100"
            title="Искать в Google"
          >
            <GoogleIcon className="w-3.5 h-3.5" />
          </a>

          {/* Удаление карточки (для владельца) */}
          {canDelete && (
            <button
              onClick={() => onDelete(item.id, item.title)}
              className="p-1 text-neutral-600 hover:text-red-400 hover:bg-neutral-800 transition ml-0.5"
              title="Удалить"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Голоса */}
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
