import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DfModalService } from '@devfactory/ngx-df';
import { format, subWeeks } from 'date-fns';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { DownloadService } from 'app/core/services/download/download.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { CURRENT_USER_DETAIL_MOCK } from 'app/core/services/mocks/current-user-detail.mock';
import { SAMPLE_EARNINGS } from 'app/core/services/mocks/earnings.mock';
import { PaymentInfoService } from 'app/core/services/payment-info/payment-info.service';
import { EarningsComponent } from 'app/modules/contractor/pages/earnings/earnings.component';
import { FormatHoursPipe } from 'app/shared/pipes/format-hours.pipe';

describe('EarningsComponent', () => {
  let component: EarningsComponent;
  let fixture: ComponentFixture<EarningsComponent>;
  let identityService: IdentityService;
  let paymentInfoService: PaymentInfoService;
  let downloadService: DownloadService;
  let breakpointObserver: BreakpointObserver;
  const SAMPLE_TOKEN = 'f126b1c3-391b-4157-b687-8b0fcc74a4f6';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [EarningsComponent, FormatHoursPipe],
      imports: [],
      providers: [
        { provide: BreakpointObserver, useFactory: () => mock(BreakpointObserver) },
        { provide: ActivatedRoute, useValue: { params: of({ token: SAMPLE_TOKEN }) } },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: PaymentInfoService, useFactory: () => mock(PaymentInfoService) },
        { provide: DownloadService, useFactory: () => mock(DownloadService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: FormatHoursPipe, useFactory: () => mock(FormatHoursPipe) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-05-18T03:24:00'));
    fixture = TestBed.createComponent(EarningsComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
    paymentInfoService = TestBed.get(PaymentInfoService);
    downloadService = TestBed.get(DownloadService);
    breakpointObserver = TestBed.get(BreakpointObserver);
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: true }]));
    const todayDate = new Date();
    const eightWeekBeforeDate = subWeeks(new Date(), 8);
    component.form = new FormGroup({
      from: new FormControl(eightWeekBeforeDate, [Validators.required]),
      to: new FormControl(todayDate, [Validators.required]),
    });
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('check if the component has been created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should get prerequisites', () => {
    spyOn(component, 'onChanges');
    spyOn(component, 'getCurrentUserDetail');
    spyOn(component, 'getCurrentUserPayments');
    fixture.detectChanges();
    expect(component.onChanges).toHaveBeenCalled();
    expect(component.getCurrentUserPayments).toHaveBeenCalled();
    expect(component.onChanges).toHaveBeenCalled();
  });

  it('should get current user payments when date range is changed', () => {
    spyOn(component, 'getCurrentUserPayments');
    const sampleDate = new Date();
    component.onChanges();
    component.form.controls.from.setValue(sampleDate);
    expect(component.getCurrentUserPayments).toHaveBeenCalled();
  });

  it('should get current user payments successfully', () => {
    spyOn(paymentInfoService, 'getCurrentUserPayments')
      .and.returnValue(Observable.of(SAMPLE_EARNINGS).pipe(take(1)));
    component.getCurrentUserPayments();
    expect(paymentInfoService.getCurrentUserPayments).toHaveBeenCalled();
    expect(component.earnings.length).toBe(2);
  });

  it('should return server error without error text when fetching current user payments', () => {
    spyOn(paymentInfoService, 'getCurrentUserPayments')
      .and.returnValue(Observable.throw({ error: 'server error' }));
    component.getCurrentUserPayments();
    expect(paymentInfoService.getCurrentUserPayments).toHaveBeenCalled();
    expect(component.error).toBe('Error fetching earnings.');
  });

  it('should return server error with error text when fetching current user payments', () => {
    spyOn(paymentInfoService, 'getCurrentUserPayments')
      .and.returnValue(Observable.throw({
        error: {
          errorCode: 400,
          type: 'type',
          httpStatus: 400,
          text: 'error',
        },
      }));
    component.getCurrentUserPayments();
    expect(paymentInfoService.getCurrentUserPayments).toHaveBeenCalled();
    expect(component.error).toBe('error');
  });

  describe('[downloadIncomeStatement]', () => {
    it('should download income statement successfully', () => {
      spyOn(paymentInfoService, 'getIncomeStatement').and.returnValue(Observable.of({}));
      spyOn(downloadService, 'download').and.returnValue(Observable.of({}));
      const fileName = `IncomeStatement.pdf`;
      const blob = new Blob([{}], { type: 'application/pdf;charset=utf-8' });
      component.downloadIncomeStatement();
      expect(paymentInfoService.getIncomeStatement).toHaveBeenCalled();
      expect(downloadService.download).toHaveBeenCalledWith(blob, fileName);
    });

    it('should thorow error with error text when downloading income statement', () => {
      const ERROR = 'error';
      spyOn(paymentInfoService, 'getIncomeStatement').and.returnValue(Observable.throw({
        error: {
          errorCode: 400,
          type: 'type',
          httpStatus: 400,
          text: ERROR,
        },
      }));
      component.downloadIncomeStatement();
      expect(paymentInfoService.getIncomeStatement).toHaveBeenCalled();
      expect(component.error).toBe(ERROR);
    });

    it('should thorow error with error text when downloading income statement', () => {
      spyOn(paymentInfoService, 'getIncomeStatement').and.returnValue(Observable.throw({}));
      component.downloadIncomeStatement();
      expect(paymentInfoService.getIncomeStatement).toHaveBeenCalled();
      expect(component.error).toBe('Error downloading statement.');
    });
  });

  describe('[downloadPaymentReport]', () => {
    it('should download payment report', () => {
      spyOn(paymentInfoService, 'getPaymentReport').and.returnValue(Observable.of({}));
      spyOn(downloadService, 'download').and.returnValue(Observable.of({}));
      const blob = new Blob([{}], { type: 'text/csv' });
      const fileName = `earnings-report_${format(new Date(), 'MM-DD-YYYY')}.csv`;
      component.downloadPaymentReport();
      expect(paymentInfoService.getPaymentReport).toHaveBeenCalled();
      expect(downloadService.download).toHaveBeenCalledWith(blob, fileName);
    });

    it('should thorow error with error text when downloading payment report', () => {
      const ERROR = 'error';
      spyOn(paymentInfoService, 'getPaymentReport').and.returnValue(Observable.throw({
        error: {
          errorCode: 400,
          type: 'type',
          httpStatus: 400,
          text: ERROR,
        },
      }));
      component.downloadPaymentReport();
      expect(paymentInfoService.getPaymentReport).toHaveBeenCalled();
      expect(component.error).toBe(ERROR);
    });

    it('should thorow error with error text when downloading payment report', () => {
      spyOn(paymentInfoService, 'getPaymentReport').and.returnValue(Observable.throw({}));
      component.downloadPaymentReport();
      expect(paymentInfoService.getPaymentReport).toHaveBeenCalled();
      expect(component.error).toBe('Error downloading statement.');
    });
  });

  describe('[getCurrentUserDetail]', () => {
    it('should get current user detail', () => {
      spyOn(identityService, 'getCurrentUserDetail').and.returnValue(Observable.of(CURRENT_USER_DETAIL_MOCK));
      component.getCurrentUserDetail();
      expect(identityService.getCurrentUserDetail).toHaveBeenCalled();
    });
    it('should thorow error with error text when fetching current user detail', () => {
      const ERROR = 'error';
      spyOn(identityService, 'getCurrentUserDetail').and.returnValue(Observable.throw({
        error: {
          errorCode: 400,
          type: 'type',
          httpStatus: 400,
          text: ERROR,
        },
      }));
      component.getCurrentUserDetail();
      expect(identityService.getCurrentUserDetail).toHaveBeenCalled();
      expect(component.error).toBe(ERROR);
    });

    it('should thorow error with error text when fetching current user detail', () => {
      spyOn(identityService, 'getCurrentUserDetail').and.returnValue(Observable.throw({}));
      component.getCurrentUserDetail();
      expect(identityService.getCurrentUserDetail).toHaveBeenCalled();
      expect(component.error).toBe('Error fetching user details.');
    });
  });

  it('should change date successfully', () => {
    const sampleDate = new Date();
    component.onDateChange(sampleDate);
    expect(component.earningdate).toBe(sampleDate);
  });

  it('should set earningdate to todays date successfully', () => {
    component.setDateToToday();
    expect(component.earningdate).toEqual(new Date());
  });
});
