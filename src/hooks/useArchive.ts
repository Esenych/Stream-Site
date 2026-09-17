'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArchiveItem } from '@/types';

export function useArchive() {
  const [archive, setArchive] = useState<ArchiveItem[]>([]);

  useEffect(() => {
    const fetchArchive = async () => {
      const { data, error } = await supabase
        .from('archive')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setArchive(data as ArchiveItem[]);
    };

    fetchArchive();

    const channel = supabase
      .channel('realtime:archive')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'archive' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setArchive((prev) => [payload.new as ArchiveItem, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setArchive((prev) => prev.filter((item) => item.id !== deletedId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Добавить в архив и удалить из таблицы proposals
  const completeGame = async (proposalId: string, tab: string, title: string, rating: number) => {
    // 1. Закидываем в архив
    await supabase.from('archive').insert({
      tab,
      title,
      rating,
    });

    // 2. Сносим из активных proposals
    await supabase.from('proposals').delete().eq('id', proposalId);
  };

  const deleteArchiveItem = async (id: string) => {
    setArchive((prev) => prev.filter((item) => item.id !== id));
    await supabase.from('archive').delete().eq('id', id);
  };

  return {
    archive,
    completeGame,
    deleteArchiveItem,
  };
}
