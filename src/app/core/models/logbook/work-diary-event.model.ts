export interface WorkDiaryEvent {
  keyboard: number;
  mouse: number;
  date: string;
  windowTitle: string;
  processName: string;
  visitingUrl: string;
  keylog: string;
  cpuUsage: number;
  memUsage: number;
  mobile: boolean;
  idle: boolean;
}
