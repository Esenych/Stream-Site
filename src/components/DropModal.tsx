import { useState } from 'react';
import { Skull } from 'lucide-react';

interface Props {
  isOpen: boolean;
  gameTitle: string;
  onConfirm: (review?: string) => void;
  onCancel: () => void;
}

export function DropModal({ isOpen, gameTitle, onConfirm, onCancel }: Props) {
  const [review, setReview] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-neutral-800 w-full max-w-sm p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-neutral-800 text-red-400">
          <Skull className="w-5 h-5 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-100">
            Дроп игры со стрима
          </h3>
        </div>

        <div className="bg-black border border-neutral-800 px-3 py-2 text-xs font-mono text-neutral-200 mb-3 truncate">
          &gt; {gameTitle}
        </div>

        <p className="text-xs text-neutral-400 mb-2">
          Причина дропа / крик души (необязательно):
        </p>

        <textarea
          placeholder="Почему дропнул? Духота, баги, скучный сюжет..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full bg-black border border-neutral-800 p-2 text-xs text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-red-500 font-mono resize-none h-20 mb-4 transition"
        />

        <div className="flex justify-end gap-2 font-mono text-xs uppercase">
          <button
            onClick={() => {
              setReview('');
              onCancel();
            }}
            className="px-4 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition"
          >
            Отмена
          </button>
          <button
            onClick={() => {
              onConfirm(review);
              setReview('');
            }}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-black font-bold transition"
          >
            Дропнуть
          </button>
        </div>
      </div>
    </div>
  );
}