import { TalentAdvocateSelectValues } from 'app/core/models/hire/talent-advocate-select-values.model';

export interface TalentAdvocateQuestion {
  id: number;
  mandatory: boolean;
  question: string;
  selectValues?: TalentAdvocateSelectValues[];
  sequence: number;
  type: string;
}
