import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { WorksmartDownloadPageComponent } from 'app/modules/worksmart/pages/worksmart-download-page/worksmart-download-page.component';

describe('WorksmartDownloadPageComponent', () => {
  let component: WorksmartDownloadPageComponent;
  let fixture: ComponentFixture<WorksmartDownloadPageComponent>;
  let identityService: IdentityService;
  let assignmentService: AssignmentService;

  class IdentityServiceMock implements Partial<IdentityService> {
  public currentUserIsCandidate(): Observable<boolean> {
      return of(false);
    }
  }

  class AssignmentServiceMock {
  public getCurrentUserAssignment(): Observable<{}> {
      return of({});
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksmartDownloadPageComponent ],
      providers: [
        { provide: IdentityService, useClass: IdentityServiceMock },
        { provide: AssignmentService, useClass: AssignmentServiceMock },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksmartDownloadPageComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
    assignmentService = TestBed.get(AssignmentService);
  });

  it('should not show dashboard link', () => {
    spyOn(identityService, 'currentUserIsCandidate').and.returnValue(of(false));
    spyOn(assignmentService, 'getCurrentUserAssignment').and.returnValue(of({}));
    fixture.detectChanges();
    expect(component.hasDashboardLink).toBeFalsy();
  });

  it('should show dashboard link', () => {
    spyOn(identityService, 'currentUserIsCandidate').and.returnValue(of(true));
    spyOn(assignmentService, 'getCurrentUserAssignment').and.returnValue(of({
      currentAssignmentHistory: {
        status: 'ACTIVE',
      },
    }));
    fixture.detectChanges();
    expect(component.hasDashboardLink).toBeTruthy();
  });
});
