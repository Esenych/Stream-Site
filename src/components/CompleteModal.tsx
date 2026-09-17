import { useState } from 'react';
import { Trophy } from 'lucide-react';

interface Props {
  isOpen: boolean;
  gameTitle: string;
  onConfirm: (rating: number) => void;
  onCancel: () => void;
}

export function CompleteModal({ isOpen, gameTitle, onConfirm, onCancel }: Props) {
  const [rating, setRating] = useState<number>(8);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-neutral-800 w-full max-w-sm p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-neutral-800 text-amber-400">
          <Trophy className="w-5 h-5 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-100">
            Игра пройдена!
          </h3>
        </div>

        <div className="bg-black border border-neutral-800 px-3 py-2 text-xs font-mono text-neutral-200 mb-4 truncate">
          &gt; {gameTitle}
        </div>

        <p className="text-xs text-neutral-400 mb-3">Оценка стрима / прохождения:</p>

        {/* Сетка оценок от 1 до 10 */}
        <div className="grid grid-cols-5 gap-1.5 mb-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => setRating(num)}
              className={`py-1.5 text-xs font-mono font-bold transition border ${
                rating === num
                  ? 'bg-amber-500 border-amber-400 text-black shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2 font-mono text-xs uppercase">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition"
          >
            Отмена
          </button>
          <button
            onClick={() => onConfirm(rating)}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition"
          >
            В архив
          </button>
        </div>
      </div>
    </div>
  );
}
