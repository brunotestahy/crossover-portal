export interface ScoreField {
  name: string;
  type: string;
  testType?: string;
  rubricId?: number;
  sequenceNumber?: number;
  fields?: {
    min: string;
    max: string;
  } | undefined;
  scoreMin?: number | undefined;
  scoreMax?: number | undefined;
}
