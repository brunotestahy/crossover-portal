import { GetApplicationResponse } from 'app/core/models/hire';

export interface JobSearchResponse {
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: GetApplicationResponse[];
}
