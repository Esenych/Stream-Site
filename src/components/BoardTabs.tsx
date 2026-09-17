import { USERS, UserId } from '@/types';

interface Props {
  activeTab: UserId;
  onSelectTab: (id: UserId) => void;
}

export function BoardTabs({ activeTab, onSelectTab }: Props) {
  return (
    <div className="max-w-7xl mx-auto mt-6 flex gap-1 border-b border-neutral-800 pb-px overflow-x-auto">
      {USERS.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectTab(user.id)}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
            activeTab === user.id
              ? 'border-emerald-500 text-emerald-400 bg-neutral-900/40'
              : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/20'
          }`}
        >
          ДОСКА: {user.name}
        </button>
      ))}
    </div>
  );
}