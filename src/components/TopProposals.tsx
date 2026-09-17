'use client';

import { useState } from 'react';
import { Trophy, Dices, Flame, Play } from 'lucide-react';
import { Proposal, USERS, UserId } from '@/types';

interface Props {
  proposals: Proposal[];
  activeTab: UserId;
  isOwner: boolean;
  onPromote: (item: Proposal) => void;
}

export function TopProposals({ proposals, activeTab, isOwner, onPromote }: Props) {
  const [randomWinnerId, setRandomWinnerId] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Фильтруем только обычные предложения (без current)
  const pool = proposals.filter((p) => p.column_name !== 'current');

  // Находим максимальный балл
  const maxVotes = pool.reduce((max, p) => Math.max(max, p.votes.length), 0);

  if (maxVotes === 0) {
    return (
      <div className="max-w-7xl mx-auto mt-4 p-3 bg-[#121212] border border-neutral-800">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/80 text-neutral-400">
          <Trophy className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs font-bold tracking-widest uppercase font-mono">
            ЛИДЕРЫ ГОЛОСОВАНИЯ
          </span>
        </div>
        <div className="py-2 text-xs font-mono text-neutral-600 italic">
          Пока никто не проголосовал. Поставьте лайки играм ниже, чтобы определить победителя.
        </div>
      </div>
    );
  }

  // Претенденты с максимальным баллом (до 4 штук)
  const topCandidates = pool.filter((p) => p.votes.length === maxVotes).slice(0, 4);
  const hasSingleWinner = topCandidates.length === 1;

  // Логика кнопки "Рандом"
  const handleRollRandom = () => {
    if (topCandidates.length <= 1 || isRolling) return;

    setIsRolling(true);
    let iterations = 0;
    const maxIterations = 12;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * topCandidates.length);
      setRandomWinnerId(topCandidates[randomIndex].id);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 70);
  };

  const getAuthorLabel = (colName: string) => {
    if (colName === 'parallel') return 'Личное';
    const user = USERS.find((u) => u.id === colName);
    return user ? user.name : colName;
  };

  return (
    <div className="max-w-7xl mx-auto mt-4 p-3 bg-[#121212] border border-neutral-800">
      {/* Шапка блока */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold tracking-widest uppercase font-mono text-neutral-200">
            ТОП ГОЛОСОВАНИЯ ({maxVotes} {maxVotes === 1 ? 'ГОЛОС' : 'ГОЛОСА'})
          </span>
        </div>

        {/* Статус и кнопка рандома */}
        <div className="flex items-center gap-3">
          {hasSingleWinner ? (
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5">
              🏆 ПОБЕДИТЕЛЬ ОПРЕДЕЛЕН
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5">
                ⚖️ НИЧЬЯ МЕЖДУ ЛИДЕРАМИ
              </span>

              <button
                onClick={handleRollRandom}
                disabled={isRolling}
                className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono uppercase font-bold bg-neutral-900 border border-amber-500/60 hover:bg-amber-500 hover:text-black text-amber-400 transition disabled:opacity-50"
                title="Случайно выбрать победителя"
              >
                <Dices className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
                <span>{randomWinnerId ? 'ПЕРЕКРУТИТЬ' : 'РАНДОМ'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Список претендентов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {topCandidates.map((item) => {
          const isChosenByRandom = randomWinnerId === item.id;
          const isWinner = hasSingleWinner || isChosenByRandom;

          return (
            <div
              key={item.id}
              className={`p-3 border transition flex flex-col justify-between gap-2.5 ${
                isWinner
                  ? 'bg-neutral-900/90 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-black border-neutral-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-neutral-100 leading-snug">
                    {item.title}
                  </span>

                  {isChosenByRandom && (
                    <span className="shrink-0 text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500 px-1 py-0.2">
                      РАНДОМ
                    </span>
                  )}
                  {hasSingleWinner && (
                    <span className="shrink-0 text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500 px-1 py-0.2">
                      WINNER
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-neutral-800/60 text-[10px] font-mono text-neutral-500">
                  <span>ОТ: {getAuthorLabel(item.column_name).toUpperCase()}</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Flame className="w-3 h-3 fill-emerald-400" />
                    {item.votes.length}
                  </span>
                </div>
              </div>

              {/* Кнопка "В активные" для победителя */}
              {isWinner && (
                <div className="pt-1">
                  {isOwner ? (
                    <button
                      onClick={() => onPromote(item)}
                      className="w-full flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black py-1.5 px-2 text-xs font-mono font-bold uppercase transition shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-black" />
                      <span>В активные</span>
                    </button>
                  ) : (
                    <div className="text-[10px] text-center font-mono text-neutral-500 uppercase border border-neutral-800 py-1">
                      Ждем хозяина доски
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}