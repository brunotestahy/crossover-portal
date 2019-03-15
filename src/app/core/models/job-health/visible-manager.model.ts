import { Company } from 'app/core/models/company';

export interface VisibleManager {
  id: number;
  name: string;
  company: Company;
}
