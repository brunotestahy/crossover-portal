import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfActiveModal } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { WorkDiaryImage, WorkDiaryWithFlags } from 'app/core/models/logbook';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { DeleteTimecardsModalComponent } from 'app/shared/components/delete-timecards-modal/delete-timecards-modal.component';

describe('DeleteTimecardsModalComponent', () => {
  let component: DeleteTimecardsModalComponent;
  let fixture: ComponentFixture<DeleteTimecardsModalComponent>;
  let activeModal: DfActiveModal;
  let timetrackingService: TimetrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DeleteTimecardsModalComponent,
      ],
      providers: [
        { provide: DfActiveModal, useFactory: () => mock(DfActiveModal) },
        { provide: TimetrackingService, useFactory: () => mock(TimetrackingService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTimecardsModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.get(DfActiveModal);
    timetrackingService = TestBed.get(TimetrackingService);
    activeModal.data = {
      diaries: [
        {
          id: 1,
          type: 'type1',
          images: [
            {
              type: 'SCREENSHOT',
              createdAt: '2018-01-01',
            } as WorkDiaryImage,
          ],
          screenshot: {
            type: 'SCREENSHOT',
            createdAt: '2018-01-01',
          } as WorkDiaryImage,
        } as WorkDiaryWithFlags,
        {
          id: 2,
          type: 'type2',
          images: [
            {
              type: 'SCREENSHOT',
              createdAt: '2018-01-01',
            } as WorkDiaryImage,
          ],
          screenshot: {
            type: 'SCREENSHOT',
            createdAt: '2018-01-01',
          } as WorkDiaryImage,
        } as WorkDiaryWithFlags,
      ],
      is12HFormat: true,
    };
  });

  it('[ngOnInit] should set diaries and time format when time format is 12hour', () => {
    fixture.detectChanges();
    expect(component.diaries).toEqual(activeModal.data.diaries);
    expect(component.is12HFormat).toEqual(activeModal.data.is12HFormat);
  });

  it('[ngOnInit] should set diaries and time format when time format is 24hour', () => {
    activeModal.data.is12HFormat = false;
    fixture.detectChanges();
    expect(component.diaries).toEqual(activeModal.data.diaries);
    expect(component.is12HFormat).toBe(false);
  });

  it('[deleteTimecards] should delete timecards', () => {
    spyOn(timetrackingService, 'deleteTimecards').and.returnValue(of({}).pipe(take(1)));
    fixture.detectChanges();
    component.deleteTimecards();
    expect(timetrackingService.deleteTimecards).toHaveBeenCalledWith([1, 2]);
  });

  it('[deleteTimecards] should throw error message when an error occurs during the execution', () => {
    spyOn(timetrackingService, 'deleteTimecards').and.returnValue(Observable.throw({}));
    fixture.detectChanges();
    component.deleteTimecards();
    expect(component.error).toEqual('Error deleting timecards.');
  });

  it('[close] should close modal', () => {
    spyOn(activeModal, 'close');
    component.close();
    expect(activeModal.close).toHaveBeenCalled();
  });
});
