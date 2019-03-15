import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { PaymentSetupSteps } from 'app/core/constants/onboarding-process';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { NotificationService } from 'app/core/services/notification/notification.service';
import { PaymentInfoService } from 'app/core/services/payment-info/payment-info.service';
import { SetupPaymentComponent } from 'app/modules/onboarding/pages/setup-payment/setup-payment.component';

describe('SetupPaymentComponent', () => {
  let component: SetupPaymentComponent;
  let fixture: ComponentFixture<typeof component>;

  let paymentInfoService: PaymentInfoService;
  let notificationService: NotificationService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SetupPaymentComponent,
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthTokenService, useFactory: () => mock(AuthTokenService) },
        { provide: HttpClient, useFactory: () => mock(HttpClient) },
        { provide: NotificationService, useFactory: () => mock(NotificationService) },
        PaymentInfoService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPaymentComponent);
    component = fixture.componentInstance;
    paymentInfoService = TestBed.get(PaymentInfoService);
    notificationService = TestBed.get(NotificationService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
  });

  it('should create component successfully', () => expect(component).toBeTruthy());

  it('should retrieve the payment type successfully', () => {
    spyOn(notificationService, 'getTasks').and.returnValue(of([
      {taskType: PaymentSetupSteps.Payoneer},
    ]).pipe(take(1)));
    spyOn(paymentInfoService, 'getPaymentInfo').and.returnValue(of(true));

    fixture.detectChanges();

    expect(paymentInfoService.getPaymentInfo).toHaveBeenCalledWith(
      jasmine.objectContaining({ method: 'PAYONEER' })
    );
  });

  it('should redirect the user to the onboarding index when the onboarding step is not related to payment setup', () => {
    spyOn(notificationService, 'getTasks').and.returnValue(of([
      {taskType: 'notAPaymentRelatedTask'},
    ]).pipe(take(1)));
    spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(
      ['../'], { relativeTo: route }
    );
  });

  it('should display a default error message when tasks retrieval fails', () => {
    spyOn(notificationService, 'getTasks').and.returnValue(ErrorObservable.create({}));

    fixture.detectChanges();

    expect(component.error).toBe('An unknown error happened while retrieving payment setup data');
  });

  it('should redirect the user to external payment setup page when payment setup process is started', () => {
    const redirect = 'https://my/external/payment/setup';
    spyOn(paymentInfoService, 'savePaymentInfo').and.returnValue(of({ redirect }).pipe(take(1)));
    spyOn(window.location, 'replace');

    component.setPaymentType();

    expect(window.location.replace).toHaveBeenCalledWith(redirect);
  });

  it('should display an error message when save payment setup process fails to start', () => {
    spyOn(paymentInfoService, 'savePaymentInfo').and.returnValue(ErrorObservable.create({}));

    component.setPaymentType();

    expect(component.error).toBe('An unknown error happened while setting up payment data.');
  });
});
