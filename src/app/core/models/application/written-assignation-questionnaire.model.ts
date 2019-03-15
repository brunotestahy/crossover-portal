import { WrittenAssignationQuestionnaireQuestion } from 'app/core/models/application';

export interface WrittenAssignationQuestionnaire {
  type: string;
  id: number;
  description: string;
  questions: WrittenAssignationQuestionnaireQuestion[];
}
