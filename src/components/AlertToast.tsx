import { AlertTriangle, X } from 'lucide-react';

interface Props {
  message: string | null;
  onClose: () => void;
}

export function AlertToast({ message, onClose }: Props) {
  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-in fade-in slide-in-from-top-4 duration-150">
      <div className="bg-[#141414] border-2 border-amber-500/80 p-3.5 shadow-2xl flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-400 block mb-0.5">
              Игра уже предложена!
            </span>
            <p className="text-xs text-neutral-200 leading-snug">
              {message}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-white transition shrink-0 p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
