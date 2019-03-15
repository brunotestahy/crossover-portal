import { PaymentType } from 'app/core/models/payments/payment-type';

export class PaychexPaymentType extends PaymentType {
  public method = 'PAYCHEX';
  public formattedName = 'PayChex';
}
