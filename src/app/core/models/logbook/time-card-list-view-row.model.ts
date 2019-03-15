import { WorkDiaryEvent } from 'app/core/models/logbook/work-diary-event.model';
import { WorkDiaryWithFlags } from 'app/core/models/logbook/work-diary-with-flags.model';

export interface TimeCardListViewRow {
  id: number;
  time: Date;
  title: string;
  application: string;
  keyboard: number;
  mouse: number;
  activity: number;
  hasScreenshot: boolean;
  hasWebCam: boolean;
  screenshotUrl: string | null;
  webCamUrl: string | null;
  details: WorkDiaryEvent[];
  workDiary: WorkDiaryWithFlags;
}
