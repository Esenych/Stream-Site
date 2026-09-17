import { Gamepad2, User, ArrowRightLeft, HelpCircle } from 'lucide-react';

interface Props {
  currentUser: string;
  onResetUser: () => void;
  onOpenTutorial: () => void; // <-- Новый пропс
}

export function Header({ currentUser, onResetUser, onOpenTutorial }: Props) {
  return (
    <header className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-neutral-900 border border-neutral-800">
          <Gamepad2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wider uppercase text-neutral-100">
            Stream Games Hub
          </h1>
          <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
            Table Sync System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Кнопка справки */}
        <button
          onClick={onOpenTutorial}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition"
          title="Открыть обучение"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Справка</span>
        </button>

        {/* Профиль игрока */}
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5">
          <User className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-xs text-neutral-400 uppercase tracking-wider hidden sm:inline">Профиль:</span>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
            {currentUser || 'Не выбран'}
          </span>
        </div>

        {/* Сменить игрока */}
        <button
          onClick={onResetUser}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition"
          title="Сменить игрока"
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span className="hidden sm:inline">Сменить</span>
        </button>
      </div>
    </header>
  );
}
