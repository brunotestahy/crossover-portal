import { Platform } from '@angular/cdk/platform';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  DfLoadingSpinnerModule,
  DfLoadingSpinnerService,
  DfModal,
  DfModalRef,
  DfModalService,
  DfMouseUpService,
  DfValidationMessagesModule,
  DfValidationMessagesService,
} from '@devfactory/ngx-df';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { APPLICATION_FLOW_STEPS } from 'app/core/constants/application-process/application-flow-steps';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { CommonService } from 'app/core/services/common/common.service';
import { EnumsService } from 'app/core/services/enums/enums.service';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { APPLICATION_DATA_MOCK } from 'app/core/services/mocks/application-data.mock';
import { COUNTRIES_MOCK_DATA } from 'app/core/services/mocks/countries.mock';
import { ENUM_MOCK_DATA } from 'app/core/services/mocks/enums.mock';
import { JOB_DATA_MOCK } from 'app/core/services/mocks/job-data.mock';
import { CreateBasicProfileComponent } from 'app/modules/application-process/pages/create-basic-profile/create-basic-profile.component';
import { ApplicationProcessService } from 'app/modules/application-process/shared/application-process.service';
import { EnumToStringPipe } from 'app/shared/pipes/enum-to-string.pipe';

class NgbModalRefStub {
  public componentInstance = {};
  public result: {
    then: (onFullFilled: string) => true
  };

  public open(): void {
  }

  public close(): void {
  }
}

