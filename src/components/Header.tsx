import { Gamepad2, User, ArrowRightLeft } from 'lucide-react';

interface Props {
  currentUser: string;
  onResetUser: () => void;
}

export function Header({ currentUser, onResetUser }: Props) {
  return (
    <header className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-neutral-900 border border-neutral-800">
          <Gamepad2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wider uppercase text-neutral-100">
            Game Voting Hub
          </h1>
          <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
            Table Sync System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5">
          <User className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-xs text-neutral-400 uppercase tracking-wider">Профиль:</span>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
            {currentUser || 'Не выбран'}
          </span>
        </div>

        <button
          onClick={onResetUser}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition"
          title="Сменить игрока"
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>Сменить</span>
        </button>
      </div>
    </header>
  );
}