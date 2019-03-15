import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { NotificationService } from 'app/core/services/notification/notification.service';
import { PaymentInfoService } from 'app/core/services/payment-info/payment-info.service';
import {
  PayoneerCompleteComponent,
} from 'app/modules/onboarding/pages/payoneer-complete/payoneer-complete.component';


describe('PayoneerCompleteComponent', () => {
  let component: PayoneerCompleteComponent;
  let fixture: ComponentFixture<typeof component>;

  let paymentInfoService: PaymentInfoService;
  let notificationService: NotificationService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PayoneerCompleteComponent],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: NotificationService, useFactory: () => mock(NotificationService) },
        { provide: PaymentInfoService, useFactory: () => mock(PaymentInfoService) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoneerCompleteComponent);
    component = fixture.componentInstance;
    paymentInfoService = TestBed.get(PaymentInfoService);
    notificationService = TestBed.get(NotificationService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
  });

  it('should create component successfully',
    () => expect(component).toBeTruthy()
  );

  it('should redirect the user to the onboarding index when Payoneer activation is complete', () => {
    const object = { id: 12345 };
    spyOn(paymentInfoService, 'activatePaymentInfo').and.returnValue(of(true).pipe(take(1)));
    spyOn(notificationService, 'getTasks').and.returnValue(of([
      { object },
    ]).take(1));
    spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['../', object.id], { relativeTo: route });
  });

  it('should redirect the user to onboarding index when Payoneer activation fails', () => {
    const object = { id: 12345 };
    spyOn(paymentInfoService, 'activatePaymentInfo').and.returnValue(ErrorObservable.create(true));
    spyOn(notificationService, 'getTasks').and.returnValue(of([
      { object },
    ]).take(1));
    spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['../', object.id], { relativeTo: route });
  });

  it('should redirect the user to root when tasks retrieval fails', () => {
    spyOn(paymentInfoService, 'activatePaymentInfo').and.returnValue(of(true).pipe(take(1)));
    spyOn(notificationService, 'getTasks').and.returnValue(ErrorObservable.create(true));
    spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should redirect the user to root when no task is found', () => {
    spyOn(paymentInfoService, 'activatePaymentInfo').and.returnValue(ErrorObservable.create(true));
    spyOn(notificationService, 'getTasks').and.returnValue(of([]).take(1));
    spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
