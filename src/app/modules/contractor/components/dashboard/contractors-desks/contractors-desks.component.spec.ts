import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DfModalService, DfModalSize } from '@devfactory/ngx-df';
import { mock } from 'ts-mockito';

import { OnlineStatusService } from 'app/core/services/timetracking/online-status.service';
import { ContractorsDesksComponent } from 'app/modules/contractor/components/dashboard/contractors-desks/contractors-desks.component';

describe('ContractorsDesksComponent', () => {
  let component: ContractorsDesksComponent;
  let fixture: ComponentFixture<ContractorsDesksComponent>;

  let onlineStatusService: OnlineStatusService;
  let modalService: DfModalService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContractorsDesksComponent,
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: OnlineStatusService, useFactory: () => mock(OnlineStatusService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorsDesksComponent);
    component = fixture.componentInstance;

    onlineStatusService = TestBed.get(OnlineStatusService);
    modalService = TestBed.get(DfModalService);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display the contractor desk as online when the screen is loaded', () => {
    const workDiary = Object.assign({ id: 1 });
    spyOn(onlineStatusService, 'getWorkDiary').and.returnValue(workDiary);
    spyOn(onlineStatusService, 'getWorkDiaryOnlineStatusClass').and.returnValue('online');

    expect(component.getDesk(Object.assign({}))).toBe('contractor-1');
  });

  it('should display the contractor desk as no-activity when the screen is loaded', () => {
    const workDiary = Object.assign({ id: 1 });
    spyOn(onlineStatusService, 'getWorkDiary').and.returnValue(workDiary);
    spyOn(onlineStatusService, 'getWorkDiaryOnlineStatusClass').and.returnValue('no-activity');

    expect(component.getDesk(Object.assign({}))).toBe('empty');
  });

  it('should display the contractor desk as offline when the screen is loaded', () => {
    const workDiary = Object.assign({ id: 1 });
    spyOn(onlineStatusService, 'getWorkDiary').and.returnValue(workDiary);
    spyOn(onlineStatusService, 'getWorkDiaryOnlineStatusClass').and.returnValue('offline');

    expect(component.getDesk(Object.assign({}))).toBe('empty');
  });

  it('should display the contractor desk as empty when the screen is loaded', () => {
    const workDiary = Object.assign({ value: null }).value;
    spyOn(onlineStatusService, 'getWorkDiary').and.returnValue(workDiary);

    expect(component.getDesk(Object.assign({}))).toBe('empty');
  });

  it('should show the contractor tooltip when the screen is loaded with a contractor account', () => {
    const assignment = Object.assign({ candidate: { id: 2 } });
    component.currentUser = Object.assign({ id: 1 });

    expect(component.showContractorTooltip(assignment)).toBe(false);
  });

  it('should show the contractor tooltip when the screen is loaded with a manager account', () => {
    const assignment = Object.assign({ candidate: { id: 2 } });
    component.managerMode = true;

    expect(component.showContractorTooltip(assignment)).toBe(true);
  });

  it('should navigate to the my-dashboard screen when the modal is opened with a contractor account', () => {
    const assignment = Object.assign({ candidate: { userId: 2 } });
    spyOn(component, 'showContractorTooltip').and.returnValue(true);
    spyOn(router, 'navigate').and.returnValue('');
    component.currentUser = Object.assign({ id: 2 });

    component.navigateToContractor(assignment);

    expect(router.navigate).toHaveBeenCalledWith(['/contractor/my-dashboard/summary']);
  });

  it('should navigate to the my-dashboard screen when the modal is opened with a manager account', () => {
    component.managerMode = true;
    const assignment = Object.assign({ candidate: { id: 2 }, id: 11, manager: { id: 1 }, team: { id: 13 } });
    spyOn(modalService, 'open').and.returnValue('');

    component.navigateToContractor(assignment);

    expect(component.currentUserManager).toBe(assignment.manager);
    expect(component.currentUserAssignmentId).toBe(assignment.id);
    expect(component.currentUserTeamId).toBe(assignment.team.id);
    expect(component.currentContractor).toBe(assignment.candidate);
    expect(modalService.open).toHaveBeenCalledWith(component.profileModal, { customClass: 'full-screen' });
  });

  it('should navigate to the logbook screen when the modal is opened with a contractor account', () => {
    const assignment = Object.assign({ candidate: { userId: 2 } });
    spyOn(component, 'showContractorTooltip').and.returnValue(true);
    spyOn(router, 'navigate').and.returnValue('');
    component.currentUser = Object.assign({ id: 2 });

    component.navigateToLogbook(assignment);

    expect(router.navigate).toHaveBeenCalledWith(['/contractor/my-dashboard/logbook']);
  });

  it('should navigate to the logbook screen when the modal is opened with a manager account', () => {
    component.managerMode = true;
    const assignment = Object.assign({ candidate: { id: 2 }, id: 11, manager: { id: 1 }, team: { id: 13 } });
    spyOn(modalService, 'open').and.returnValue('');

    component.navigateToLogbook(assignment);

    expect(component.currentAssignment).toBe(assignment);
    expect(modalService.open).toHaveBeenCalledWith(component.contractorActivityModal, {
      size: DfModalSize.Large,
    });
  });

  it('should align the desk to the right when the index has an even value', () => {
    expect(component.getDeskOrientation(4)).toBe('right');
  });

  it('should align the desk to the left when the index has an odd value', () => {
    expect(component.getDeskOrientation(3)).toBe('left');
  });
});
