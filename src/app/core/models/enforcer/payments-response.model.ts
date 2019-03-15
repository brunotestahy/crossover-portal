import { Payment } from 'app/core/models/enforcer/payment.model';

export interface PaymentsResponse {
  content: Payment[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalAmount: number;
  totalElements: number;
  totalPages: number;
}
