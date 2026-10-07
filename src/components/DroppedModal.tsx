import { Skull, X } from 'lucide-react';
import { DroppedItem, USERS, UserId } from '@/types';

interface Props {
  isOpen: boolean;
  activeTab: UserId;
  dropped: DroppedItem[];
  canManage: boolean;
  onClose: () => void;
  onDelete: (id: string, title: string) => void;
}

export function DroppedModal({ isOpen, activeTab, dropped, canManage, onClose, onDelete }: Props) {
  if (!isOpen) return null;

  const tabDropped = dropped.filter((item) => item.tab === activeTab);
  const currentTabUser = USERS.find((u) => u.id === activeTab)?.name;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-neutral-800 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-100">
        
        {/* Шапка */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Skull className="w-5 h-5 text-red-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-100">
              Брошенные игры: {currentTabUser} ({tabDropped.length})
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Список брошенных */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {tabDropped.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-neutral-600 italic">
              Ни одной брошенной игры. Либо всё проходится до конца, либо никто еще не дропал!
            </div>
          ) : (
            tabDropped.map((item) => (
              <div
                key={item.id}
                className="bg-black border border-neutral-800 p-3 flex flex-wrap items-center justify-between gap-3 hover:border-red-950/60 transition"
              >
                <div>
                  <span className="text-xs font-bold text-neutral-200 line-through opacity-75 block">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-neutral-500">
                    <span>Одобрили дроп:</span>
                    <div className="flex gap-1">
                      {item.voted_by.map((voter) => (
                        <span key={voter} className="bg-red-500/10 border border-red-500/30 text-red-400 px-1 py-0.2">
                          {voter}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-neutral-500">
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </span>

                  {canManage && (
                    <button
                      onClick={() => onDelete(item.id, item.title)}
                      className="text-neutral-600 hover:text-red-400 transition"
                      title="Удалить запись"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
