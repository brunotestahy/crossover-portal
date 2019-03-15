import {
  WrittenAssignationAnswer,
  WrittenAssignationQuestionnaire,
} from 'app/core/models/application';

export interface WrittenAssignationTest {
  type: string;
  id: number;
  test: WrittenAssignationQuestionnaire;
  answers: WrittenAssignationAnswer[];
}
