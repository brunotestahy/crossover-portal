import { WeightedKeyword } from 'app/core/models/assignment/weighted-keyword.model';

export interface Test {
  type: string;
  id: number;
  name: string;
  status: string;
  normalizedHighThreshold?: number;
  weightedKeywords?: WeightedKeyword[];
}
