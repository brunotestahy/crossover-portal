import { ScoreFilterType } from 'app/core/models/application/score-filter-type.model';

export interface ScoreType {
  name: string;
  scoreMin: number;
  scoreMax: number;
  testType: string;
  type: ScoreFilterType;
}
