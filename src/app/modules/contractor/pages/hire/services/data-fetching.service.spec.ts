import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { Subject } from 'rxjs/Subject';

import { DataFetchingService } from 'app/modules/contractor/pages/hire/services/data-fetching.service';

describe('HireComponent - DataFetchingService', () => {
  let dataFetchingService: DataFetchingService;
  let destroy$: Subject<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      providers: [
        DataFetchingService,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    dataFetchingService = TestBed.get(DataFetchingService);
    destroy$ = new Subject();
  });

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('should fetch data successfully when a valid team is selected', () => {
    const assignmentTeamData = Object.assign([]);
    const assignmentService = {
      getAssignmentsForTeam: () => of({ content: assignmentTeamData })
    };
    const identityService = {
      getTeamManagerGroupSelection: () => of({
        team: { id:1 }
      })
    };
    const instance = Object.assign({
      assignmentService,
      identityService,
      destroy$
    });
    dataFetchingService.load(instance);

    expect(instance.assignments).toBeDefined();
    expect(instance.assignments).toBe(assignmentTeamData);
    expect(instance.isLoading).toBe(false);
  });

  it('should set an error message when an error occurs during data fetching', () => {
    const assignmentService = {
      getAssignmentsForTeam: jasmine.createSpy().and.returnValue(_throw({})),
    };
    const identityService = {
      getTeamManagerGroupSelection: () => of({
        team: { id:1 }
      })
    };
    const instance = Object.assign({
      assignmentService,
      identityService,
      destroy$
    });
    dataFetchingService.load(instance);

    expect(instance.error).toBe('An error occurred while retrieving assignment data.')
    expect(instance.isLoading).toBe(false);
  });
});
