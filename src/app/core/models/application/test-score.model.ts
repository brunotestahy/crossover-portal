import { UserAvatar } from 'app/core/models/current-user';

export interface TestScore {
  test: UserAvatar;
  score: number;
  maxScore: number;
  result: string;
  percentage: number;
  invertedPercentile: number;
}
