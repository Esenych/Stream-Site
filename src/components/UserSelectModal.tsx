import { Gamepad2 } from 'lucide-react';
import { USERS, UserId } from '@/types';

interface Props {
  onSelect: (id: UserId) => void;
}

export function UserSelectModal({ onSelect }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-neutral-800 w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Gamepad2 className="w-6 h-6 text-emerald-500" />
          <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-100">
            Кто ты, воин?
          </h2>
        </div>
        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
          Выбери свой профиль. Выбор сохранится в браузере.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelect(user.id)}
              className="p-4 bg-neutral-900 border border-neutral-800 hover:border-emerald-500 hover:bg-neutral-800/80 transition text-left flex flex-col justify-between h-24 group"
            >
              <span className="text-xs text-neutral-500 group-hover:text-emerald-400 font-mono">
                #player
              </span>
              <span className="text-base font-bold text-neutral-100 uppercase tracking-wide">
                {user.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}