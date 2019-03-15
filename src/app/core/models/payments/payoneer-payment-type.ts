import { PaymentType } from 'app/core/models/payments/payment-type';

export class PayoneerPaymentType extends PaymentType {
  public method = 'PAYONEER';
  public formattedName = 'Payoneer';
}
