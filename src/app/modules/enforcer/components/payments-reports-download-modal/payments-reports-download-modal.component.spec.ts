import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfActiveModal } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { DownloadService } from 'app/core/services/download/download.service';
import { FinanceService } from 'app/core/services/finance/finance.service';
import {
  PaymentsReportsDownloadModalComponent
} from 'app/modules/enforcer/components/payments-reports-download-modal/payments-reports-download-modal.component';

describe('PaymentsReportsDownloadModalComponent', () => {
  let component: PaymentsReportsDownloadModalComponent;
  let fixture: ComponentFixture<PaymentsReportsDownloadModalComponent>;
  let financeService: FinanceService;
  let activeModal: DfActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaymentsReportsDownloadModalComponent,
      ],
      providers: [
        { provide: FinanceService, useFactory: () => mock(FinanceService) },
        { provide: DfActiveModal, useFactory: () => mock(DfActiveModal) },
        DownloadService
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-05-01T03:24:00'));
    fixture = TestBed.createComponent(PaymentsReportsDownloadModalComponent);
    component = fixture.componentInstance;

    financeService = TestBed.get(FinanceService);
    activeModal = TestBed.get(DfActiveModal);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should set filters and enable download', () => {
    activeModal.data = { weekStartDate: new Date() };
    spyOn(financeService,'getPaymentsCount').and.returnValue(of({count: 1}).pipe(take(1)));
    fixture.detectChanges();
    expect(component.filterResultsCount).toBe(1);
  });

  it('should set filters and disable download', () => {
    activeModal.data = { weekStartDate: new Date() };
    component.platforms['PAYONEER'] = false;
    component.platforms['PAYCHEX'] = false;
    component.changeFilterAndQuery();
    expect(component.filterResultsCount).toBe(0);
  });

  it('should download report', () => {
    activeModal.data = { weekStartDate: new Date() };
    spyOn(activeModal,'close');
    spyOn(financeService,'downloadPaymentsReport').and.returnValue(of({}).pipe(take(1)));
    component.downloadReports();
    expect(activeModal.close).toHaveBeenCalled();
  });
});
