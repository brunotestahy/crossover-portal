import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { TASKS_MOCK } from 'app/core/services/mocks/tasks.mock';

import { BackgroundCheckComponent } from './background-check.component';

describe('BackgroundCheckComponent', () => {
  let component: BackgroundCheckComponent;
  let fixture: ComponentFixture<BackgroundCheckComponent>;
  let assignmentService: AssignmentService;
  let identityService: IdentityService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BackgroundCheckComponent,
      ],
      imports: [ RouterTestingModule ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            params: of({}),
          },
        },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundCheckComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
    assignmentService = TestBed.get(AssignmentService);
    router = TestBed.get(Router);

    spyOn(identityService, 'getCurrentUserTasks').and.returnValue(Observable.of(TASKS_MOCK));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit]', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
  });

  it('should submit reference number success', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    spyOn(assignmentService, 'candidateProvideBackgroundCode').and.returnValue(Observable.of({}));
    spyOn(router, 'navigate').and.callFake(() => {});
    component.form.controls.code.setValue(12345678);
    component.onSubmit();
  });
});