describe('CreateBasicProfileComponent', () => {
  let component: CreateBasicProfileComponent;
  let fixture: ComponentFixture<CreateBasicProfileComponent>;
  let candidateService: CandidateService;
  let modalRef: NgbModalRef;
  let modalService: DfModalService;
  let appProcService: ApplicationProcessService;
  let enumsService: EnumsService;
  let commonService: CommonService;
  let hireService: HireService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CreateBasicProfileComponent, EnumToStringPipe],
      imports: [BrowserModule, DfValidationMessagesModule.forRoot(), DfLoadingSpinnerModule],
      providers: [
        {provide: IdentityService, useFactory: () => mock(IdentityService)},
        {provide: CandidateService, useFactory: () => mock(CandidateService)},
        {provide: HireService, useFactory: () => mock(HireService)},
        {provide: CommonService, useFactory: () => mock(CommonService)},
        {provide: EnumsService, useFactory: () => mock(EnumsService)},
        {provide: ApplicationProcessService, useFactory: () => mock(ApplicationProcessService)},
        {provide: NgbModalRef, useFactory: () => mock(NgbModalRefStub)},
        {provide: NgbModal, properties: {open: () => modalRef}},
        FormBuilder,
        DfMouseUpService,
        DfModalService,
        DfLoadingSpinnerService,
        DfValidationMessagesService,
        DfModal, HttpClient, HttpHandler,
        Platform,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBasicProfileComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.get(CandidateService);
    enumsService = TestBed.get(EnumsService);
    commonService = TestBed.get(CommonService);
    modalRef = TestBed.get(NgbModalRef);
    modalService = TestBed.get(DfModalService);
    appProcService = TestBed.get(ApplicationProcessService);
    hireService = TestBed.get(HireService);

    spyOn(candidateService, 'getSteps').and.returnValue(Observable.of(APPLICATION_FLOW_STEPS));
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(Observable.of(APPLICATION_DATA_MOCK));
    spyOn(commonService, 'getCountries').and.returnValue(Observable.of(COUNTRIES_MOCK_DATA));
    spyOn(hireService, 'getJob').and.returnValue(Observable.of(JOB_DATA_MOCK));
    spyOn(enumsService, 'getEnums').and.returnValue(Observable.of(ENUM_MOCK_DATA));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit]', () => {
    component.ngOnInit();
    expect(component.forbiddenCountries$).toBeDefined();
    component.forbiddenCountries$.subscribe(fbCntr => {
      expect(fbCntr.length).toEqual(4);
    });

    expect(component.forbiddenCountries$).toBeDefined();
    expect(component.countryTooltip$).toBeDefined();
    component.countryTooltip$.subscribe(tooltip => {
      expect(tooltip).not.toEqual('');
    });
    expect(component.questions$).toBeDefined();
    component.questions$.subscribe(qst => {
      expect(qst.length).toBeGreaterThan(0);
    });
    expect(component.availabilities$).toBeDefined();
    component.availabilities$.subscribe(avs => {
      expect(avs.length).toBeGreaterThan(0);
    });
  });

  it('should load all lookups in form', () => {
    component.ngOnInit();
    component.form.setValue({
      avatar: 'http://localhost/assets/images/candidate/application-process/steps/create-basic-profile.svg',
      country: 1,
      timezone: 234,
      skypeId: 'test_skype_id',
      mobile: 123,
      securityQuestion: 'Your mother\'s maiden name',
      customSecurityQuestion: 'Your mother\'s maiden name',
      securityAnswer: 'test answer',
      availability: 'IMMEDIATELY',
    });

    expect(component.form.valid).toBeTruthy();
  });

  it('should open modal on avatar change click set', () => {
    component.ngOnInit();
    spyOn(modalRef, 'close').and.callThrough();
    const dfModalRef = {onClose: Observable.of(['ok']), instance: modalRef} as DfModalRef;
    const modalSpy = spyOn(modalService, 'open').and.returnValue(dfModalRef);
    component.avatarSelection();
    expect(modalSpy).toHaveBeenCalled();
  });

  it('should open modal on avatar change click not set', () => {
    component.ngOnInit();
    const dfModalRef = {onClose: Observable.of(null), instance: modalRef} as DfModalRef;
    spyOn(modalService, 'open').and.returnValue(dfModalRef);
    const avatarSpy = spyOn(component.form.controls.avatar, 'setValue');
    component.avatarSelection();
    expect(avatarSpy).toHaveBeenCalledTimes(0);
  });

  it('should submit data with error', () => {
    spyOn(candidateService, 'createBasicProfile').and.callFake(() => of(true));
    spyOn(appProcService, 'moveToStep').and.callFake(() => {});
    component.ngOnInit();
    component.continue();
    expect(appProcService.moveToStep).toHaveBeenCalledWith(2);
  });

  it('should submit data', () => {
    spyOn(candidateService, 'createBasicProfile')
      .and.callFake(() => {
      return Observable.throw({
        error: {
          error: {
            text: 'Error',
          },
        },
      });
    });
    spyOn(component.card.nativeElement, 'scrollIntoView').and.callFake(() => {});
    component.ngOnInit();
    component.continue();
    expect(component.card.nativeElement.scrollIntoView).toHaveBeenCalledWith({
      inline: 'start',
      block: 'start',
      behavior: 'smooth',
    });
  });

  it('should enable question on change', () => {
    component.ngOnInit();
    spyOn(component.form.controls.customSecurityQuestion, 'enable').and.callThrough();
    component.questionChange('other');
    expect(component.form.controls.customSecurityQuestion.enable).toHaveBeenCalled();
  });

  it('should disable question on change', () => {
    component.ngOnInit();
    spyOn(component.form.controls.customSecurityQuestion, 'disable').and.callThrough();
    component.questionChange('not other');
    expect(component.form.controls.customSecurityQuestion.disable).toHaveBeenCalled();
  });

  it('should change timezone on country change', () => {
    component.ngOnInit();
    component.onCountryChange(2);
    expect(component.form.value.country).toEqual(2);
  });

  it('[continueTooltip] should return no avatar msg', () => {
    component.ngOnInit();
    expect(component.continueTooltip()).toEqual('Your photo is required to continue to the next step.');
  });

  it('[continueTooltip] should return invalid msg', () => {
    component.ngOnInit();
    component.form.controls['avatar'].setValue('avatar');
    component.form.controls['mobile'].setValue('1');
    expect(component.continueTooltip()).toEqual('Please fill in all of the fields above to be able to continue to the next step.');
  });
});
