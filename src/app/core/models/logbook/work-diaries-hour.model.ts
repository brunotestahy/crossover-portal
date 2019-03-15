import { WorkDiaryWithFlags } from 'app/core/models/logbook';

export interface WorkDiariesByHour {
  hour: Date;
  diaries: WorkDiaryWithFlags[];
}
