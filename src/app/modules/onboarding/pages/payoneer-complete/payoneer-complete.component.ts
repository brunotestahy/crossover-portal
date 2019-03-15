import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, take } from 'rxjs/operators';

import { PaymentSetupSteps } from 'app/core/constants/onboarding-process';
import { PaymentType } from 'app/core/models/payments';
import { NotificationService } from 'app/core/services/notification/notification.service';
import { PaymentInfoService } from 'app/core/services/payment-info/payment-info.service';

@Component({
  selector: 'app-payoneer-complete',
  template: '',
})
export class PayoneerCompleteComponent implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private paymentInfoService: PaymentInfoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    const paymentType = this.paymentInfoService.getPaymentType({
      taskType: PaymentSetupSteps.Payoneer,
    }) as PaymentType;
    this.paymentInfoService
      .activatePaymentInfo(paymentType)
      .pipe(
        // Ignore errors on this request in favor of moving forward
        catchError(() => of(true).pipe(take(1))),
        switchMap(() => this.notificationService.getTasks()),
        map(entries => entries[entries.length - 1])
      )
      .subscribe(
        mostRecentTask => {
          if (mostRecentTask && mostRecentTask.object) {
            return this.router.navigate(
              ['../', mostRecentTask.object.id],
              { relativeTo: this.activatedRoute }
            );
          }
          return this.router.navigate(['/']);
        },
        () => this.router.navigate(['/'])
      );
  }
}
