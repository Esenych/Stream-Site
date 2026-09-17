import { Trophy, Star, X } from 'lucide-react';
import { ArchiveItem, USERS, UserId } from '@/types';

interface Props {
  isOpen: boolean;
  activeTab: UserId;
  archive: ArchiveItem[];
  canManage: boolean;
  onClose: () => void;
  onDelete: (id: string, title: string) => void;
}

export function ArchiveModal({ isOpen, activeTab, archive, canManage, onClose, onDelete }: Props) {
  if (!isOpen) return null;

  // Игры, пройденные на текущей открытой доске
  const tabArchive = archive.filter((item) => item.tab === activeTab);
  const currentTabUser = USERS.find((u) => u.id === activeTab)?.name;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-neutral-800 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-100">
        {/* Шапка */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-100">
              Архив пройденного: {currentTabUser} ({tabArchive.length})
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Список пройденных игр */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {tabArchive.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-neutral-600 italic">
              На этой доске пока нет пройденных игр.
            </div>
          ) : (
            tabArchive.map((item) => (
              <div
                key={item.id}
                className="bg-black border border-neutral-800 p-3 flex items-center justify-between gap-3 hover:border-neutral-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/40 text-amber-400 font-mono font-bold text-xs px-2.5 py-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{item.rating}/10</span>
                  </div>
                  <span className="text-xs font-bold text-neutral-200">{item.title}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-neutral-500">
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </span>

                  {canManage && (
                    <button
                      onClick={() => onDelete(item.id, item.title)}
                      className="text-neutral-600 hover:text-red-400 transition"
                      title="Удалить из архива"
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
