import { Gamepad2, User, ArrowRightLeft, HelpCircle, Trophy, Skull, ShieldAlert, ShieldCheck } from 'lucide-react';

interface Props {
  currentUser: string;
  isAdmin: boolean;
  archiveCount: number;
  droppedCount: number; // <-- Новый счетчик
  onToggleAdmin: () => void;
  onResetUser: () => void;
  onOpenTutorial: () => void;
  onOpenArchive: () => void;
  onOpenDropped: () => void; // <-- Открыть брошенные
}

export function Header({
  currentUser,
  isAdmin,
  archiveCount,
  droppedCount,
  onToggleAdmin,
  onResetUser,
  onOpenTutorial,
  onOpenArchive,
  onOpenDropped,
}: Props) {
  return (
    <header className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
      <div className="flex items-center gap-3">
        <div className={`p-2 border transition ${isAdmin ? 'bg-red-500/20 border-red-500' : 'bg-neutral-900 border-neutral-800'}`}>
          <Gamepad2 className={`w-5 h-5 ${isAdmin ? 'text-red-400' : 'text-emerald-400'}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-wider uppercase text-neutral-100">
              Stream Games Hub
            </h1>
            {isAdmin && (
              <span className="text-[10px] font-mono uppercase bg-red-500/20 text-red-400 border border-red-500 px-1.5 py-0.2 font-bold animate-pulse">
                ADMIN
              </span>
            )}
          </div>
          <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
            Table Sync System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Кнопка Архива */}
        <button
          onClick={onOpenArchive}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 text-amber-400 hover:text-amber-300 transition"
          title="Пройденные игры"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Архив ({archiveCount})</span>
        </button>

        {/* Кнопка Брошенных */}
        <button
          onClick={onOpenDropped}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase bg-neutral-900 border border-neutral-800 hover:border-red-500/60 text-red-400 hover:text-red-300 transition"
          title="Брошенные игры"
        >
          <Skull className="w-3.5 h-3.5" />
          <span>Брошенные ({droppedCount})</span>
        </button>

        {/* Кнопка Админки */}
        <button
          onClick={onToggleAdmin}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase border transition ${
            isAdmin
              ? 'bg-red-500/10 border-red-500 text-red-400 font-bold'
              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white'
          }`}
          title={isAdmin ? 'Выйти из админки' : 'Войти в админку'}
        >
          {isAdmin ? <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isAdmin ? 'Админ: ВКЛ' : 'Админ'}</span>
        </button>

        {/* Справка */}
        <button
          onClick={onOpenTutorial}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition"
          title="Открыть обучение"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Справка</span>
        </button>

        {/* Профиль */}
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5">
          <User className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-xs text-neutral-400 uppercase tracking-wider hidden sm:inline">
            Профиль:
          </span>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
            {currentUser || 'Не выбран'}
          </span>
        </div>

        {/* Сменить */}
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
