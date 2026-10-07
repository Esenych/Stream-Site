'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DroppedItem } from '@/types';

export function useDropped() {
  const [dropped, setDropped] = useState<DroppedItem[]>([]);

  useEffect(() => {
    const fetchDropped = async () => {
      const { data, error } = await supabase
        .from('dropped')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setDropped(data as DroppedItem[]);
    };

    fetchDropped();

    const channel = supabase
      .channel('realtime:dropped')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dropped' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDropped((prev) => [payload.new as DroppedItem, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setDropped((prev) => prev.filter((item) => item.id !== deletedId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const dropGame = async (proposalId: string, tab: string, title: string, votedBy: string[]) => {
    await supabase.from('dropped').insert({
      tab,
      title,
      voted_by: votedBy,
    });

    await supabase.from('proposals').delete().eq('id', proposalId);
  };

  const deleteDroppedItem = async (id: string) => {
    setDropped((prev) => prev.filter((item) => item.id !== id));
    await supabase.from('dropped').delete().eq('id', id);
  };

  return {
    dropped,
    dropGame,
    deleteDroppedItem,
  };
}
