import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DfAlertModule, DfAlertService, DfToasterModule, DfToasterService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { CandidateService } from '../../../../core/services/candidate/candidate.service';

import { CancelApplicationPageComponent } from './cancel-application-page.component';

describe('CancelApplicationPageComponent', () => {
  let component: CancelApplicationPageComponent;
  let fixture: ComponentFixture<CancelApplicationPageComponent>;
  let candidateService: CandidateService;
  let alertService: DfAlertService;
  let toasterService: DfToasterService;
  let router: Router;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CancelApplicationPageComponent],
      imports: [
        RouterTestingModule,
        DfAlertModule,
        DfToasterModule,
      ],
      providers: [
        { provide: CandidateService, useFactory: () => mock(CandidateService) },
        { provide: DfAlertService, useFactory: () => mock(DfAlertService) },
        { provide: DfToasterService, useFactory: () => mock(DfToasterService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelApplicationPageComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.get(CandidateService);
    alertService = TestBed.get(DfAlertService);
    toasterService = TestBed.get(DfToasterService);
    router = TestBed.get(Router);
    location = TestBed.get(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] cancel modal', () => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'IN_PROGRESS',
    }));
    spyOn(alertService, 'createDialog').and.returnValue(of(['Cancel']));
    spyOn(location, 'back');
    component.ngOnInit();
    expect(location.back).toHaveBeenCalled();
  });

  it('[ngOnInit] ok modal / accepted application', () => {
    spyOn(alertService, 'createDialog').and.returnValue(of(['ok']));
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'ACCEPTED',
    }));
    component.ngOnInit();
    expect(component.noOpenApplications).toBeTruthy();
  });

  it('[ngOnInit] ok modal / in progress application / success', () => {
    spyOn(alertService, 'createDialog').and.returnValue(of(['ok']));
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'IN_PROGRESS',
    }));
    spyOn(candidateService, 'cancelApplication').and.returnValue(of({}));
    spyOn(toasterService, 'popSuccess').and.returnValue(of({}));
    spyOn(router, 'navigateByUrl');
    component.ngOnInit();
    expect(router.navigateByUrl).toHaveBeenCalledWith('marketplace/available-jobs');
  });

  it('[ngOnInit] ok modal / in progress application / error', () => {
    spyOn(alertService, 'createDialog').and.returnValue(of(['ok']));
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'IN_PROGRESS',
    }));
    spyOn(candidateService, 'cancelApplication').and.returnValue(Observable.throw({}));
    component.ngOnInit();
    expect(component.error).toEqual('Error cancelling application.');
  });
});
