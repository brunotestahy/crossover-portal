import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfModalService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { DownloadService } from 'app/core/services/download/download.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { CURRENT_USER_DETAIL_MANAGER_MOCK } from 'app/core/services/mocks/current-user-detail.mock';
import { REPORTS_ACTIVITIES_MOCK } from 'app/core/services/mocks/reports-activities.mock';
import { ReportsService } from 'app/core/services/reports/reports.service';
import { ReportsComponent } from 'app/modules/contractor/pages/reports/reports.component';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  let reportsService: ReportsService;
  let identityService: IdentityService;
  let assignmentService: AssignmentService;
  let modalService: DfModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportsComponent,
      ],
      providers: [
        { provide: ReportsService, useFactory: () => mock(ReportsService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        TeamSelectorStrategyService,
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
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;

    identityService = TestBed.get(IdentityService);
    reportsService = TestBed.get(ReportsService);
    assignmentService = TestBed.get(AssignmentService);
    modalService = TestBed.get(DfModalService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('[ngOnInit]', () => {
    beforeEach(() => {
      spyOn(reportsService, 'getActivitiesDescription').and.returnValue(of(REPORTS_ACTIVITIES_MOCK).pipe(take(1)));
    });
    it('should get one active team', () => {
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(CURRENT_USER_DETAIL_MANAGER_MOCK);
      spyOn(assignmentService, 'getDashboard').and.returnValue(of({
        teams: [{
          id: 1,
          name: 'teamA',
        },
        {
          id: 2,
          name: 'teamB',
        }],
        assignments: [
          {
            id: 1,
            team: {
              id: 1
            }
          }
        ]
      }));
      fixture.detectChanges();
      expect(component.activeTeams.length).toBe(1);
    });
    it('should show error message when user is not a manager', () => {
      spyOn(identityService, 'getCurrentUserValue').and.returnValue({});
      fixture.detectChanges();
      expect(component.error).toBe('Reports app is not available for this user');
    });
    it('should open activities modal', () => {
      spyOn(identityService, 'getCurrentUserValue').and.returnValue({});
      spyOn(modalService, 'open');
      fixture.detectChanges();
      component.openActivityInfoModal({ title: 'Meetings', hint: 'someHint'});
      expect(modalService.open).toHaveBeenCalled();
    });
  });

  describe('[downloadReports]', () => {
    beforeEach(() => {
      spyOn(reportsService, 'getActivitiesDescription').and.returnValue(of(REPORTS_ACTIVITIES_MOCK).pipe(take(1)));
      spyOn(assignmentService, 'getDashboard').and.returnValue(of({
        teams: [{
          id: 1,
          name: 'teamA',
        },
          {
            id: 2,
            name: 'teamB',
          }],
        assignments: [
          {
            id: 1,
            team: {
              id: 1
            }
          }
        ]
      }));
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(CURRENT_USER_DETAIL_MANAGER_MOCK);
      spyOn(reportsService, 'downloadIndividualReport').and.returnValue(of({}).pipe(take(1)));
      spyOn(reportsService, 'downloadTeamReport').and.returnValue(of({}).pipe(take(1)));
      spyOn(reportsService, 'downloadLoggedHoursReport').and.returnValue(of({}).pipe(take(1)));
      fixture.detectChanges();
    });
    it('should download individual report', () => {
      component.form.controls['type'].setValue(0);
      component.downloadReports();
      expect(component.isTeamsLoading).toBe(false);
    });
    it('should download team report', () => {
      component.form.controls['type'].setValue(1);
      component.downloadReports();
      expect(component.isTeamsLoading).toBe(false);
    });
    it('should download logged hours report', () => {
      component.form.controls['type'].setValue(2);
      component.downloadReports();
      expect(component.isTeamsLoading).toBe(false);
    });
  });

  it('[weekFormatFn] returns date range', () => {
    expect(component.weekFormatFn(new Date())).toEqual('Apr 30 - May 06, 2018');
  });
});
