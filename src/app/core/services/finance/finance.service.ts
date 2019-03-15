import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PaymentsSortDir, PaymentsStatus, SortPaymentsBy } from 'app/core/constants/enforcer/payments';
import { PaymentsResponse } from 'app/core/models/enforcer/payments-response.model';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { environment } from 'environments/environment';

export const API = {
  payments: `${environment.apiPath}/finance/payments`,
  paymentsCount: `${environment.apiPath}/finance/payments/reports/entries/count`,
  paymentsReportsDownload: `${environment.apiPath}/finance/payments/reports`,
};

@Injectable()
export class FinanceService {
  constructor(protected http: HttpClient, protected authTokenService: AuthTokenService) {}

  public getPayments(
    page: number = 0,
    sortBy: SortPaymentsBy = SortPaymentsBy.FullName,
    sortDir: PaymentsSortDir = PaymentsSortDir.Ascending,
    pageSize: number = 50
  ): Observable<PaymentsResponse> {
    return this.http.get<PaymentsResponse>(API.payments, {
      params: {
        fullName: '',
        orderBy: sortBy,
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortDir: sortDir,
        statuses: PaymentsStatus.Ready,
        totalAmount: 'true',
        weekStartDate: '2018-05-28',
      },
    });
  }

  public getPaymentsCount(
    platforms: string[],
    types: string[],
    units: string[],
    statuses: string[],
    weekStartDate: string
  ): Observable<{ count: number }> {
    const platformsQuery = platforms.map(platform => `platforms=${platform}`).join('&');
    const typesQuery = types.map(type => `types=${type}`).join('&');
    const unitsQuery = units.map(unit => `units=${unit}`).join('&');
    const statusesQuery = statuses.map(status => `statuses=${status}`).join('&');
    const query =
      `?consolidated=false&${platformsQuery}&${typesQuery}&${unitsQuery}&${statusesQuery}&weekStartDate=${weekStartDate}`;
    return this.http.get<{ count: number }>(`${API.paymentsCount}${query}`);
  }

  public downloadPaymentsReport(
    platforms: string[],
    types: string[],
    units: string[],
    statuses: string[],
    weekStartDate: string
  ): Observable<string> {
    const platformsQuery = `platforms=${platforms.toString().split(',')}`;
    const typesQuery = `types=${types.toString().split(',')}`;
    const unitsQuery = `units=${units.toString().split(',')}`;
    const statusesQuery = `statuses=${statuses.toString().split(',')}`;
    const query =
      `&consolidated=false&${platformsQuery}&${typesQuery}&${unitsQuery}&${statusesQuery}&weekStartDate=${weekStartDate}`;
    return this.http.get(`${API.paymentsReportsDownload}?token=${this.authTokenService.getToken()}&downloadFormat=CSV${query}`, {
      responseType: 'text'
    });
  }
}
