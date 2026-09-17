'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Proposal } from '@/types';

export function useProposals() {
    const [proposals, setProposals] = useState<Proposal[]>([]);

    useEffect(() => {
        const fetchProposals = async () => {
            const { data, error } = await supabase.from('proposals').select('*');
            if (!error && data) setProposals(data as Proposal[]);
        };

        fetchProposals();

        const channel = supabase
            .channel('realtime:proposals')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'proposals' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setProposals((prev) => {
                            // Защита от дублей
                            if (prev.some((item) => item.id === payload.new.id)) return prev;
                            return [...prev, payload.new as Proposal];
                        });
                    } else if (payload.eventType === 'UPDATE') {
                        setProposals((prev) =>
                            prev.map((item) => (item.id === payload.new.id ? (payload.new as Proposal) : item))
                        );
                    } else if (payload.eventType === 'DELETE') {
                        const deletedId = payload.old?.id;
                        if (deletedId) {
                            setProposals((prev) => prev.filter((item) => item.id !== deletedId));
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const toggleVote = async (proposal: Proposal, userName: string) => {
        if (!userName) return;

        const hasVoted = proposal.votes.includes(userName);
        const newVotes = hasVoted
            ? proposal.votes.filter((u) => u !== userName)
            : [...proposal.votes, userName];

        setProposals((prev) =>
            prev.map((item) => (item.id === proposal.id ? { ...item, votes: newVotes } : item))
        );

        await supabase.from('proposals').update({ votes: newVotes }).eq('id', proposal.id);
    };

    const addProposal = async (tab: string, columnName: string, title: string) => {
        const cleanTitle = title.trim();
        if (!cleanTitle) return false;

        const { error } = await supabase.from('proposals').insert({
            tab,
            column_name: columnName,
            title: cleanTitle,
            votes: [],
        });

        return !error;
    };

    const deleteProposal = async (id: string) => {
        // Мгновенно убираем из интерфейса (0 мс)
        setProposals((prev) => prev.filter((item) => item.id !== id));

        // Удаляем из базы
        await supabase.from('proposals').delete().eq('id', id);
    };

    const promoteToActive = async (tab: string, proposalId: string) => {
        setProposals((prev) =>
            prev.map((item) => {
                if (item.id === proposalId) {
                    return { ...item, column_name: 'current', votes: [] };
                }
                if (item.tab === tab) {
                    return { ...item, votes: [] };
                }
                return item;
            })
        );

        await supabase
            .from('proposals')
            .update({ column_name: 'current', votes: [] })
            .eq('id', proposalId);

        await supabase
            .from('proposals')
            .update({ votes: [] })
            .eq('tab', tab)
            .neq('id', proposalId);
    };

    return {
        proposals,
        toggleVote,
        addProposal,
        deleteProposal,
        promoteToActive,
    };
}