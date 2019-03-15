import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DfLoadingSpinnerService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { AssignmentService } from '../../../../core/services/assignments/assignment.service';
import { TASK_MOCK } from '../../../../core/services/mocks/task.mock';
import { NotificationService } from '../../../../core/services/notification/notification.service';

import { SetupTrackerComponent } from './setup-tracker.component';

describe('SetupTrackerComponent', () => {
  let component: SetupTrackerComponent;
  let fixture: ComponentFixture<SetupTrackerComponent>;

  let assignmentService: AssignmentService;
  let notificationService: NotificationService;
  let loader: DfLoadingSpinnerService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          SetupTrackerComponent,
        ],
        imports: [ReactiveFormsModule, FormsModule],
        providers: [
          {provide: AssignmentService, useFactory: () => mock(AssignmentService)},
          {provide: NotificationService, useFactory: () => mock(NotificationService)},
          {provide: DfLoadingSpinnerService, useFactory: () => mock(DfLoadingSpinnerService)},
          {provide: Router, useFactory: () => mock(Router)},
          {provide: ActivatedRoute, useFactory: () => mock(ActivatedRoute)},
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupTrackerComponent);
    component = fixture.componentInstance;
    assignmentService = TestBed.get(AssignmentService);
    notificationService = TestBed.get(NotificationService);
    loader = TestBed.get(DfLoadingSpinnerService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);

    spyOn(notificationService, 'getActiveTaskValue')
      .and.returnValue(TASK_MOCK);
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should get the dependencies', () => {
    expect(assignmentService).toBeTruthy();
    expect(notificationService).toBeTruthy();
    expect(loader).toBeTruthy();
    expect(router).toBeTruthy();
    expect(route).toBeTruthy();
  });

  describe('submit form', () => {
    it('should be invalid form when password is empty', () => {
      fixture.detectChanges();
      expect(component.form.valid).toBeFalsy();
    });

    it('should have required password field', () => {
      fixture.detectChanges();
      const password = component.form.controls['password'];
      const errors = password.errors || {};

      expect(errors['required']).toBeTruthy();
    });
  });

  describe('on submit setup tracker', () => {
    it('should hide loader on submit success', () => {
      spyOn(assignmentService, 'provideUserPassword').and.returnValue(of({}));
      spyOn(loader, 'showLoader');
      spyOn(loader, 'hide');
      const assignmentId = (TASK_MOCK.object || {id: 0}).id;
      const password = 'mock-password';

      fixture.detectChanges();
      component.form.controls.password.setValue(password);
      component.onSubmit();

      expect(assignmentService.provideUserPassword).toHaveBeenCalledWith(assignmentId, password);
      expect(loader.showLoader).toHaveBeenCalled();
      expect(loader.hide).toHaveBeenCalled();
    });

    it('should hide loader when on submit error', () => {
      const expectedError = {error: {text: 'error message'}};
      spyOn(assignmentService, 'provideUserPassword').and.returnValue(Observable.throw(expectedError));
      spyOn(loader, 'showLoader');
      spyOn(loader, 'hide');
      const assignmentId = (TASK_MOCK.object || {id: 0}).id;
      const password = 'mock-password';

      fixture.detectChanges();
      component.form.controls.password.setValue(password);
      component.onSubmit();

      expect(assignmentService.provideUserPassword).toHaveBeenCalledWith(assignmentId, password);
      expect(loader.showLoader).toHaveBeenCalled();
      expect(loader.hide).toHaveBeenCalled();
    });
  });

  it('should submit user password and redirect to setup residence page', () => {
    spyOn(assignmentService, 'provideUserPassword').and.returnValue(of({}));
    spyOn(router, 'navigate');
    spyOn(loader, 'showLoader');
    spyOn(loader, 'hide');
    const assignmentId = (TASK_MOCK.object || {id: 0}).id;
    const password = 'mock-password';

    fixture.detectChanges();
    component.form.controls.password.setValue(password);
    component.onSubmit();

    expect(assignmentService.provideUserPassword).toHaveBeenCalledWith(assignmentId, password);
    expect(loader.hide).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['../setup-residence'],
      {relativeTo: route});
  });

  it('should show error if submit user password failed', () => {
    const expectedError = {error: {text: 'error message'}};
    spyOn(assignmentService, 'provideUserPassword').and.returnValue(Observable.throw(expectedError));
    spyOn(router, 'navigate');
    spyOn(loader, 'hide');
    const assignmentId = (TASK_MOCK.object || {id: 0}).id;
    const password = 'mock-password';

    fixture.detectChanges();
    component.form.controls.password.setValue(password);
    component.onSubmit();

    expect(assignmentService.provideUserPassword).toHaveBeenCalledWith(assignmentId, password);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.error).toBe(expectedError.error.text);
    expect(loader.hide).toHaveBeenCalled();
  });

  it('should not submit if no tracker setup pending', () => {
    spyOn(loader, 'hide');
    const password = 'mock-password';
    fixture.detectChanges();
    component.form.controls.password.setValue(password);
    component.isPending = true;
    component.onSubmit();
    expect(loader.hide).not.toHaveBeenCalled();
  });
});
