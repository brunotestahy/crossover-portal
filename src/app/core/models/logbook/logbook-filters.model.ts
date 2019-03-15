import { WorkDiaryWithFlags } from 'app/core/models/logbook';

export interface LogbookFilters {
  value: 'all' | 'manual' | 'meeting' | 'idle' | 'low' | 'disputed' | '24';
  label: string;
  predicate: (a: WorkDiaryWithFlags) => boolean;
}
