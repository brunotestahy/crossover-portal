import { TalentAdvocateQuestion } from 'app/core/models/hire/talent-advocate-question.model';

export interface TalentAdvocateAnswer {
  answer?: string;
  question: TalentAdvocateQuestion;
}
