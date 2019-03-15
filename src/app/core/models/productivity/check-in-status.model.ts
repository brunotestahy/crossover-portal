export interface CheckInStatus {
  order: number;
  key: string;
  name: string;
  color: string;
  description: string;
  state?: string;
  isEditable?: boolean;
  comment?: string;
}
