import { ScoreType } from 'app/core/models/application/score-type.model';

export class ApplicantBody {
  public applicationStatus?: string;
  public applicationType: string;
  public campaign?: string;
  public searchWord?: string;
  public showDisabled: boolean;
  public tasks?: string[];
  public jobId: number | string;
  public resumeSearchQuery?: string;
  public createdOnFrom?: string;
  public createdOnTo?: string;
  public hmRatingMax?: string;
  public hmRatingMin?: string;
  public previewToHM?: string;
  public totalScoreMax?: number;
  public totalScoreMin?: number;
  public scoreFilters?: ScoreType[];
  public lastStatusUpdateFrom?: string;
  public lastStatusUpdateTo?: string;
}
