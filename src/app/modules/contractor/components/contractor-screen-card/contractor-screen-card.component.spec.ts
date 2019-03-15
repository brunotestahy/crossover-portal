import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock } from 'ts-mockito';

import { OnlineStatusService } from 'app/core/services/timetracking/online-status.service';
import { ContractorScreenCardComponent } from 'app/modules/contractor/components/contractor-screen-card/contractor-screen-card.component';

describe('ContractorScreenCardComponent', () => {
  let component: ContractorScreenCardComponent;
  let fixture: ComponentFixture<ContractorScreenCardComponent>;

  let onlineStatusService: OnlineStatusService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContractorScreenCardComponent,
      ],
      providers: [
        { provide: OnlineStatusService, useFactory: () => mock(OnlineStatusService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorScreenCardComponent);
    component = fixture.componentInstance;

    onlineStatusService = TestBed.get(OnlineStatusService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display the work diary correctly when the contractor card is selected', () => {
    component.assignment = Object.assign({
      candidate: {
        photoUrl: '',
        printableName: 'John',
      },
    });
    const workDiary = Object.assign({ id: 1, screenshot: { currentWindow: 'Window', url: '' } });
    spyOn(onlineStatusService, 'getWorkDiary').and.returnValue(workDiary);

    fixture.detectChanges();

    expect(component.workDiary).toBe(workDiary);
  });

  it('should not display the work diary when the contractor card is selected', () => {
    component.assignment = Object.assign({
      candidate: {
        photoUrl: '',
        printableName: 'John',
      },
    });
    const workDiary = Object.assign({ value: null }).value;
    spyOn(onlineStatusService, 'getWorkDiary').and.returnValue(workDiary);

    fixture.detectChanges();

    expect(component.workDiary).toBeNull();
    expect(component.getOnlineStatusClass()).toBe('');
    expect(component.getWorkDiaryTime()).toBe('');
  });
});
