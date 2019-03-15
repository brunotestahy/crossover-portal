import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Country } from 'app/core/models/country';
import { CommonService } from 'app/core/services/common/common.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { mock } from 'ts-mockito';

import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import {
  SetupResidenceComponent,
} from 'app/modules/onboarding/pages/setup-residence/setup-residence.component';

describe('SetupResidenceComponent', () => {
  let component: SetupResidenceComponent;
  let fixture: ComponentFixture<SetupResidenceComponent>;

  let assignmentService: AssignmentService;
  let commonService: CommonService;
  let identityService: IdentityService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SetupResidenceComponent,
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {
           params: of({ type: '' }),
           parent: { snapshot: {
             params: { id: 1 },
           } },
        }},
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: CommonService, useFactory: () => mock(CommonService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupResidenceComponent);
    component = fixture.componentInstance;

    assignmentService = TestBed.get(AssignmentService);
    commonService = TestBed.get(CommonService);
    identityService = TestBed.get(IdentityService);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load ngOnInit, build the form and fetch the countries correctly', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));

    component.ngOnInit();

    expect(component.countries).toBeDefined();
  });

  it('should display an error message when an error occurs during countries data loading', () => {
    spyOn(commonService, 'getCountries').and.returnValue(_throw({}));

    component.ngOnInit();

    expect(component.error).toBe('An error occurred while loading country data.');
  });

  it('should load ngOnInit and build the form as an Entity', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));

    component.ngOnInit();

    spyOn(component.entityInfoGroup, 'enable');

    component.form.patchValue({
      workingThroughEntity: true,
    });

    component.form.controls.workingThroughEntity.valueChanges
      .subscribe(() => {
        expect(component.entityInfoGroup.enable).toHaveBeenCalled();
      });
  });

  it('should load ngOnInit and build the form as Personal, a valid secondary Citizenship and invalid tertiary Citizenship', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));

    component.ngOnInit();

    spyOn(component.personalInfoGroup, 'enable');

    component.secondaryCitizenshipControl.patchValue('USA');

    component.form.patchValue({
      workingThroughEntity: false,
    });

    component.form.controls.workingThroughEntity.valueChanges
      .subscribe(() => {
        expect(component.personalInfoGroup.enable).toHaveBeenCalled();
      });
  });

  it('should load ngOnInit and build the form as Personal, a valid secondary Citizenship and valid tertiary Citizenship', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));

    component.ngOnInit();

    spyOn(component.personalInfoGroup, 'enable');

    component.secondaryCitizenshipControl.patchValue('USA');
    component.tertiaryCitizenshipControl.patchValue('Brazil');

    component.form.patchValue({
      workingThroughEntity: false,
    });

    component.form.controls.workingThroughEntity.valueChanges
      .subscribe(() => {
        expect(component.personalInfoGroup.enable).toHaveBeenCalled();
      });
  });

  it('should load onSubmit and save the residence info successfully', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));
    spyOn(identityService, 'saveResidenceInfo').and.returnValue(of({}));
    spyOn(assignmentService, 'candidateProvidesResidenceInfo').and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.ngOnInit();

    component.form.patchValue({
      workingThroughEntity: false,
    });

    component.form.patchValue({
      personalInfo: {
        title: 'Mr',
        address1: 'Street 1',
        address2: 'Street 2',
        city: 'Niteroi',
        state: 'RJ',
        zip: '2435',
        country: 'Brazil',
        primaryCitizenship: 'USA',
      },
    });
    component.isPending = false;

    component.onSubmit();

    expect(component.isPending).toBeFalsy();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should load onSubmit and save the residence info successfully as an Entity', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));
    spyOn(identityService, 'saveResidenceInfo').and.returnValue(of({}));
    spyOn(assignmentService, 'candidateProvidesResidenceInfo').and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.ngOnInit();

    component.form.patchValue({
      workingThroughEntity: true,
    });

    component.form.patchValue({
      entityInfo: {
        name: 'Aurea',
        address1: 'Street 1',
        address2: 'Street 2',
        city: 'Niteroi',
        state: 'RJ',
        zip: '2435',
        country: 'Brazil',
      },
    });
    component.isPending = false;

    component.onSubmit();

    expect(component.isPending).toBeFalsy();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should load onSubmit and throw an error when trying to save the residence info', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));
    spyOn(identityService, 'saveResidenceInfo').and.returnValue(_throw({ error: { text: 'Error' } }));

    component.ngOnInit();

    component.form.patchValue({
      workingThroughEntity: true,
    });

    component.form.patchValue({
      entityInfo: {
        name: 'Aurea',
        address1: 'Street 1',
        address2: 'Street 2',
        city: 'Niteroi',
        state: 'RJ',
        zip: '2435',
        country: 'Brazil',
      },
    });
    component.isPending = false;

    component.onSubmit();

    expect(component.isPending).toBe(false);
    expect(component.error).toBe('Error');
  });

  it('should display a generic error message when an unknown error happens during residence info step storage', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));
    spyOn(identityService, 'saveResidenceInfo').and.returnValue(_throw({}));

    component.ngOnInit();

    component.form.patchValue({
      workingThroughEntity: true,
    });

    component.form.patchValue({
      entityInfo: {
        name: 'Aurea',
        address1: 'Street 1',
        address2: 'Street 2',
        city: 'Niteroi',
        state: 'RJ',
        zip: '2435',
        country: 'Brazil',
      },
    });
    component.isPending = false;

    component.onSubmit();

    expect(component.isPending).toBeFalsy();
    expect(component.error).toBe('An unknown error happened while attempting to store residence info.');
  });

  it('should load onSubmit with a invalid form, therefore, nothing happens', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));
    spyOn(identityService, 'saveResidenceInfo').and.returnValue(_throw({ error: { text: 'Error' } }));

    component.ngOnInit();

    component.form.patchValue({
      workingThroughEntity: true,
    });

    component.onSubmit();

    expect(identityService.saveResidenceInfo).not.toHaveBeenCalled();
  });

  it('should load addCitizenship method and enable the secondary citizenship select', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));

    component.ngOnInit();

    spyOn(component.secondaryCitizenshipControl, 'enable');

    component.addCitizenship();

    expect(component.ieFixClass).toBe('ie-fix');
    expect(component.secondaryCitizenshipControl.enable).toHaveBeenCalled();
  });

  it('should load addCitizenship method and enable the tertiary citizenship select', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));

    component.ngOnInit();

    spyOn(component.tertiaryCitizenshipControl, 'enable');

    component.secondaryCitizenshipControl.enable();
    component.addCitizenship();

    expect(component.ieFixClass).toBe('ie-fix');
    expect(component.tertiaryCitizenshipControl.enable).toHaveBeenCalled();
  });

  it('should load removeCitizenship method and disable the tertiary citizenship select', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));

    component.ngOnInit();

    spyOn(component.tertiaryCitizenshipControl, 'disable');
    spyOn(component.tertiaryCitizenshipControl, 'reset');

    component.tertiaryCitizenshipControl.enable();
    component.removeCitizenship();

    expect(component.tertiaryCitizenshipControl.disable).toHaveBeenCalled();
    expect(component.tertiaryCitizenshipControl.reset).toHaveBeenCalled();
  });

  it('should load removeCitizenship method and disable the secondary citizenship select', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of(<Country[]>[{ id: 2 }]));

    component.ngOnInit();

    spyOn(component.secondaryCitizenshipControl, 'disable');
    spyOn(component.secondaryCitizenshipControl, 'reset');

    component.secondaryCitizenshipControl.enable();
    component.removeCitizenship();

    expect(component.ieFixClass).toBe('');
    expect(component.secondaryCitizenshipControl.disable).toHaveBeenCalled();
    expect(component.secondaryCitizenshipControl.reset).toHaveBeenCalled();
  });
});
