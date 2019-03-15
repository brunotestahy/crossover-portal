import {
  WorkDiaryAction,
  WorkDiaryEvent,
  WorkDiaryImage,
} from 'app/core/models/logbook';

export interface WorkDiary {
  candidateId: number;
  date: string;
  autoTracker: boolean;
  id: number;
  checked: boolean;
  activityLevel: number;
  screenshot: WorkDiaryImage;
  webcam?: WorkDiaryImage;
  images: WorkDiaryImage[];
  events: WorkDiaryEvent[];
  memo: string;
  windowTitle: string;
  disputed: boolean;
  rejected: boolean;
  overtime: boolean;
  mouseEvents: number;
  keyboardEvents: number;
  actions: WorkDiaryAction[];
  flagged: boolean;
  noteShared: boolean;
  intensityScore: number;
  mobileIntensityScore: number;
  productivityCategory: string;
  type: string;
  status: string;
  mobile: boolean;
  time: string;
}
