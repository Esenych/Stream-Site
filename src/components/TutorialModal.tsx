import { BookOpen, ThumbsUp, ShieldCheck, Dices, Play, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-neutral-800 w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
        
        {/* Заголовок */}
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-800 text-emerald-400">
          <BookOpen className="w-5 h-5 shrink-0" />
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-neutral-100">
            Как тут всё устроено (База)
          </h2>
        </div>

        {/* 4 пункта правил */}
        <div className="mt-4 space-y-3.5 text-xs text-neutral-300">
          
          <div className="flex items-start gap-3 bg-neutral-900/60 border border-neutral-800/80 p-3">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-neutral-100 uppercase tracking-wide font-mono block mb-0.5">
                1. Твоя колонка — твои правила
              </span>
              <p className="text-neutral-400 leading-relaxed">
                Добавлять и удалять игры ты можешь <strong className="text-neutral-200">только в своем столбце</strong> (в «Личных предложениях» — только хозяин открытой доски). Чужие предложения удалить нельзя.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-neutral-900/60 border border-neutral-800/80 p-3">
            <ThumbsUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-neutral-100 uppercase tracking-wide font-mono block mb-0.5">
                2. Голосование за всё
              </span>
              <p className="text-neutral-400 leading-relaxed">
                Голосовать пальцем вверх можно за <strong className="text-neutral-200">любые игры на любой доске</strong>. Нажатие ставит твой голос, повторное — снимает. Карточки с максимумом лайков сами всплывают наверх.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-neutral-900/60 border border-neutral-800/80 p-3">
            <Dices className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-neutral-100 uppercase tracking-wide font-mono block mb-0.5">
                3. Блок лидеров и Рандом
              </span>
              <p className="text-neutral-400 leading-relaxed">
                Сверху над колонками отображаются фавориты. Если у нескольких игр одинаково максимальный счет — жмите кнопку <strong className="text-amber-400 font-mono">РАНДОМ</strong>, чтобы рулетка выбрала победителя за вас.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-neutral-900/60 border border-neutral-800/80 p-3">
            <Play className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 fill-emerald-400" />
            <div>
              <span className="font-bold text-neutral-100 uppercase tracking-wide font-mono block mb-0.5">
                4. Старт прохождения
              </span>
              <p className="text-neutral-400 leading-relaxed">
                Когда победитель определен, хозяин доски нажимает <strong className="text-emerald-400 font-mono">В АКТИВНЫЕ</strong>. Игра перемещается в «Текущую игру», а счетчики голосов сбрасываются для нового голосования.
              </p>
            </div>
          </div>

        </div>

        {/* Кнопка закрытия */}
        <div className="mt-5 pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 text-xs font-mono font-bold uppercase transition shadow-lg shadow-emerald-500/10"
          >
            <Check className="w-4 h-4" />
            <span>Понял, погнали</span>
          </button>
        </div>

      </div>
    </div>
  );
}
