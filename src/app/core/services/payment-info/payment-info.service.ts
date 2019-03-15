import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';

import { PaymentSetupSteps } from 'app/core/constants/onboarding-process';
import { PaymentFilters } from 'app/core/models/payments';
import { UserPayment } from 'app/core/models/payments';
import {
  PaychexPaymentType,
  PaymentType,
  PaymentTypeConfiguration,
  PaymentTypeStatus,
  PayoneerPaymentType,
} from 'app/core/models/payments';
import { Task } from 'app/core/models/task';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { environment } from 'environments/environment';

const URLs = {
  getIncomeStatement: `${environment.apiPath}/payments/getPaymentReport`,
  getPaymentReport: `${environment.apiPath}/identity/users/current/payments/report`,
  getPaymentInfo: `${environment.apiPath}/finance/payments/info/%(method)s`,
  savePaymentInfo: `${environment.apiPath}/finance/payments/info/%(method)s?v2ui=true`,
  activatePaymentInfo: `${environment.apiPath}/finance/payments/info/%(method)s/activate`,
  currentUserPayments: `${environment.apiPath}/v2/payments`,
};

@Injectable()
export class PaymentInfoService {

  constructor(
    private http: HttpClient,
    private token: AuthTokenService
  ) {
  }

  public getIncomeStatement(filters: PaymentFilters): Observable<ArrayBuffer> {
    return this.http.get(URLs.getIncomeStatement, {
      reportProgress: true,
      responseType: 'arraybuffer',
      params: filters,
    });
  }

  public getPaymentReport(filters: PaymentFilters): Observable<string> {
    const token = this.token.getToken() as string;
    return this.http.get(URLs.getPaymentReport, {
      responseType: 'text',
      params: {
        from: filters.from,
        to: filters.to,
        downloadFormat: 'CSV',
        token,
      },
    });
  }

  public getPaymentType(task: Partial<Task>): PaymentType | null {
    const paymentTypes = {
      [PaymentSetupSteps.Payoneer]: new PayoneerPaymentType(),
      [PaymentSetupSteps.Paychex]: new PaychexPaymentType(),
    } as { [key: string]: PaymentType };
    const paymentType = paymentTypes[task.taskType as string];
    return paymentType || null;
  }

  public getPaymentInfo(type: PaymentType): Observable<PaymentTypeStatus> {
    const url = sprintf(URLs.getPaymentInfo, type);
    return this.http.get<PaymentTypeStatus>(url);
  }

  public savePaymentInfo(type: PaymentType): Observable<PaymentTypeConfiguration> {
    const url = sprintf(URLs.savePaymentInfo, type);
    return this.http.post<PaymentTypeConfiguration>(url, {});
  }

  public activatePaymentInfo(type: PaymentType): Observable<PaymentTypeConfiguration> {
    const url = sprintf(URLs.activatePaymentInfo, type);
    return this.http.put<PaymentTypeConfiguration>(url, { type: type.method });
  }

  public getCurrentUserPayments(from: string, to: string): Observable<UserPayment[]> {
    return this.http.get<UserPayment[]>(`${URLs.currentUserPayments}`, {
      params: {
        from,
        to,
      },
    });
  }
}
