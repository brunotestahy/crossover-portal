import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { map, switchMap } from 'rxjs/operators';

import { PaymentType } from 'app/core/models/payments';
import { NotificationService } from 'app/core/services/notification/notification.service';
import { PaymentInfoService } from 'app/core/services/payment-info/payment-info.service';

@Component({
  selector: 'app-setup-payment',
  templateUrl: './setup-payment.component.html',
  styleUrls: ['./setup-payment.component.scss'],
})
export class SetupPaymentComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-grow';

  public paymentType: PaymentType;
  public error = '';

  constructor(
    private notificationService: NotificationService,
    private paymentInfoService: PaymentInfoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    this.notificationService
      .getTasks()
      .pipe(
        map(entries =>
          this.paymentInfoService.getPaymentType(entries[entries.length - 1])
        ),
        switchMap(paymentType => {
          if (paymentType === null) {
            return ErrorObservable.create('The current step does not match payment setup.');
          }
          return this.paymentInfoService.getPaymentInfo(this.paymentType = paymentType);
        })
      )
      .subscribe(
        data => data,
        error => {
          if (typeof(error) === 'string') {
            this.router.navigate(
              ['../'],
              { relativeTo: this.activatedRoute }
            );
            return;
          }
          this.error = error.message || 'An unknown error happened while retrieving payment setup data';
        }
      );
  }

  public setPaymentType(): void {
    this.paymentInfoService
      .savePaymentInfo(this.paymentType)
      .subscribe(
        config => window.location.replace(config.redirect as string),
        error => this.error = error.message || 'An unknown error happened while setting up payment data.'
      );
  }
}
