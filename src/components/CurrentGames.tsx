import { useState } from 'react';
import { Play, Plus, X, CheckSquare, FlameOff } from 'lucide-react';
import { Proposal, USERS, UserId } from '@/types';

interface Props {
  activeTab: UserId;
  currentUserId: UserId | null;
  currentUser: string;
  isOwner: boolean;
  isAdmin: boolean;
  games: Proposal[];
  onAdd: (title: string) => Promise<boolean>;
  onDelete: (id: string, title: string) => void;
  onComplete: (game: Proposal) => void;
  onToggleDropVote: (game: Proposal) => void;
  onDropGame: (game: Proposal) => void;
}

export function CurrentGames({
  activeTab,
  currentUserId,
  currentUser,
  isOwner,
  isAdmin,
  games,
  onAdd,
  onDelete,
  onComplete,
  onToggleDropVote,
  onDropGame,
}: Props) {
  const [title, setTitle] = useState('');
  const ownerName = USERS.find((u) => u.id === activeTab)?.name;

  const handleSubmit = async () => {
    if (!title.trim()) return;
    const ok = await onAdd(title);
    if (ok) setTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto mt-4 p-3 bg-[#121212] border border-neutral-800">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span className="text-xs font-bold tracking-widest uppercase text-neutral-200">
            ТЕКУЩАЯ ИГРА (СЕЙЧАС ПРОХОДИТСЯ)
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
          {isOwner ? (
            <span className="text-emerald-500/90 font-semibold">[ Вы хозяин доски ]</span>
          ) : (
            `[ Хозяин: ${ownerName} ]`
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {games.length === 0 ? (
          <div className="col-span-full py-2 text-xs font-mono text-neutral-600 italic">
            {isOwner
              ? 'Вы еще не указали, что сейчас проходите. Выберите победителя голосования или добавьте игру.'
              : 'Хозяин пока не указал текущую игру.'}
          </div>
        ) : (
          games.map((game) => {
            const dropVotes = game.votes || [];
            const dropCount = dropVotes.length;
            const hasVotedDrop = currentUser ? dropVotes.includes(currentUser) : false;
            const canDrop = dropCount >= 2; // Порог дропа: от 2х голосов

            return (
              <div
                key={game.id}
                className={`bg-black border p-3 text-xs flex flex-col justify-between gap-2.5 transition ${
                  canDrop ? 'border-red-500/70 shadow-lg shadow-red-500/5' : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 bg-emerald-500 shrink-0 shadow-sm shadow-emerald-500" />
                    <span className="font-semibold text-neutral-100 truncate">{game.title}</span>
                  </div>

                  {(isOwner || isAdmin) && (
                    <button
                      onClick={() => onDelete(game.id, game.title)}
                      className="text-neutral-500 hover:text-red-400 transition p-0.5 shrink-0"
                      title="Удалить"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Панель действий: Пройдено + Голосование за Дроп */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/60">
                  
                  {/* Кнопка "Пройдено" (для хозяина или админа) */}
                  {(isOwner || isAdmin) ? (
                    <button
                      onClick={() => onComplete(game)}
                      className="flex items-center gap-1 text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black px-2 py-1 transition font-bold"
                      title="Отметить как пройденное"
                    >
                      <CheckSquare className="w-3 h-3" />
                      <span>Пройдено</span>
                    </button>
                  ) : <div />}

                  {/* Блок Дропа */}
                  <div className="flex items-center gap-1.5">
                    {/* Кнопка голосования за дроп (хозяин сам голосовать не может!) */}
                    {isOwner ? (
                      <span className="text-[10px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 bg-neutral-950" title="Хозяин не может голосовать за свой дроп">
                        Дроп: {dropCount}/2
                      </span>
                    ) : (
                      <button
                        onClick={() => onToggleDropVote(game)}
                        className={`flex items-center gap-1 text-[10px] font-mono uppercase border px-2 py-0.5 transition ${
                          hasVotedDrop
                            ? 'bg-red-500 border-red-500 text-black font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-red-500/50 hover:text-red-400'
                        }`}
                        title={hasVotedDrop ? 'Снять голос за дроп' : 'Проголосовать за дроп игры'}
                      >
                        <FlameOff className="w-3 h-3" />
                        <span>Дроп {dropCount}/2</span>
                      </button>
                    )}

                    {/* Финальная кнопка ДРОПНУТЬ (становится доступна от 2-х голосов) */}
                    {canDrop && (isOwner || isAdmin) && (
                      <button
                        onClick={() => onDropGame(game)}
                        className="flex items-center gap-1 text-[10px] font-mono uppercase bg-red-600 hover:bg-red-500 text-black px-2 py-0.5 font-bold transition animate-pulse"
                        title="Дропнуть игру и перенести в брошенные"
                      >
                        <FlameOff className="w-3 h-3 fill-black" />
                        <span>ДРОПНУТЬ!</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Поле добавления текущей игры */}
      {(isOwner || isAdmin) && (
        <div className="mt-2.5 pt-2.5 border-t border-neutral-800/60 flex gap-1">
          <input
            type="text"
            placeholder="Добавить текущую игру вручную..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1 bg-black border border-neutral-800 px-2.5 py-1 text-xs text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-emerald-500 transition font-mono"
          />
          <button
            onClick={handleSubmit}
            className="bg-neutral-800 hover:bg-emerald-600 hover:text-black text-neutral-300 px-3 py-1 text-xs uppercase font-mono font-bold transition border border-neutral-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить</span>
          </button>
        </div>
      )}
    </div>
  );
}
