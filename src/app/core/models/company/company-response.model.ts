import { Company } from 'app/core/models/company/company.model';
export interface CompanyResponse {
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
    content: Company[];
}
