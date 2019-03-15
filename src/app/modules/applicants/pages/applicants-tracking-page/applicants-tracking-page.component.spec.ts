import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DfModalService, DfToasterService } from '@devfactory/ngx-df';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { Applicant, ApplicantRow, Job } from 'app/core/models/hire';
import { CurrentUserDetail } from 'app/core/models/identity';
import { PaginatedApi } from 'app/core/models/paginated-api';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { APPLICANTS_RESPONSE } from 'app/core/services/mocks/applicants.mock';
import { ApplicantsTrackingPageComponent } from 'app/modules/applicants/pages/applicants-tracking-page/applicants-tracking-page.component';

describe('ApplicantsTrackingPageComponent', () => {
  let component: ApplicantsTrackingPageComponent;
  let fixture: ComponentFixture<ApplicantsTrackingPageComponent>;
  let hireService: HireService;
  let modalService: DfModalService;
  let toasterService: DfToasterService;
  let identityService: IdentityService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ApplicantsTrackingPageComponent],
      imports: [RouterTestingModule],
      providers: [
        BreakpointObserver,
        MediaMatcher,
        Platform,
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: DfToasterService, useFactory: () => mock(DfToasterService) },
        { provide: HireService, useFactory: () => mock(HireService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: ActivatedRoute, useFactory: () => mock(ActivatedRoute) },
        FormBuilder,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantsTrackingPageComponent);

    component = fixture.componentInstance;
    hireService = TestBed.get(HireService);
    modalService = TestBed.get(DfModalService);
    toasterService = TestBed.get(DfToasterService);
    identityService = TestBed.get(IdentityService);
    activatedRoute = TestBed.get(ActivatedRoute);

    activatedRoute.snapshot = { queryParams: {} } as ActivatedRouteSnapshot;

    identityService.getCurrentUser = () => Observable.of({ email: 'email@address.com'} as CurrentUserDetail);

    hireService.searchApplicantsV2 = () => Observable.of(APPLICANTS_RESPONSE as PaginatedApi<Applicant>);

    hireService.scoreResume = () => Observable.of({});

    hireService.getApplicationFile = () => Observable.of('');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load pipelines and campaigns successfully', async(() => {
    const jobs = [
      Object.assign({id: 1}) as Job,
    ];
    const campaigns = ['campaign 1'];

    spyOn(hireService, 'getJobs').and.returnValue(
      Observable.of(jobs).take(1)
    );
    spyOn(hireService, 'getCampaigns').and.returnValue(
      Observable.of(campaigns).take(1)
    );
    activatedRoute.snapshot.queryParams = {jobId: jobs[0].id};

    fixture.detectChanges();

    expect(hireService.getJobs).toHaveBeenCalled();
    expect(hireService.getCampaigns).toHaveBeenCalled();

    fixture.whenStable()
      .then(() => {
        expect(component.jobs).toBe(jobs);
        expect(component.campaigns).toBe(campaigns);
      });
  }));

  it('should show error on ng init fail', () => {
    spyOn(hireService, 'getJobs').and.returnValue(Observable.throw(new Error()));
    fixture.detectChanges();

    expect(component.error).toBe('Error loading information. Please try again later');
  });

  it('should show a specific error message when data consumption fails', () => {
    const text = 'A specific error happened';
    spyOn(hireService, 'getJobs').and.returnValue(
      Observable.throw({ error: { text } })
    );
    fixture.detectChanges();

    expect(component.error).toBe(text);
  });

  it('should disable reject button when status is marketplace', () => {
    fixture.detectChanges();
    const MARKETPLACE = 'Marketplace';
    component.form.patchValue({ status: MARKETPLACE });
    expect(component.isRejectDisabled()).toBe(true);
  });

  it('should reject applicants successfully when the rejection form contains valid data', async(() => {
    fixture.detectChanges();
    component.rejectFormGroup.patchValue({ method: 1 });
    component.selectedApplicants = [
      Object.assign({ id: 123 }) as ApplicantRow,
    ];

    spyOn(hireService, 'rejectCandidateWithoutReason').and.returnValue(
      Observable.of(true).take(1)
    );
    spyOn(toasterService, 'popSuccess');

    component.rejectApplicants(() => {});
    expect(hireService.rejectCandidateWithoutReason).toHaveBeenCalled();

    spyOn(hireService, 'rejectCandidateWithReason').and.returnValue(
      Observable.of(true).take(1)
    );
    component.rejectFormGroup.patchValue({ method: 2, reason: 'Im not a perfect person' });
    component.selectedApplicants = [
      Object.assign({ id: 123 }) as ApplicantRow,
    ];
    component.rejectApplicants(() => {});

    expect(hireService.rejectCandidateWithReason).toHaveBeenCalled();

    fixture.whenStable()
      .then(() => {
        expect(component.currentPage).toBe(1);
        expect(toasterService.popSuccess).toHaveBeenCalledWith('Applicant(s) rejected');
      });
  }));

  it('should not reject applicants when the rejection form does not contain valid data', () => {
    fixture.detectChanges();
    component.rejectFormGroup.patchValue({ method: null });

    spyOn(hireService, 'rejectCandidateWithoutReason').and.returnValue(
      Observable.of(true).take(1)
    );

    component.rejectApplicants(() => {});
    expect(hireService.rejectCandidateWithoutReason).not.toHaveBeenCalled();
  });

  it('should show error on rejecting applicants failure', () => {
    fixture.detectChanges();
    component.rejectFormGroup.patchValue({ method: 1 });
    component.selectedApplicants = [
      Object.assign({ id: 123 }) as ApplicantRow,
    ];

    spyOn(hireService, 'rejectCandidateWithoutReason').and.returnValue(Observable.throw(new Error()));
    component.rejectApplicants(() => {});

    expect(component.error).not.toBe('');
  });

  it('should sort', () => {
    fixture.detectChanges();

    component.form.patchValue({ jobId: 123 });
    const RESUME_KEYWORD_SCORE = 'resumeKeywordScore';
    const RESUME_KEYWORD_SCORE_FIELD = 'score.RESUME_KEYWORD';
    const sort = {
      order: 1,
      field: RESUME_KEYWORD_SCORE,
    };
    spyOn(component, 'search').and.callThrough();

    component.onColumnSort(sort);
    expect(component.search).toHaveBeenCalledWith(1, RESUME_KEYWORD_SCORE_FIELD, 1);

    const TIME_SPENT = 'timeSpent';
    const TIME_SPENT_FIELD = 'Time_Spent';
    const REJECTED_STATUS = 'Rejected';
    sort.field = TIME_SPENT;

    component.form.patchValue({ status: REJECTED_STATUS });
    component.form.patchValue({ statusUpdated: 4 });
    component.onColumnSort(sort);
    expect(component.search).toHaveBeenCalledWith(1, TIME_SPENT_FIELD, 1);

    const NAME = 'name';
    const NAME_FIELD = 'Name';
    const AVAILABLE_JOBS = 'available jobs';
    component.form.patchValue({ campaign: AVAILABLE_JOBS });
    component.form.patchValue({ statusUpdated: 3 });
    sort.field = NAME;
    sort.order = -1;

    component.onColumnSort(sort);
    expect(component.search).toHaveBeenCalledWith(1, NAME_FIELD, -1);
  });

  it('should show export message', () => {
    component.currentUserEmail = 'email@address.com';
    spyOn(toasterService, 'popSuccess').and.callThrough();
    component.exportToCSV();
    expect(toasterService.popSuccess).toHaveBeenCalled();
  });

  it('should search', () => {
    fixture.detectChanges();

    component.form.patchValue({ jobId: 123 });
    const EMAIL = 'email@address.com';

    component.form.patchValue({ email: EMAIL });
    component.form.patchValue({ statusUpdated: 2 });
    component.search();

    expect(component.applicants.length).toBe(3);
  });

  it('should open resume', () => {
    spyOn(hireService, 'getApplicationFile').and.callThrough();
    component.openResume({ id: 123, resumeFile: { id: 321 } } as ApplicantRow);
    expect(hireService.getApplicationFile).toHaveBeenCalled();
  });

  it('should show an error on getting file error', () => {
    spyOn(hireService, 'getApplicationFile').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    component.openResume({ id: 123, resumeFile: { id: 321 } } as ApplicantRow);
    expect(component.error).toBeTruthy();
  });

  it('should show error on search fail', () => {
    fixture.detectChanges();

    component.form.patchValue({ jobId: 123 });
    const RESUME_KEYWORD = 'ninja';

    spyOn(hireService, 'searchApplicantsV2').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    component.form.patchValue({ resumeKeyword: RESUME_KEYWORD });
    component.form.patchValue({ statusUpdated: 1 });
    component.search();

    expect(component.error).toBeTruthy();
  });

  it('should score resumes', () => {
    fixture.detectChanges();
    component.form.patchValue({ jobId: 123 });

    component.selectedApplicants = [
      Object.assign({ id: 321 }) as ApplicantRow,
    ];
    spyOn(hireService, 'scoreResume').and.callThrough();

    component.scoreResumes();

    expect(hireService.scoreResume).toHaveBeenCalled();
  });

  it('should show error on resume score', () => {
    fixture.detectChanges();
    component.form.patchValue({ jobId: 123 });

    component.selectedApplicants = [
      Object.assign({ id: 321 }) as ApplicantRow,
    ];
    spyOn(hireService, 'scoreResume').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));

    component.scoreResumes();

    expect(component.error).toBeTruthy();
  });

  it('should open reject form', () => {
    spyOn(modalService, 'open').and.callThrough();

    component.openRejectForm();

    expect(modalService.open).toHaveBeenCalled();
  });

  it('should check grid selection', () => {
    component.selectedApplicants = [];
    component.checkSelection([]);
    expect(component.selectedApplicants.length).toBe(0);

    component.checkSelection([
      Object.assign({ id: 43234 }) as ApplicantRow,
    ]);
    expect(component.selectedApplicants.length).toBe(1);
  });

  it('should refresh', () => {
    fixture.detectChanges();
    component.form.patchValue({ jobId: 123 });

    spyOn(component, 'search').and.callThrough();
    component.onRefresh();
    expect(component.search).toHaveBeenCalledWith(component.currentPage);
  });

  it('should load pages', () => {
    fixture.detectChanges();
    component.form.patchValue({ jobId: 123 });

    const PAGE = 3;
    spyOn(component, 'search').and.callThrough();
    component.onPageChange(PAGE);
    expect(component.search).toHaveBeenCalledWith(PAGE);
  });
});
