import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfModalService } from '@devfactory/ngx-df';
import { format } from 'date-fns';
import { mock } from 'ts-mockito';

import { ASSIGNMENT_SIMPLE_MOCK } from 'app/core/services/mocks/assignment.mock';
import { PictureCardComponent } from 'app/shared/components/picture-card/picture-card.component';
import { EnumToStringPipe } from 'app/shared/pipes/enum-to-string.pipe';
import { TimeUtilsService } from 'app/shared/services/timeutils/time-utils.service';

describe('PictureCardComponent', () => {
  let component: PictureCardComponent;
  let modalService: DfModalService;
  let fixture: ComponentFixture<PictureCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PictureCardComponent, EnumToStringPipe],
      providers: [
        TimeUtilsService,
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-04-11T03:24:00'));
    modalService = TestBed.get(DfModalService);
    fixture = TestBed.createComponent(PictureCardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show/hide salary', () => {
    component.showSalary();
    expect(component.viewSalary).toBeTruthy();
    component.hideSalary();
    expect(component.viewSalary).toBeFalsy();
  });

  it('should getUserTimezone', () => {
    expect(format(component.getUserTimezone(60000), 'YYYY-MM-DD HH:mm')).toEqual('2018-04-11 03:25');
    expect(format(component.getUserTimezone(0), 'YYYY-MM-DD HH:mm')).toEqual('2018-04-11 03:24');
  });

  it('[isFeatureEnabled] should return false if no assignment', () => {
    component.assignment = null;
    expect(component.isFeatureEnabled('someFeature')).toBeFalsy();
  });

  it('[isFeatureEnabled] should return true if assignment has no features disabled', () => {
    component.assignment = ASSIGNMENT_SIMPLE_MOCK;
    expect(component.isFeatureEnabled('someFeature')).toBeTruthy();
  });

  it('[isFeatureEnabled] should return false if assignment has more than one feature disabled', () => {
    component.assignment = ASSIGNMENT_SIMPLE_MOCK;
    component.assignment.disabledFeatures = ['F1', 'F2'];
    expect(component.isFeatureEnabled('F1')).toBeFalsy();
  });

  it('[toggleSkypeOptions] should toggle skype options', () => {
    component.toggleSkypeOptions();
    expect(component.viewSkype).toBeTruthy();
  });

  it('[showEndContractModal] should show end contract modal', () => {
    spyOn(modalService, 'open');
    component.assignment = ASSIGNMENT_SIMPLE_MOCK;
    component.showEndContractModal();
    expect(modalService.open).toHaveBeenCalled();
  });

  it('[showEndContractModal] should not show end contract modal', () => {
    spyOn(modalService, 'open');
    component.assignment = null;
    component.showEndContractModal();
    expect(modalService.open).not.toHaveBeenCalled();
  });

  it('[onEndContract] should set termination date', () => {
    component.assignment = Object.assign(ASSIGNMENT_SIMPLE_MOCK, {});
    component.onEndContract('2018-01-01');
    expect(component.assignment.scheduledTerminationDate).toBeDefined();
  });

  it('[onEndContract] should not set termination date', () => {
    component.assignment = null;
    component.onEndContract('2018-01-01');
    expect(component.assignment).toBe(null);
  });
});
