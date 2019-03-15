import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfActiveModal } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { mock } from 'ts-mockito';

import { WorkDiaryWithFlags } from 'app/core/models/logbook';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { TimecardsNotIdleModalComponent } from 'app/shared/components/timecards-not-idle-modal/timecards-not-idle-modal.component';

describe('TimecardsNotIdleModalComponent', () => {
  let component: TimecardsNotIdleModalComponent;
  let fixture: ComponentFixture<TimecardsNotIdleModalComponent>;

  let activeModal: DfActiveModal;
  let timetrackingService: TimetrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimecardsNotIdleModalComponent,
      ],
      providers: [
        { provide: DfActiveModal, useFactory: () => mock(DfActiveModal)},
        { provide: TimetrackingService, useFactory: () => mock(TimetrackingService)},
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimecardsNotIdleModalComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.get(DfActiveModal);
    timetrackingService = TestBed.get(TimetrackingService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should define the idle time cards when the component is initialized', () => {
    activeModal.data = {
      selectedIdleCards: [{ id: 1 }],
    };

    fixture.detectChanges();

    expect(component.idleTimeCards).toBe(activeModal.data.selectedIdleCards);
  });

  it('should change the idle status of a card when the modal form is submitted', () => {
    const idleTimecard = {} as WorkDiaryWithFlags;
    idleTimecard.id = 1;

    component.idleTimeCards = [idleTimecard];
    activeModal.data = {
      assignmentId: 13,
    };
    component.form.patchValue({
      reason: 'Meeting',
    });
    spyOn(timetrackingService, 'addWorkdiaryAction').and.returnValue(of({}));
    spyOn(activeModal, 'close').and.returnValue('');

    component.saveNotIdle();

    expect(activeModal.close).toHaveBeenCalledWith('Yes');
  });

  it('should display an error message when the server throws an error', () => {
    const idleTimecard = {} as WorkDiaryWithFlags;
    idleTimecard.id = 1;

    component.idleTimeCards = [idleTimecard];
    activeModal.data = {
      assignmentId: 13,
    };
    component.form.patchValue({
      reason: 'Meeting',
    });
    spyOn(timetrackingService, 'addWorkdiaryAction').and.returnValue(ErrorObservable.create({
      error: { text: 'Error' },
    }));

    component.saveNotIdle();

    expect(component.error).toBe('Error');
    expect(component.isSaving).toBe(false);
  });

  it('should not save the form, when the reason input is empty', () => {
    spyOn(timetrackingService, 'addWorkdiaryAction').and.returnValue(of({}));

    component.saveNotIdle();

    expect(timetrackingService.addWorkdiaryAction).not.toHaveBeenCalledWith();
  });

  it('should close the modal, when the No button is clicked', () => {
    spyOn(activeModal, 'close').and.returnValue('');

    component.close();

    expect(activeModal.close).toHaveBeenCalledWith('No');
  });
});
