import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  BubbleWizardEvent,
  DfBubbleWizardModule,
  DfButtonModule,
  DfCheckboxModule,
  DfInputModule,
  DfSelectModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { JobDetails } from 'app/core/models/hire';
import { CommonService } from 'app/core/services/common/common.service';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { JOB_DATA_MOCK } from 'app/core/services/mocks/job-data.mock';
import { PipelineDescriptionComponent } from 'app/modules/marketplace/pages/pipeline-description/pipeline-description.component';

describe('PipelineDescriptionComponent', () => {
  let component: PipelineDescriptionComponent;
  let fixture: ComponentFixture<PipelineDescriptionComponent>;
  let commonService: CommonService;
  let identityService: IdentityService;
  let hireService: HireService;
  let router: Router;
  let spyOnInit: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PipelineDescriptionComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        DfBubbleWizardModule,
        DfButtonModule,
        DfCheckboxModule,
        DfInputModule,
        DfSelectModule,
        DfValidationMessagesModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            params: of({}),
          },
        },
        { provide: HireService, useFactory: () => mock(HireService) },
        { provide: CommonService, useFactory: () => mock(CommonService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineDescriptionComponent);
    component = fixture.componentInstance;
    spyOnInit = spyOn(component, 'ngOnInit').and.returnValue('');

    fixture.detectChanges();
    commonService = TestBed.get(CommonService);
    hireService = TestBed.get(HireService);
    identityService = TestBed.get(IdentityService);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call the pattern method from the passwordMessages variable and to return the right message', () => {
    expect(component.passwordMessages.pattern({
      validationObject: '',
      value: {},
    })).toBe('At least 8 characters, 1 letter and a number or symbol');
  });

  it('should call the pattern method from the fullnameMessages variable and to return the right message', () => {
    expect(component.fullnameMessages.pattern({
      validationObject: '',
      value: {},
    })).toBe('Full name can only include letters');
  });

  it('should load initialSetUp and set up the form and its status listener, get the Countries and set the current user', () => {
    spyOnInit.and.callThrough();
    spyOn(hireService, 'getJob').and.returnValue(of({}));
    spyOn(commonService, 'getCountries').and.returnValue(of([{
      id: 1,
      timezones: [],
      allowed: true,
      code: 'US',
      name: 'USA',
    }]));
    spyOn(identityService, 'currentUserIsManager').and.returnValue(of(true));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({}));
    spyOn(hireService, 'getVisiblePipelineVariants').and.returnValue(of([]));

    component.ngOnInit();

    expect(component.form).toBeDefined();

    component.form.patchValue({
      name: 'John Doe',
      email: 'john.doe@aurea.com',
      password: 'crossover123',
      country: 'USA',
      resume: {},
      recaptcha: 'fksfoekegok',
      mainRole: 'Architect',
    });

    component.form.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        expect(component.currentStep).toBe(2);
      }
    });
    component.allowedCountries$.subscribe((allowedCountries) => {
      expect(allowedCountries.length).toBe(1);
    });
    component.forbiddenCountries$.subscribe((notAllowedCountries) => {
      expect(notAllowedCountries.length).toBe(0);
    });
  });

  it('should load the ngOnInit and define isManager$ and job variables', () => {
    spyOnInit.and.callThrough();
    spyOn(commonService, 'getCountries').and.returnValue(of([{
      id: 1,
      timezones: [],
      allowed: false,
      code: 'US',
      name: 'USA',
    }]));
    spyOn(identityService, 'currentUserIsManager').and.returnValue(of(true));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({}));
    spyOn(hireService, 'getVisiblePipelineVariants').and.returnValue(of([]));
    spyOn(hireService, 'getJob').and.returnValue(of(<JobDetails>{ candidateDescription: 'developer' }));

    component.ngOnInit();

    expect(component.isManager$).toBeTruthy();
    expect(component.job).toBeDefined();
    component.forbiddenCountries$.subscribe((notAllowedCountries) => {
      expect(notAllowedCountries.length).toBe(1);
    });
    component.countryTooltip$.subscribe((notAllowedCountries) => {
      expect(notAllowedCountries.length).toBeGreaterThan(0);
    });
  });

  it('should load the scrollToApply method and to apply the scrollIntoView with a smooth behavior', () => {
    component.applyElement = {
      nativeElement: {
        scrollIntoView: () => {
        },
      },
    };
    spyOn(component.applyElement.nativeElement, 'scrollIntoView');

    component.scrollToApply();

    expect(component.applyElement.nativeElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should load the onFileChange method with a valid file inserted and update the form', () => {
    const files = Object.assign([{ id: 'file1' }]) as FileList;
    const event = Object.assign({ target: { files } }) as Event;

    spyOnInit.and.callThrough();
    spyOn(hireService, 'getJob').and.returnValue(of({}));
    spyOn(commonService, 'getCountries').and.returnValue(of([{
      id: 1,
      timezones: [],
      allowed: true,
      code: 'US',
      name: 'USA',
    }]));
    spyOn(identityService, 'currentUserIsManager').and.returnValue(of(true));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({}));
    spyOn(hireService, 'getVisiblePipelineVariants').and.returnValue(of([]));

    component.ngOnInit();
    component.onFileChange(event);

    expect(component.form.value.resume).toBe(files[0]);
  });

  it('should load the onFileChange method without a valid file and update the form with a null resume', () => {
    const files = Object.assign([]) as FileList;
    const event = Object.assign({ target: { files } }) as Event;

    spyOnInit.and.callThrough();
    spyOn(hireService, 'getJob').and.returnValue(of({}));
    spyOn(commonService, 'getCountries').and.returnValue(of([{
      id: 1,
      timezones: [],
      allowed: true,
      code: 'US',
      name: 'USA',
    }]));
    spyOn(identityService, 'currentUserIsManager').and.returnValue(of(true));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({}));
    spyOn(hireService, 'getVisiblePipelineVariants').and.returnValue(of([]));

    component.ngOnInit();
    component.onFileChange(event);

    expect(component.form.value.resume).toBeNull();
  });

  it('should load the fileName method and get the file\'s name in the resume field', () => {
    spyOnInit.and.callThrough();
    spyOn(hireService, 'getJob').and.returnValue(of({}));
    spyOn(commonService, 'getCountries').and.returnValue(of([{
      id: 1,
      timezones: [],
      allowed: true,
      code: 'US',
      name: 'USA',
    }]));
    spyOn(identityService, 'currentUserIsManager').and.returnValue(of(true));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({}));
    spyOn(hireService, 'getVisiblePipelineVariants').and.returnValue(of([]));

    component.ngOnInit();
    component.form.patchValue({
      resume: { name: '\\\\file1' },
    });

    expect(component.fileName).toEqual('file1');
  });

  it('should load the checkedPreferences method and get only the checked values inside the array', () => {
    component.otherPreferences = [
      { name: 'IOS', selected: false },
      { name: 'Javascript', selected: true },
      { name: 'PHP', selected: true },
      { name: 'Databases', selected: false },
      { name: 'Ruby', selected: false },
      { name: 'Scala', selected: false },
    ];

    expect(component.checkedPreferences).toEqual([component.otherPreferences[1], component.otherPreferences[2]]);
  });

  it('should load the clearFile method, stop the event and change the resume value to null', () => {
    const event = new Event('');

    spyOnInit.and.callThrough();
    spyOn(hireService, 'getJob').and.returnValue(of({}));
    spyOn(commonService, 'getCountries').and.returnValue(of([{
      id: 1,
      timezones: [],
      allowed: true,
      code: 'US',
      name: 'USA',
    }]));
    spyOn(identityService, 'currentUserIsManager').and.returnValue(of(true));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({}));
    spyOn(hireService, 'getVisiblePipelineVariants').and.returnValue(of([]));
    spyOn(event, 'stopPropagation');
    spyOn(event, 'preventDefault');
    component.ngOnInit();
    spyOn(component.form, 'patchValue');

    component.clearFile(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.form.patchValue).toHaveBeenCalledWith({ resume: null });
  });

  it('should call the getFirstName method and retrieve only the fist from a full name', () => {
    const fullName = 'John Doe';

    expect(component.getFirstName(fullName)).toBe('John');
  });

  it('should call the getLastName method and retrieve only the last from a full name', () => {
    const fullName = 'John Doe';

    expect(component.getLastName(fullName)).toBe('Doe');
  });

  it('should call the getLastName method and return empty if the full name is a single name', () => {
    const fullName = 'John';

    expect(component.getLastName(fullName)).toBe('');
  });

  it('should load the isFirstStepFormValid and return true if all fields in the first step are valid', () => {
    component.form = new FormBuilder().group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z ]+$/),
      ])],
      email: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[^a-zA-Z])(?=.*[a-zA-Z]).{8,64}$/),
        ]),
      ],
      country: [null, Validators.required],
      resume: [null, Validators.required],
      recaptcha: [null, Validators.required],
      mainRole: [null, Validators.required],
    });

    component.form.patchValue({
      name: 'John Doe',
      email: 'john.doe@aurea.com',
      password: 'crossover123',
      country: 'USA',
      recaptcha: 'kafafeevv',
    });

    expect(component.isFirstStepFormValid()).toBeTruthy();
  });

  it('should load the onSubmit method and do nothing if the form\' state is Invalid', () => {
    component.form = new FormBuilder().group({ resume: [null, Validators.required] });
    spyOn(hireService, 'applyToJobAsAuthenticatedUser').and.returnValue(of({ id: 1 }));

    component.onSubmit();

    expect(hireService.applyToJobAsAuthenticatedUser).not.toHaveBeenCalled();
  });

  it('should load the applyAnonymously method, change the isApplying variable to false and navigate ' +
    'to the relative page with the received id', () => {
    component.job = JOB_DATA_MOCK;
    component.form = new FormBuilder().group({ resume: [null, Validators.required] });
    component.form.patchValue({ resume: 'file1' });
    component.isAnonymous = true;
    spyOn(hireService, 'applyToPipelineAsAnonymousUser').and.returnValue(of({ id: 1 }));
    spyOn(router, 'navigate');
    spyOn(component, 'getFirstName').and.returnValue('');
    spyOn(component, 'getLastName').and.returnValue('');

    component.onSubmit();

    expect(component.isApplying).toBeFalsy();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should load the applyAnonymously method, change the isApplying variable to false and throw an error', () => {
    component.job = JOB_DATA_MOCK;
    component.form = new FormBuilder().group({ resume: [null, Validators.required] });
    component.form.patchValue({ resume: 'file1' });
    component.isAnonymous = true;
    spyOn(hireService, 'applyToPipelineAsAnonymousUser').and.returnValue(Observable.throw({ error: { text: 'Error' } }));
    spyOn(component, 'getFirstName').and.returnValue('');
    spyOn(component, 'getLastName').and.returnValue('');

    component.onSubmit();

    expect(component.isApplying).toBeFalsy();
    expect(component.error).toBe('Error');
  });

  it('should load the applyAuthenticated method, change the isApplying variable to false and showHighway to true', () => {
    component.job = JOB_DATA_MOCK;
    component.form = new FormBuilder().group({ resume: [null, Validators.required] });
    component.form.patchValue({ resume: 'file1' });
    component.isAnonymous = false;
    spyOn(hireService, 'applyToPipelineAsAuthenticatedUser').and.returnValue(of({}));
    spyOn(identityService, 'getCurrentUser').and.returnValue({ type: null });

    component.onSubmit();

    expect(component.isApplying).toBeFalsy();
    expect(component.showHighway).toBeTruthy();
  });

  it('should load the applyAuthenticated method, change the isApplying variable to false and throw an error', () => {
    component.job = JOB_DATA_MOCK;
    component.form = new FormBuilder().group({ resume: [null, Validators.required] });
    component.form.patchValue({ resume: 'file1' });
    component.isAnonymous = false;
    spyOn(hireService, 'applyToPipelineAsAuthenticatedUser').and.returnValue(Observable.throw({ error: { text: 'Error' } }));
    spyOn(identityService, 'getCurrentUser').and.returnValue({ type: null });

    component.onSubmit();

    expect(component.isApplying).toBeFalsy();
    expect(component.error).toBe('Error');
  });

  it('should load the onWizardBubbleClick method and set the currentStep variable with the correct index', () => {
    let bubleEvent = new BubbleWizardEvent();
    bubleEvent = {
      index: 2,
      ...bubleEvent,
    };

    component.onWizardBubbleClick(bubleEvent);

    expect(component.currentStep).toBe(2);
  });

  it('should load the backToStep1 method and set the currentStep variable to 1', () => {
    component.backToStep1();

    expect(component.currentStep).toBe(1);
  });
});
