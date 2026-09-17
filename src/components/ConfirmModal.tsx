import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  gameName: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  gameName,
  description = 'Ты действительно хочешь выполнить это действие?',
  confirmText = 'Удалить',
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-neutral-800 w-full max-w-sm p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center gap-2.5 mb-3 text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
            {title}
          </h3>
        </div>

        <p className="text-xs text-neutral-400 mb-2">
          {description}
        </p>

        <div className="bg-black border border-neutral-800 px-3 py-2 text-xs font-mono text-neutral-200 mb-5 truncate">
          &gt; {gameName}
        </div>

        <div className="flex justify-end gap-2 font-mono text-xs uppercase">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 bg-red-500/10 border border-red-500 text-red-400 hover:bg-red-600 hover:text-black font-bold transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
