import { ReviewDetail } from 'app/core/models/rank-review/review-detail.model';

export interface Review {
  id: number;
  createdOn: string;
  reviewAnswered: boolean;
  weekEndDate: string;
  reviewDetails: ReviewDetail[];
}
