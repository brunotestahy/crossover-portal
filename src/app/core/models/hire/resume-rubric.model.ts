export interface ResumeRubric {
  id: number;
  name: string;
  description: string;
  type: 'PRE_DEFINED' | 'CUSTOM';
  value: string[];
}
