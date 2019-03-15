import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfActiveModal } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { TimecardDetailsModalComponent } from 'app/shared/components/timecard-details-modal/timecard-details-modal.component';

describe('TimecardDetailsModalComponent', () => {
  let component: TimecardDetailsModalComponent;
  let fixture: ComponentFixture<TimecardDetailsModalComponent>;

  let activeModal: DfActiveModal;
  let breakpointObserver: BreakpointObserver;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimecardDetailsModalComponent,
      ],
      providers: [
        { provide: DfActiveModal, useFactory: () => mock(DfActiveModal) },
        { provide: BreakpointObserver, useFactory: () => mock(BreakpointObserver) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimecardDetailsModalComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.get(DfActiveModal);
    breakpointObserver = TestBed.get(BreakpointObserver);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the screenshot missing state when there is not a valid screenshot', () => {
    component.isScreenshotMissing = false;

    component.setScreenshotMissingState(true);

    expect(component.isScreenshotMissing).toBe(true);
  });

  it('should load the main content correctly when the detail modal is initialized', () => {
    activeModal.data = {
      events: [{ date: '2018-01-01' }],
      screenshot: 'http://screen',
    };
    spyOn(breakpointObserver, 'observe').and.returnValue(of({ matches: true }));

    fixture.detectChanges();

    expect(component.isResponsive).toBe(true);
    expect(component.diary).toBe(activeModal.data);
    expect(component.screenshot).toBe(activeModal.data.screenshot);
  });

  it('should close the modal when the close button is clicked', () => {
    spyOn(activeModal, 'close').and.returnValue('');

    component.close();

    expect(activeModal.close).toHaveBeenCalledWith();
  });
});
