import { AssignmentVisitor } from 'app/core/models/endorsement-filter/assignment-visitor.model';
import { FiveQVisitor } from 'app/core/models/endorsement-filter/five-q-visitor.model';
import { HackerRankVisitor } from 'app/core/models/endorsement-filter/hacker-rank-visitor.model';
import { ResumeKeywordVisitor } from 'app/core/models/endorsement-filter/resume-keyword-visitor.model';
import { ResumeRubricVisitor } from 'app/core/models/endorsement-filter/resume-rubric-visitor.model';

export const ScoreFieldsVisitor = [
  AssignmentVisitor,
  FiveQVisitor,
  HackerRankVisitor,
  ResumeKeywordVisitor,
  ResumeRubricVisitor,
];
