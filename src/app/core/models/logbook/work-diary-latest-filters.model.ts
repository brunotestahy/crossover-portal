export interface WorkDiaryLatestFilters {
  fullTeam: 'true' | 'false';
  managerId: string;
  teamId: string;
  [key: string]: string;
}
