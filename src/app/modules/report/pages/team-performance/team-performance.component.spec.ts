import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DfToasterService } from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { IdentityService } from 'app/core/services/identity/identity.service';
import { COMPANIES_MOCK } from 'app/core/services/mocks/companies.mock';
import { TEAMS } from 'app/core/services/mocks/team.mock';
import { ReportService } from 'app/core/services/report/report.service';
import {
  TeamPerformanceComponent,
} from 'app/modules/report/pages/team-performance/team-performance.component';

describe('TeamPerformanceComponent', () => {
  let component: TeamPerformanceComponent;
  let fixture: ComponentFixture<TeamPerformanceComponent>;
  let reportService: ReportService;
  let identityService: IdentityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TeamPerformanceComponent],
      imports: [],
      providers: [
        { provide: ReportService, useFactory: () => mock(ReportService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: DfToasterService, useFactory: () => mock(DfToasterService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPerformanceComponent);
    component = fixture.componentInstance;
    reportService = TestBed.get(ReportService);
    identityService = TestBed.get(IdentityService);
  });

  it('check if the component has been created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit - ', () => {

    describe('when current user is Admin - ', () => {
      it('should fetch company list successfully', () => {
        spyOn(reportService, 'getCompanies').and.returnValue(
          Observable.of(COMPANIES_MOCK).pipe(take(1))
        );
        spyOn(identityService, 'currentUserIsManager').and.returnValue(
          Observable.of(true).pipe(take(1))
        );
        spyOn(identityService, 'currentUserIsAdmin').and.returnValue(
          Observable.of(true).pipe(take(1))
        );
        fixture.detectChanges();
        expect(component.companies.length).toBe(4);
      });

      it('should retrieve a server error with description when an error occurs', () => {
        spyOn(reportService, 'getCompanies').and.returnValue(Observable.throw({
          error: {
            errorCode: 400,
            type: 'type',
            httpStatus: 400,
            text: 'error',
          },
        }));
        spyOn(identityService, 'currentUserIsManager').and.returnValue(
          Observable.of(true).pipe(take(1))
        );
        spyOn(identityService, 'currentUserIsAdmin').and.returnValue(
          Observable.of(true).pipe(take(1))
        );
        component.ngOnInit();
        expect(component.error).toBe('error');
      });

      it('should retrieve a server error when an error occurs', () => {
        spyOn(reportService, 'getCompanies').and.returnValue(
          Observable.throw({
            error: 'text',
          }).pipe(take(1))
        );
        spyOn(identityService, 'currentUserIsManager').and.returnValue(
          Observable.of(true).pipe(take(1))
        );
        spyOn(identityService, 'currentUserIsAdmin').and.returnValue(
          Observable.of(true).pipe(take(1))
        );
        component.ngOnInit();
        expect(component.error).toBe('Error fetching country list');
      });
    });

    describe('when current user is Manager - ', () => {
      it('should fetch team list successfully', () => {
        spyOn(reportService, 'getTeams').and.returnValue(
          Observable.of(TEAMS).pipe(take(1))
        );
        spyOn(identityService, 'currentUserIsManager').and.returnValue(
          Observable.of(true).pipe(take(1))
        );
        spyOn(identityService, 'currentUserIsAdmin').and.returnValue(
          Observable.of(false).pipe(take(1))
        );
        fixture.detectChanges();
        expect(component.teams.length).toBe(3);
      });

      it('should retrieve a server error with description when an error occurs', () => {
        spyOn(reportService, 'getTeams').and.returnValue(Observable.throw({
          error: {
            errorCode: 400,
            type: 'type',
            httpStatus: 400,
            text: 'error',
          },
        }));
        spyOn(identityService, 'currentUserIsManager').and.returnValue(
          Observable.of(true).pipe(take(1))
        );
        spyOn(identityService, 'currentUserIsAdmin').and.returnValue(
          Observable.of(false).pipe(take(1))
        );
        component.ngOnInit();
        expect(component.error).toBe('error');
      });

      it('should retrieve a server error when an error occurs', () => {
        spyOn(reportService, 'getTeams').and.returnValue(Observable.throw({
          error: 'text',
        }));
        spyOn(identityService, 'currentUserIsManager').and.returnValue(
          Observable.of(true).pipe(take(1))
        );
        spyOn(identityService, 'currentUserIsAdmin').and.returnValue(
          Observable.of(false).pipe(take(1))
        );
        component.ngOnInit();
        expect(component.error).toBe('Error fetching team list');
      });
    });

  });

  describe('downloadCsv', () => {
    it('should start successfully when user is admin', () => {
      component.isAdmin = true;
      component.form = new FormBuilder().group({ company: ['test'] }, { period: ['MONTH'] });
      spyOn(reportService, 'getCompanyPerformanceReportFile').and.returnValue(
        Observable.of({}).pipe(take(1))
      );
      component.downloadCsv();
      expect(reportService.getCompanyPerformanceReportFile).toHaveBeenCalled();
    });

    it('should retrieve server error with message when user is admin and the action fails', () => {
      component.isAdmin = true;
      component.form = new FormBuilder().group({ company: ['test'] }, { period: ['MONTH'] });
      spyOn(reportService, 'getCompanyPerformanceReportFile').and.returnValue(Observable.throw({
        error: {
          errorCode: 'CROS-0027',
          httpStatus: 400,
          type: 'ERROR',
          text: 'Sample error text',
        },
      }));
      component.downloadCsv();
      expect(reportService.getCompanyPerformanceReportFile).toHaveBeenCalled();
      expect(component.error).toBe('Sample error text');
    });

    it('should retrieve server error when user is admin and the action fails', () => {
      component.isAdmin = true;
      component.form = new FormBuilder().group({ company: ['test'] }, { period: ['MONTH'] });
      spyOn(reportService, 'getCompanyPerformanceReportFile').and.returnValue(
        Observable.throw({
          error: 'error',
        }).pipe(take(1))
      );
      component.downloadCsv();
      expect(reportService.getCompanyPerformanceReportFile).toHaveBeenCalled();
      expect(component.error).toBe('Error downloading CSV');
    });

    it('should start successfully when user is manager', () => {
      component.isAdmin = false;
      component.isManager = true;
      component.form = new FormBuilder().group({ company: ['test'] }, { period: ['MONTH'] });
      spyOn(reportService, 'getTeamPerformanceReportFile').and.returnValue(
        Observable.of({}).pipe(take(1))
      );
      component.downloadCsv();
      expect(reportService.getTeamPerformanceReportFile).toHaveBeenCalled();
    });

    it('should retrieve server error with message when user is manager and the action fails', () => {
      component.isAdmin = false;
      component.isManager = true;
      component.form = new FormBuilder().group({ company: ['test'] }, { period: ['MONTH'] });
      spyOn(reportService, 'getTeamPerformanceReportFile').and.returnValue(
        Observable.throw({
          error: {
            errorCode: 'CROS-0027',
            httpStatus: 400,
            type: 'ERROR',
            text: 'Sample error text',
          },
        }).pipe(take(1))
      );
      component.downloadCsv();
      expect(reportService.getTeamPerformanceReportFile).toHaveBeenCalled();
      expect(component.error).toBe('Sample error text');
    });

    it('should retrieve server error when user is manager and the action fails', () => {
      component.isAdmin = false;
      component.isManager = true;
      component.form = new FormBuilder().group({ company: ['test'] }, { period: ['MONTH'] });
      spyOn(reportService, 'getTeamPerformanceReportFile').and.returnValue(
        Observable.throw({
          error: 'error',
        }).pipe(take(1))
      );
      component.downloadCsv();
      expect(reportService.getTeamPerformanceReportFile).toHaveBeenCalled();
      expect(component.error).toBe('Error downloading CSV');
    });
  });

  it('should change period successfully', () => {
    component.periodChange('MONTH');
    expect(component.info).toBe('Note: For Month/Quarter granularities, the report will display the weekly average, not totals.');
  });
});
