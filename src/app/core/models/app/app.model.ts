import { Company } from 'app/core/models/company';

export interface App {
  appUserType?: string;
  companies?: Array<Company>;
  createdOn?: string;
  enabled?: boolean;
  id?: number;
  identifier?: string;
  name?: string;
  updatedOn?: string;
}
