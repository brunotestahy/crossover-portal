import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { mock } from 'ts-mockito';

import { Assignment } from 'app/core/models/assignment';
import { WorkDiary } from 'app/core/models/logbook';
import { ProductivityGroup, TimeSlot } from 'app/core/models/productivity';
import { TeamManagerGroup } from 'app/core/models/team';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { OnlineStatusService } from 'app/core/services/timetracking/online-status.service';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { ContractorActivityComponent } from 'app/modules/contractor/components/dashboard/contractor-activity/contractor-activity.component';

describe('ContractorActivityComponent', () => {
  let component: ContractorActivityComponent;
  let fixture: ComponentFixture<ContractorActivityComponent>;

  let identityService: IdentityService;
  let productivityService: ProductivityService;
  let timetrackingService: TimetrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContractorActivityComponent,
      ],
      imports: [
      ],
      providers: [
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: OnlineStatusService, useFactory: () => mock(OnlineStatusService) },
        { provide: ProductivityService, useFactory: () => mock(ProductivityService) },
        { provide: TimetrackingService, useFactory: () => mock(TimetrackingService) }
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorActivityComponent);
    component = fixture.componentInstance;

    identityService = TestBed.get(IdentityService);
    productivityService = TestBed.get(ProductivityService);
    timetrackingService = TestBed.get(TimetrackingService);

    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-07-05T05:45:00'));
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should init properly', () => {
    component.today = new Date();
    const teamManagerGroup = {
      managerId: 123,
      team: {}
    } as TeamManagerGroup;
    spyOn(identityService, 'getTeamManagerGroupSelectionValue').and.returnValue(teamManagerGroup);
    component.assignment = {
      id: 345,
      candidate: {
        location: {
          timeZone: {
            id: 567
          }
        }
      },
      team: {
        id: 456
      }
    } as Assignment;
    const dailyActivity = {
      grouping: {
        intensityScore: 5,
        focusScore: 45,
        alignmentScore: 95
      },
      dayActivitiesTime: {
        contractorTimeSlots: [{
          index: 0,
          timeSlot: ''
        },
        null]
      }
    } as ProductivityGroup;
    spyOn(identityService, 'getCurrentUserValue').and.returnValue({managerAvatar: {id: 234}});
    spyOn(productivityService, 'getDailyActivity').and.returnValue(Observable.of([dailyActivity]));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(Observable.of([{
      screenshot: {
        url: 'testUrl'
      }
    }]));

    fixture.detectChanges();

    expect(component.currentTeam).toBe(teamManagerGroup);
    expect(component.timeSlotsGrid.length).toBe(144);
    expect(component.timeSlotsHeaders.length).toBe(24);

    expect(productivityService.getDailyActivity).toHaveBeenCalledWith('2018-07-05', undefined, '234', '345', '456');
    expect(timetrackingService.getWorkDiaries).toHaveBeenCalledWith({
      assignmentId: 345,
      date: '2018-07-05',
      timeZoneId: 567
    });
    expect(component.dailyActivity).toBe(dailyActivity);
    expect(component.intensity).toBe(5);
    expect(component.focus).toBe(45);
    expect(component.alignment).toBe(95);
    expect(component.timeSlots.length).toBe(2);
    expect(component.workDiaries.length).toBe(2);
    expect(component.selectedTimeSlot).toBe(component.timeSlots[0]);
    expect(component.currentImageUrl).toBe('testUrl');
  });

  it('should init when no time slots', () => {
    component.today = new Date();
    const teamManagerGroup = {
      managerId: 123,
      team: {
        id: 456,
        teamOwner: {
          id: 234
        }
      }
    } as TeamManagerGroup;
    spyOn(identityService, 'getTeamManagerGroupSelectionValue').and.returnValue(teamManagerGroup);
    component.assignment = {
      id: 345,
      candidate: {
        location: {
          timeZone: {
            id: 567
          }
        }
      },
      team: {
        id: 456
      }
    } as Assignment;
    const dailyActivity = {
      grouping: {
        intensityScore: 5,
        focusScore: 45,
        alignmentScore: 95
      },
      dayActivitiesTime: {
        contractorTimeSlots: [] as TimeSlot[]
      }
    } as ProductivityGroup;
    spyOn(productivityService, 'getDailyActivity').and.returnValue(Observable.of([dailyActivity]));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(Observable.of([{
      screenshot: {
        url: 'testUrl'
      }
    }]));

    fixture.detectChanges();

    expect(component.currentTeam).toBe(teamManagerGroup);
    expect(component.timeSlotsGrid.length).toBe(144);
    expect(component.timeSlotsHeaders.length).toBe(24);

    expect(productivityService.getDailyActivity).toHaveBeenCalledWith('2018-07-05', undefined, '234', '345', '456');
    expect(timetrackingService.getWorkDiaries).toHaveBeenCalledWith({
      assignmentId: 345,
      date: '2018-07-05',
      timeZoneId: 567
    });
    expect(component.dailyActivity).toBe(dailyActivity);
    expect(component.intensity).toBe(5);
    expect(component.focus).toBe(45);
    expect(component.alignment).toBe(95);
    expect(component.timeSlots.length).toBe(0);
    expect(component.workDiaries.length).toBe(0);
    expect(component.selectedTimeSlot).toBeUndefined();
    expect(component.currentImageUrl).toBeUndefined();
  });

  it('should get daily format', () => {
    expect(component.getDailyFormat(new Date())).toBe('July 5');
  });

  it('should get slot color', () => {
    expect(component.getSlotColor({index: 1})).toBe('white');
    expect(component.getSlotColor({index: 2, color: 'red'})).toBe('red');
  });

  it('should get opacity', () => {
    component.selectedTimeSlot = {appId: 2} as TimeSlot;
    component.timeSlots = [{appId: 3}, component.selectedTimeSlot] as TimeSlot[];
    expect(component.getOpacity(1)).toBe('selected-slot');
    expect(component.getOpacity(0)).toBe('regular-slot');
  });

  it('should get slot height', () => {
    component.selectedTimeSlot = {appId: 2} as TimeSlot;
    component.timeSlots = [{appId: 3}, component.selectedTimeSlot] as TimeSlot[];
    expect(component.getSlotHeight(1)).toBe('100');
    expect(component.getSlotHeight(0)).toBe('75');
  });

  it('should select next time slot', () => {
    const teamManagerGroup = {
      managerId: 123,
      team: {}
    } as TeamManagerGroup;
    spyOn(identityService, 'getTeamManagerGroupSelectionValue').and.returnValue(teamManagerGroup);
    component.assignment = {
      id: 345,
      candidate: {
        location: {
          timeZone: {
            id: 567
          }
        }
      },
      team: {
        id: 456
      }
    } as Assignment;
    const dailyActivity = {
      grouping: {
        intensityScore: 5,
        focusScore: 45,
        alignmentScore: 95
      },
      dayActivitiesTime: {
        contractorTimeSlots: [{
          index: 0,
          timeSlot: ''
        },
        null]
      }
    } as ProductivityGroup;
    spyOn(identityService, 'getCurrentUserValue').and.returnValue({managerAvatar: {id: 234}});
    spyOn(productivityService, 'getDailyActivity').and.returnValue(Observable.of([dailyActivity]));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(Observable.of([{
      screenshot: {
        url: 'testUrl'
      }
    }]));

    fixture.detectChanges();
    component.selectedTimeSlot = {
      index: 1
    } as TimeSlot;
    component.timeSlots = [
      {index: 0},
      component.selectedTimeSlot,
      {index: undefined},
      {index: 3}
    ] as TimeSlot[];
    component.workDiaries = [{},{screenshot:{}},{},{screenshot: {url: 'testUrl2'}}] as WorkDiary[];
    fixture.detectChanges();

    component.nextTimeSlot();
    fixture.detectChanges();

    expect(component.selectedTimeSlot.index).toBe(3);
    expect(component.currentImageUrl).toBe('testUrl2');
  });

  it('should select previous time slot', () => {
    const teamManagerGroup = {
      managerId: 123,
      team: {}
    } as TeamManagerGroup;
    spyOn(identityService, 'getTeamManagerGroupSelectionValue').and.returnValue(teamManagerGroup);
    component.assignment = {
      id: 345,
      candidate: {
        location: {
          timeZone: {
            id: 567
          }
        }
      },
      team: {
        id: 456
      }
    } as Assignment;
    const dailyActivity = {
      grouping: {
        intensityScore: 5,
        focusScore: 45,
        alignmentScore: 95
      },
      dayActivitiesTime: {
        contractorTimeSlots: [{
          index: 0,
          timeSlot: ''
        },
        null]
      }
    } as ProductivityGroup;
    spyOn(identityService, 'getCurrentUserValue').and.returnValue({managerAvatar: {id: 234}});
    spyOn(productivityService, 'getDailyActivity').and.returnValue(Observable.of([dailyActivity]));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(Observable.of([{
      screenshot: {
        url: 'testUrl'
      }
    }]));

    fixture.detectChanges();
    component.selectedTimeSlot = {
      index: 3
    } as TimeSlot;
    component.timeSlots = [
      {index: 0},
      {index: 1},
      {index: undefined},
      component.selectedTimeSlot
    ] as TimeSlot[];
    component.workDiaries = [{},{screenshot: {url: 'testUrl3'}},{},{screenshot:{}}] as WorkDiary[];
    fixture.detectChanges();

    fixture.detectChanges();
    component.previousTimeSlot();
    fixture.detectChanges();

    expect(component.selectedTimeSlot.index).toBe(1);
    expect(component.currentImageUrl).toBe('testUrl3');
    expect(component.isFirstSlot()).toBe(false);
    expect(component.isLastSlot()).toBe(false);
  });

  it('should add 1 day', () => {
    component.dateControl.setValue(new Date());
    const teamManagerGroup = {
      managerId: 123,
      team: {
        id: 456,
        teamOwner: {
          id: 234
        }
      }
    } as TeamManagerGroup;
    spyOn(identityService, 'getTeamManagerGroupSelectionValue').and.returnValue(teamManagerGroup);
    component.assignment = {
      id: 345,
      candidate: {
        location: {
          timeZone: {
            id: 567
          }
        }
      },
      team: {
        id: 456
      }
    } as Assignment;
    const dailyActivity = {
      grouping: {
        intensityScore: 5,
        focusScore: 45,
        alignmentScore: 95
      },
      dayActivitiesTime: {
        contractorTimeSlots: [{
          index: 0
        },
        null]
      }
    } as ProductivityGroup;
    const activitySpy = spyOn(productivityService, 'getDailyActivity').and.returnValue(Observable.of([dailyActivity]));
    const diariesSpy = spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(Observable.of([{
      screenshot: {
        url: 'testUrl'
      }
    }]));

    fixture.detectChanges();
    component.nextDay();
    fixture.detectChanges();

    expect(activitySpy.calls.count()).toBe(2);
    expect(diariesSpy.calls.count()).toBe(2);
    expect(productivityService.getDailyActivity).toHaveBeenCalledWith('2018-07-06', undefined, '234', '345', '456');
    expect(timetrackingService.getWorkDiaries).toHaveBeenCalledWith({
      assignmentId: 345,
      date: '2018-07-06',
      timeZoneId: 567
    });
  });

  it('should subtract 1 day', () => {
    component.dateControl.setValue(new Date());
    component.today = new Date();
    const teamManagerGroup = {
      managerId: 123,
      team: {
        id: 456,
        teamOwner: {
          id: 234
        }
      }
    } as TeamManagerGroup;
    spyOn(identityService, 'getTeamManagerGroupSelectionValue').and.returnValue(teamManagerGroup);
    component.assignment = {
      id: 345,
      candidate: {
        location: {
          timeZone: {
            id: 567
          }
        }
      },
      team: {
        id: 456
      }
    } as Assignment;
    const dailyActivity = {
      grouping: {
        intensityScore: 5,
        focusScore: 45,
        alignmentScore: 95
      },
      dayActivitiesTime: {
        contractorTimeSlots: [{
          index: 0
        },
        null]
      }
    } as ProductivityGroup;
    const activitySpy = spyOn(productivityService, 'getDailyActivity').and.returnValue(Observable.of([dailyActivity]));
    const diariesSpy = spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(Observable.of([{
      screenshot: {
        url: 'testUrl'
      }
    }]));

    fixture.detectChanges();
    component.previousDay();
    fixture.detectChanges();

    expect(activitySpy.calls.count()).toBe(2);
    expect(diariesSpy.calls.count()).toBe(2);
    expect(productivityService.getDailyActivity).toHaveBeenCalledWith('2018-07-04', undefined, '234', '345', '456');
    expect(timetrackingService.getWorkDiaries).toHaveBeenCalledWith({
      assignmentId: 345,
      date: '2018-07-04',
      timeZoneId: 567
    });
  });

  it('should fetch today', () => {
    component.today = new Date();
    const teamManagerGroup = {
      managerId: 123,
      team: {
        id: 456,
        teamOwner: {
          id: 234
        }
      }
    } as TeamManagerGroup;
    spyOn(identityService, 'getTeamManagerGroupSelectionValue').and.returnValue(teamManagerGroup);
    component.assignment = {
      id: 345,
      candidate: {},
      team: {
        id: 456
      }
    } as Assignment;
    const dailyActivity = {
      grouping: {
        intensityScore: 5,
        focusScore: 45,
        alignmentScore: 95
      },
      dayActivitiesTime: {
        contractorTimeSlots: [{
        },
        null]
      }
    } as ProductivityGroup;
    const activitySpy = spyOn(productivityService, 'getDailyActivity').and.returnValue(Observable.of([dailyActivity]));
    const diariesSpy = spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(Observable.of([{
      screenshot: {
        url: 'testUrl'
      }
    }]));

    fixture.detectChanges();
    component.fetchToday();
    fixture.detectChanges();

    expect(activitySpy.calls.count()).toBe(2);
    expect(diariesSpy.calls.count()).toBe(2);
    expect(productivityService.getDailyActivity).toHaveBeenCalledWith('2018-07-05', undefined, '234', '345', '456');
    expect(timetrackingService.getWorkDiaries).toHaveBeenCalledWith({
      assignmentId: 345,
      date: '2018-07-05'
    });
  });

  it('should emit event on close', (done: DoneFn) => {
    component.close.subscribe(() => {
        done();
    });
    component.onClose();
  });
});
