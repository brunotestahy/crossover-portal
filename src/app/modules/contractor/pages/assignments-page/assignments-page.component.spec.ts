import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { AssignmentHistory } from 'app/core/models/assignment/assignment-history.model';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ASSIGNMENTS_MOCK } from 'app/core/services/mocks/identity.mock';
import { AssignmentsPageComponent } from 'app/modules/contractor/pages/assignments-page/assignments-page.component';
import { EnumToStringPipe } from 'app/shared/pipes/enum-to-string.pipe';

class IdentityServiceMock {
  public getAssignmentsForCurrentUser(): Observable<{}> {
    return of({});
  }
}

class EnumToStringPipeMock {
  public transform(): Observable<{}> {
    return of({});
  }
}

describe('AssignmentsPageComponent', () => {
  let component: AssignmentsPageComponent;
  let fixture: ComponentFixture<AssignmentsPageComponent>;
  let identityService: Partial<IdentityService>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AssignmentsPageComponent],
      imports: [],
      providers: [BreakpointObserver, MediaMatcher, Platform,
        { provide: IdentityService, useClass: IdentityServiceMock },
        { provide: EnumToStringPipe, useClass: EnumToStringPipeMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentsPageComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('nginit should call getAssignmentsForCurrentUser', () => {
    spyOn(identityService, 'getAssignmentsForCurrentUser').and.returnValue(Observable.of(ASSIGNMENTS_MOCK));
    component.ngOnInit();
    expect(identityService.getAssignmentsForCurrentUser).toHaveBeenCalled();
  });

  it('getAssignmentHistory function - should return assignment history', () => {
    const assignments = Object.assign(ASSIGNMENTS_MOCK);
    const history = component.getAssignmentHistory(assignments);
    expect(history.length).toBe(2);
  });

  it('[ngOnInit] should throw custom error on getting summary', () => {
    spyOn(identityService, 'getAssignmentsForCurrentUser').and.returnValue(Observable.throw({}));
    fixture.detectChanges();
    expect(component.error).toBeTruthy();
  });

  it('[exportCsv] should throw api error on exporting csv', () => {
    spyOn(identityService, 'getAssignmentsForCurrentUser').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    fixture.detectChanges();
    expect(component.error).toBeTruthy();
  });

  it('[getStatus] should return terminated status', () => {
    const assignmentHistory = Object.assign({
      status: 'ACTIVE',
    }, {}) as AssignmentHistory;
    expect(component.getStatus(assignmentHistory)).toBeDefined();
  });

  it('[getStatus] should return terminated status when effectiveDate present', () => {
    const assignmentHistory = Object.assign({
      status: 'ACTIVE',
      effectiveDateEnd: 'someDate',
    }, {}) as AssignmentHistory;
    expect(component.getStatus(assignmentHistory)).toBeDefined();
  });

});
