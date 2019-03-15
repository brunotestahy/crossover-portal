import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CalendarDateFormatter, CalendarModule } from 'angular-calendar';
import { InterviewService } from 'app/core/services/interview/interview.service';
import { SAMPLE_INTERVIEW } from 'app/core/services/mocks/interview.mock';
import { FormatHoursPipe } from 'app/shared/pipes/format-hours.pipe';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { AcceptInterviewComponent } from './accept-interview.component';

class DummyComponent {
}

describe('AcceptInterviewComponent', () => {
  let component: AcceptInterviewComponent;
  let fixture: ComponentFixture<AcceptInterviewComponent>;
  let interviewService: InterviewService;
  const SAMPLE_TOKEN = 'f126b1c3-391b-4157-b687-8b0fcc74a4f6';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AcceptInterviewComponent, FormatHoursPipe],
      imports: [CalendarModule, RouterTestingModule.withRoutes([
        { path: 'candidate/dashboard/hiring', component: DummyComponent },
      ])],
      providers: [
        { provide: CalendarDateFormatter, useFactory: () => mock(CalendarDateFormatter) },
        { provide: ActivatedRoute, useValue: { params: of({ token: SAMPLE_TOKEN }) } },
        { provide: InterviewService, useFactory: () => mock(InterviewService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptInterviewComponent);
    component = fixture.componentInstance;
    interviewService = TestBed.get(InterviewService);
  });

  it('check if the component has been created', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit -  getInterviewDetails should get interview detail', () => {
    spyOn(interviewService, 'getInterviewDetails').and.returnValue(of(SAMPLE_INTERVIEW));
    component.ngOnInit();
    expect(interviewService.getInterviewDetails).toHaveBeenCalled();
  });

  it('ngOnInit -  getInterviewDetails should thorow server error', () => {
    spyOn(interviewService, 'getInterviewDetails').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    component.ngOnInit();
    expect(interviewService.getInterviewDetails).toHaveBeenCalled();
    expect(component.error).toBe('error');
  });

  it('selectSlot - should select slot', () => {
    const slot = '2018-03-21T16:00:00.000+0000';
    component.selectSlot(slot);
    expect(component.selectedSlot).toEqual(slot);
  });

  it('enableReschedule - should enable Reschedule', () => {
    component.rescheduleElement = { nativeElement: { scrollIntoView: () => true } };
    component.enableReschedule();
    expect(component.rescheduleEnabled).toBe(true);
    expect(component.rescheduleElement.nativeElement.scrollIntoView()).toBe(true);
  });

  it('disableReschedule - should disable Reschedule', () => {
    component.disableReschedule();
    expect(component.rescheduleEnabled).toBe(false);
  });

  it('saveInterviewSchedule - should save Interview Schedule ', () => {
    spyOn(interviewService, 'saveInterviewSchedule').and.returnValue(of(SAMPLE_INTERVIEW));
    component.saveInterviewSchedule();
    expect(interviewService.saveInterviewSchedule).toHaveBeenCalled();
  });

  it('saveInterviewSchedule - should throw server error ', () => {
    spyOn(interviewService, 'saveInterviewSchedule').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    component.saveInterviewSchedule();
    expect(interviewService.saveInterviewSchedule).toHaveBeenCalled();
    expect(component.error).toBe('error');
  });

  it('saveInterviewSchedule - should throw server error without error text ', () => {
    spyOn(interviewService, 'saveInterviewSchedule').and.returnValue(Observable.throw({
      error: {},
    }));
    component.saveInterviewSchedule();
    expect(interviewService.saveInterviewSchedule).toHaveBeenCalled();
    expect(component.error).toBe('Error scheduling interview.');
  });

  it('submitReschedule - should save submit Reschedule ', () => {
    spyOn(interviewService, 'submitReschedule').and.returnValue(of(SAMPLE_INTERVIEW));
    component.ngOnInit();
    component.pendingReschedule = false;
    component.rescheduleForm.controls['message'].setValue('test');
    component.submitReschedule();
    expect(interviewService.submitReschedule).toHaveBeenCalled();
  });

  it('submitReschedule - should throw server error ', () => {
    spyOn(interviewService, 'submitReschedule').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    component.ngOnInit();
    component.rescheduleForm.controls['message'].setValue('test');
    component.pendingReschedule = false;
    component.submitReschedule();
    expect(interviewService.submitReschedule).toHaveBeenCalled();
    expect(component.error).toBe('error');
  });

  it('submitReschedule - should throw server error without error text', () => {
    spyOn(interviewService, 'submitReschedule').and.returnValue(Observable.throw({
      error: {},
    }));
    component.ngOnInit();
    component.rescheduleForm.controls['message'].setValue('test');
    component.pendingReschedule = false;
    component.submitReschedule();
    expect(interviewService.submitReschedule).toHaveBeenCalled();
    expect(component.error).toBe('Error rescheduling interview.');
  });

  it('nextMonth -  should return next month', () => {
    component.viewDate = new Date('October 13, 2017');
    component.nextMonth();

    expect(component.viewDate.getMonth()).toBe(10);
  });

  it('prevMonth - should return pre month', () => {
    component.viewDate = new Date('October 13, 2017');
    component.prevMonth();

    expect(component.viewDate.getMonth()).toBe(8);
  });

  it('isSameMonth - should return true if same month', () => {
    component.viewDate = new Date();
    const isSame = component.isSameMonth();

    expect(isSame).toBe(true);
  });
});
