import {
  PaymentsPlatform,
  PaymentsSortDir,
  PaymentsStatus,
  PaymentsType,
  PaymentsUnit,
  SortPaymentsBy,
} from 'app/core/constants/enforcer/payments';

export interface PaymentsFilter {
  sortBy?: SortPaymentsBy;
  sortDir?: PaymentsSortDir;
  statuses?: PaymentsStatus;
  zeroAmount?: boolean;
  units?: PaymentsUnit;
  types?: PaymentsType;
  platforms?: PaymentsPlatform;
}
