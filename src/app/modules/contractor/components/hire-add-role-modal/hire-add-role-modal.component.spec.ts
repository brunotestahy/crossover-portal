import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { DfActiveModal } from '@devfactory/ngx-df';
import * as _ from 'lodash'
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { mock } from 'ts-mockito';

import { Units as SalaryUnits } from 'app/core/constants/hire/salary-unit';
import { HireService } from 'app/core/services/hire/hire.service';
import { TeamService } from 'app/core/services/team/team.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import {
  HireAddRoleModalComponent,
} from 'app/modules/contractor/components/hire-add-role-modal/hire-add-role-modal.component';
import { PropertyFilterPipe } from 'app/shared/pipes/property-filter.pipe';

describe('HireAddRoleModalComponent', () => {
  let component: HireAddRoleModalComponent;
  let fixture: ComponentFixture<typeof component>;
  let activeModal: DfActiveModal;
  let hireService: HireService;
  let teamService: TeamService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HireAddRoleModalComponent,
        PropertyFilterPipe,
      ],
      providers: [
        { provide: DfActiveModal, useFactory: () => mock(DfActiveModal) },
        { provide: HireService, useFactory: () => mock(HireService) },
        { provide: TeamService, useFactory: () => mock(TeamService) },
        { provide: DomSanitizer, useValue: {
            bypassSecurityTrustHtml: (value: string) => value,
        }},
        { provide: WINDOW_TOKEN, useValue: { setTimeout: (callback: Function) => callback() } },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HireAddRoleModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.get(DfActiveModal);
    hireService = TestBed.get(HireService);
    teamService = TestBed.get(TeamService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get initialized successfully', () => {
    const jobs = Object.assign([]);
    spyOn(hireService, 'getJobs').and.returnValue(of(jobs));
    component.isLoading = true;

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.jobs).toBe(jobs);
  });

  it('should set an error message when jobs retrieval fails', () => {
    spyOn(hireService, 'getJobs').and.returnValue(_throw({}));
    component.isLoading = true;

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('An unknown error happened while retrieving jobs data.');
  });

  it('should set the description for a job successfully', () => {
    const job = Object.assign({ id: 1 });
    const jobDetails = Object.assign({
      managerDescription: '<p style="font-size:10px;">Description</p>',
    });
    spyOn(hireService, 'getJob').and.returnValue(of(jobDetails));
    component.openJobDescription(job);

    expect(component.jobsDetails[job.id]).toBe('<p>Description</p>');
  });

  it('should set an error message job details retrieval fails', () => {
    const job = Object.assign({ id: 1 });
    spyOn(hireService, 'getJob').and.returnValue(_throw({}));

    component.openJobDescription(job);

    expect(component.error).toBe('An unknown error happened while retrieving job details data.');
    expect(component.jobsDetails[job.id]).not.toBeDefined();
  });

  it('should retrieve the weekly cost for a weekly paid position successfully', () => {
    const job = Object.assign({
      salaryType: SalaryUnits.WEEK.salaryType,
      salary: 50,
      workingHoursPerWeek: 40,
    });
    const result = component.getRoleWeeklyCost(job);

    expect(result).toBe(2000);
  });

  it('should retrieve the weekly cost for a non-weekly paid position successfully', () => {
    const job = Object.assign({
      salaryType: SalaryUnits.MONTH.salaryType,
      salary: 10000,
    });
    const result = component.getRoleWeeklyCost(job);

    expect(result).toBe(2400);
  });

  it('should close the modal successfully', () => {
    spyOn(activeModal, 'close');
    component.close();

    expect(activeModal.close).toHaveBeenCalled();
  });

  it('should save role successfully', () => {
    const currentTeam = {id: 1};
    activeModal.data = { currentTeam };
    const emmitedValue = Object.assign({});
    _.set(component, 'panels', Object.assign([
      { expanded: true, closePanel: jasmine.createSpy('closePanel') }
    ]));
    spyOn(teamService, 'demand').and.returnValue(of(emmitedValue));
    component.roleStore
      .subscribe((value: {}) => expect(value).toBe(emmitedValue));

    component.saveAndAdd();
    expect(component.isLoading).toBe(false);
  });

  it('should set an error message when an error occurs during role storage', () => {
    const currentTeam = {id: 1};
    activeModal.data = { currentTeam };
    spyOn(teamService, 'demand').and.returnValue(_throw({}));

    component.saveAndAdd();
    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('An unknown error happened while storing demand data.');
  });
});
