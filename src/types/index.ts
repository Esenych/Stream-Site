export const USERS = [
  { id: 'stas', name: 'Стас', genitive: 'Стаса', color: 'border-t-emerald-500' },
  { id: 'petrovich', name: 'Петрович', genitive: 'Петровича', color: 'border-t-green-500' },
  { id: 'kivi', name: 'Киви', genitive: 'Киви', color: 'border-t-amber-500' },
  { id: 'esen', name: 'Есен', genitive: 'Есена', color: 'border-t-cyan-500' },
] as const;

export type UserId = (typeof USERS)[number]['id'];

export interface Proposal {
  id: string;
  tab: string;
  column_name: string;
  title: string;
  votes: string[];
}

export interface ColumnConfig {
  id: string;
  label: string;
  color: string;
}

export interface ArchiveItem {
  id: string;
  tab: string;
  title: string;
  rating: number;
  created_at: string;
}
