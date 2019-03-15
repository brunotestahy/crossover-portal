import { LayoutModule } from '@angular/cdk/layout';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import {
  DfAlertModule,
  DfAlertService,
  DfCardModule,
  DfCheckboxModule,
  DfDatepickerModule,
  DfFileUploadModule,
  DfInputModule,
  DfModalService,
  DfSelectModule,
  DfToolTipModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { NgbPopover, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import {
  Candidate,
  CandidateLanguage,
  CandidateSkill,
  Certification,
  Education,
  Employment,
  Skill,
} from 'app/core/models/candidate';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { CommonService } from 'app/core/services/common/common.service';
import { EnumsService } from 'app/core/services/enums/enums.service';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { LinkedInService } from 'app/core/services/linkedin';
import { CANDIDATE_MOCK } from 'app/core/services/mocks/candidate.mock';
import { COUNTRIES_MOCK_DATA } from 'app/core/services/mocks/countries.mock';
import { PublicService } from 'app/core/services/public/public.service';
import { UserProfileComponent } from 'app/shared/components/user-profile/user-profile.component';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<typeof component>;
  let commonService: CommonService;
  let hireService: HireService;
  let identityService: IdentityService;
  let publicService: PublicService;
  let enumsService: EnumsService;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        UserProfileComponent,
      ],
      imports: [
        DfAlertModule,
        DfCardModule.forRoot(),
        DfCheckboxModule,
        DfDatepickerModule,
        DfFileUploadModule.forRoot(),
        DfInputModule,
        DfSelectModule,
        DfToolTipModule,
        DfValidationMessagesModule.forRoot(),
        LayoutModule,
        NgbPopoverModule.forRoot(),
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: DfAlertService, useFactory: () => mock(DfAlertService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: ActivatedRoute, useFactory: () => mock(ActivatedRoute) },
        { provide: LinkedInService, useFactory: () => mock(LinkedInService) },
        { provide: CandidateService, useFactory: () => mock(CandidateService) },
        { provide: EnumsService, useFactory: () => mock(EnumsService) },
        { provide: CommonService, useFactory: () => mock(CommonService) },
        { provide: HireService, useFactory: () => mock(HireService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: PublicService, useFactory: () => mock(PublicService) },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(UserProfileComponent);
      component = fixture.componentInstance;
      commonService = TestBed.get(CommonService);
      enumsService = TestBed.get(EnumsService);
      hireService = TestBed.get(HireService);
      identityService = TestBed.get(IdentityService);
      publicService = TestBed.get(PublicService);

      // Fix 'error during cleanup' problems in some tests here
      NgbPopover.prototype.ngOnDestroy = jasmine.createSpy('ngOnDestroy');
    })
  );

  it('should be created successfully', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(COUNTRIES_MOCK_DATA));
    spyOn(enumsService, 'getEnums').and.returnValue(of([]));
    spyOn(publicService, 'getIndustries').and.returnValue(of([]));
    spyOn(publicService, 'getLanguages').and.returnValue(of([]));
    spyOn(hireService, 'searchCurrentUserApplications').and.returnValue(of({ content: [] }));
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set an error message when countries list retrieval fails', async(() => {
    spyOn(enumsService, 'getEnums').and.returnValue(of([]));
    spyOn(publicService, 'getIndustries').and.returnValue(of([]));
    spyOn(publicService, 'getLanguages').and.returnValue(of([]));
    spyOn(hireService, 'searchCurrentUserApplications').and.returnValue(of({ content: [] }));
    const text = 'An error happened while retrieving countries list';
    spyOn(commonService, 'getCountries').and.returnValue(Observable.throw({
      status: 400,
      statusText: 'Bad Request',
      message: text,
      name: 'HTTP SERVER ERROR',
    }));

    fixture.detectChanges();
    fixture.whenStable().then(() => expect(component.error).toBe(text));
  }));

  it('should set an error message when enum data retrieval fails', async(() => {
    spyOn(commonService, 'getCountries').and.returnValue(of(COUNTRIES_MOCK_DATA));
    spyOn(publicService, 'getIndustries').and.returnValue(of([]));
    spyOn(publicService, 'getLanguages').and.returnValue(of([]));
    spyOn(hireService, 'searchCurrentUserApplications').and.returnValue(of({ content: [] }));
    spyOn(enumsService, 'getEnums').and.returnValue(Observable.throw({
      error: null,
    }));

    fixture.detectChanges();
    fixture.whenStable().then(() => expect(component.error).toBeUndefined());
  }));

  it('should set an error message when industry list retrieval fails', async(() => {
    spyOn(commonService, 'getCountries').and.returnValue(of(COUNTRIES_MOCK_DATA));
    spyOn(enumsService, 'getEnums').and.returnValue(of([]));
    spyOn(publicService, 'getLanguages').and.returnValue(of([]));
    spyOn(hireService, 'searchCurrentUserApplications').and.returnValue(of({ content: [] }));
    const text = 'An error happened while retrieving industry list';
    spyOn(publicService, 'getIndustries').and.returnValue(Observable.throw({
      error: { text },
    }));

    fixture.detectChanges();
    fixture.whenStable().then(() => expect(component.error).toBe(text));
  }));

  it('should set an error message when language list retrieval fails', async(() => {
    spyOn(commonService, 'getCountries').and.returnValue(of(COUNTRIES_MOCK_DATA));
    spyOn(enumsService, 'getEnums').and.returnValue(of([]));
    spyOn(publicService, 'getIndustries').and.returnValue(of([]));
    spyOn(hireService, 'searchCurrentUserApplications').and.returnValue(of({ content: [] }));
    const text = 'An error happened while retrieving language list';
    spyOn(publicService, 'getLanguages').and.returnValue(Observable.throw({
      error: { text },
    }));

    fixture.detectChanges();
    fixture.whenStable().then(() => expect(component.error).toBe(text));
  }));

  it('should set an error message when user applications retrieval fails', async(() => {
    spyOn(commonService, 'getCountries').and.returnValue(of(COUNTRIES_MOCK_DATA));
    spyOn(enumsService, 'getEnums').and.returnValue(of([]));
    spyOn(publicService, 'getIndustries').and.returnValue(of([]));
    spyOn(publicService, 'getLanguages').and.returnValue(of([]));
    const text = 'An error happened while retrieving applications list';
    spyOn(hireService, 'searchCurrentUserApplications').and.returnValue(Observable.throw({
      error: { text },
    }));

    fixture.detectChanges();
    fixture.whenStable().then(() => expect(component.error).toBe(text));
  }));

  it('should set an error message when user applications file retrieval fails', async(() => {
    spyOn(commonService, 'getCountries').and.returnValue(of(COUNTRIES_MOCK_DATA));
    spyOn(enumsService, 'getEnums').and.returnValue(of([]));
    spyOn(publicService, 'getIndustries').and.returnValue(of([]));
    spyOn(publicService, 'getLanguages').and.returnValue(of([]));
    const text = 'An error happened while retrieving applications list';
    spyOn(hireService, 'searchCurrentUserApplications').and.returnValue(Observable.of({
      content: [{ id: 1, resumeFile: { id: 2 } }],
    }));
    spyOn(hireService, 'getApplicationFile').and.returnValue(Observable.throw({
      error: { text },
    }));

    fixture.detectChanges();
    fixture.whenStable().then(() => expect(component.error).toBe(text));
  }));

  it('should save profile successfully', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(COUNTRIES_MOCK_DATA));
    spyOn(enumsService, 'getEnums').and.returnValue(of([]));
    spyOn(publicService, 'getIndustries').and.returnValue(of([]));
    spyOn(publicService, 'getLanguages').and.returnValue(of([]));
    spyOn(hireService, 'searchCurrentUserApplications').and.returnValue(of({ content: [] }));
    const skypeId = 'sample.change';
    const changes = {
      skypeId,
      certifications: [
        { id: 2, markedToDelete: true } as Certification,
        { id: 3 } as Certification,
      ],
      educations: [
        { id: 1, markedToDelete: true } as Education,
        { id: 2 } as Education,
      ],
      employments: [
        { id: 1, markedToDelete: true } as Employment,
        Object.assign({
          id: 3,
          startDate: new Date(),
          endDate: new Date(),
        }) as Employment,
      ],
      languages: [
        { id: 2, markedToDelete: true } as CandidateLanguage,
        { id: 3 } as CandidateLanguage,
      ],
      skills: [
        { id: 2, markedToDelete: true } as CandidateSkill,
        { id: 3, skill: { id: 43 } } as CandidateSkill,
      ],
    };
    const verificationValue = Object.assign({ skypeId });

    spyOn(identityService, 'saveProfile')
      .and.returnValue(Observable.of({ skypeId }));

    component.candidate = CANDIDATE_MOCK;
    fixture.detectChanges();
    component.saveProfile(changes);

    expect(component.candidate).toEqual(jasmine.objectContaining(verificationValue));

    const emptyChanges = Object.assign({
      skypeId,
      certifications: null,
      educations: null,
      employments: null,
      languages: null,
      skills: null,
    }) as Partial<Candidate>;
    component.saveProfile(emptyChanges);

    expect(component.candidate).toEqual(jasmine.objectContaining(verificationValue));
  });

  it('should fail on saving a profile when an error occurs', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(COUNTRIES_MOCK_DATA));
    spyOn(enumsService, 'getEnums').and.returnValue(of([]));
    spyOn(publicService, 'getIndustries').and.returnValue(of([]));
    spyOn(publicService, 'getLanguages').and.returnValue(of([]));
    spyOn(hireService, 'searchCurrentUserApplications').and.returnValue(of({ content: [] }));
    const text = 'An error happened while storing user profile data';
    spyOn(identityService, 'saveProfile').and.returnValue(Observable.throw({
      error: { text },
    }));

    fixture.detectChanges();
    component.candidate = CANDIDATE_MOCK;
    component.saveProfile({});

    expect(component.error).toBe(text);
  });

  it('should set an error message when user filtered skills retrieval fails', fakeAsync(() => {
    spyOn(commonService, 'getCountries').and.returnValue(of(COUNTRIES_MOCK_DATA));
    spyOn(enumsService, 'getEnums').and.returnValue(of([]));
    spyOn(publicService, 'getIndustries').and.returnValue(of([]));
    spyOn(publicService, 'getLanguages').and.returnValue(of([]));
    spyOn(hireService, 'searchCurrentUserApplications').and.returnValue(of({ content: [] }));
    const text = 'An error happened while retrieving filtered skills';
    spyOn(commonService, 'getSkills').and.returnValue(Observable.throw({
      error: { text },
    }));

    const waitTime = component.filterSkills('Any Skill');
    tick(waitTime as number);

    fixture.detectChanges();
    fixture.whenStable().then(() => expect(component.error).toBe(text));
  }));

  it('should filter skills successfully', fakeAsync(() => {
    const skill = new Skill(1, 'ReactJS');
    spyOn(commonService, 'getSkills')
      .and.returnValue(Observable.of([skill]));

    const waitTime = component.filterSkills(skill.name);
    tick(waitTime as number);

    component.skills$
      .pipe(take(1))
      .subscribe(data => expect(data).toContain(skill));
  }));

  it('should delete photo successfully', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(COUNTRIES_MOCK_DATA));
    spyOn(enumsService, 'getEnums').and.returnValue(of([]));
    spyOn(publicService, 'getIndustries').and.returnValue(of([]));
    spyOn(publicService, 'getLanguages').and.returnValue(of([]));
    spyOn(hireService, 'searchCurrentUserApplications').and.returnValue(of({ content: [] }));
    component.editingItem.photoUrl = 'test photo';
    spyOn(identityService, 'deleteImage').and.returnValue(Observable.of({}));

    fixture.detectChanges();
    component.candidate = CANDIDATE_MOCK;
    component.deleteProfilePhoto();

    expect(component.editingItem.photoUrl).toBeNull();
  });

  it('should set an error message when delete photo server request fails', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(COUNTRIES_MOCK_DATA));
    spyOn(enumsService, 'getEnums').and.returnValue(of([]));
    spyOn(publicService, 'getIndustries').and.returnValue(of([]));
    spyOn(publicService, 'getLanguages').and.returnValue(of([]));
    spyOn(hireService, 'searchCurrentUserApplications').and.returnValue(of({ content: [] }));
    const text = 'An error happened while delete profile photo';
    spyOn(identityService, 'deleteImage').and.returnValue(Observable.throw({
      error: { text },
    }));

    fixture.detectChanges();
    component.candidate = CANDIDATE_MOCK;
    component.deleteProfilePhoto();

    expect(component.error).toBe(text);
  });

  it('should change the section states successfully', () => {
    const sectionKey = 'educations';
    const sampleValue = Object.assign({ anyValue: 'sample value' });

    component.setSection(sectionKey);
    expect(component.editingItem.educations).toBe(true);

    component.toggleSection(sectionKey);
    expect(component.editingItem.educations).toBe(false);

    component.setSection(sectionKey, sampleValue);
    expect(component.editingItem.educations).toEqual(sampleValue);
  });

});
