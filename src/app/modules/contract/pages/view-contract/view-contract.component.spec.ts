import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DfAlertModule,
  DfAlertService,
  DfButtonModule, DfCardModule,
  DfCheckboxModule, DfInputModule,
  DfToasterModule,
  DfToasterService,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { Assignment } from 'app/core/models/assignment';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ViewContractComponent } from 'app/modules/contract/pages/view-contract/view-contract.component';
import { EventService } from 'app/shared/services/event.service';
import Spy = jasmine.Spy;

describe('ViewContractComponent', () => {
  let component: ViewContractComponent;
  let fixture: ComponentFixture<ViewContractComponent>;
  let assignmentService: AssignmentService;
  let alertService: DfAlertService;
  let toasterService: DfToasterService;
  let identityService: IdentityService;
  let router: Router;

  let spyNgOnInit: Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ViewContractComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        DfAlertModule,
        DfButtonModule,
        DfCheckboxModule,
        DfCardModule,
        DfInputModule,
        DfToasterModule,
        DfValidationMessagesModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            params: of({}),
          },
        },
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: DfAlertService, useFactory: () => mock(DfAlertService) },
        { provide: DfToasterService, useFactory: () => mock(DfToasterService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        EventService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContractComponent);
    component = fixture.componentInstance;
    spyNgOnInit = spyOn(component, 'ngOnInit').and.returnValue('');
    fixture.detectChanges();

    assignmentService = TestBed.get(AssignmentService);
    alertService = TestBed.get(DfAlertService);
    toasterService = TestBed.get(DfToasterService);
    identityService = TestBed.get(IdentityService);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load the ngOnInit method, build the form and fetch the user and assingment data correctly', () => {
    spyNgOnInit.and.callThrough();
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({ firstName: 'Bruno' }));
    spyOn(assignmentService, 'getAssignmentById').and.returnValue(of({ manager: { firstName: 'Rajesh' } }));

    component.ngOnInit();

    expect(component.currentUser).toBeDefined();
    expect(component.form).toBeDefined();
    expect(component.assignment).toBeDefined();
    expect(component.manager).toBeDefined();
    expect(component.isLoading).toBeFalsy();
  });

  it('should load the ngOnInit method, build the form and throw an error during the fetching data, ' +
    'hence showing the alert and stopping the loading', () => {
    spyNgOnInit.and.callThrough();
    component.isLoading = true;
    spyOn(identityService, 'getCurrentUser').and.returnValue(Observable.throw({ error: { text: 'Error' }}));

    component.ngOnInit();

    expect(component.isLoading).toBeFalsy();
    expect(component.error).toBe('Error');
  });

  it('should load the ngOnInit method, build the form and throw an error during the fetching data, hence showing the alert', () => {
    spyNgOnInit.and.callThrough();
    component.isLoading = false;
    spyOn(identityService, 'getCurrentUser').and.returnValue(Observable.throw({ error: { text: 'Error' }}));

    component.ngOnInit();

    expect(component.error).toBe('Error');
  });

  it('should display a message and navigate to onboarding page when the offer is accepted', () => {
    component.assignment = Object.assign({ id: 11 }) as Assignment;
    spyNgOnInit.and.callThrough();
    spyOn(assignmentService, 'candidateAcceptsOffer').and.returnValue(of({}));
    spyOn(identityService, 'getCurrentUser').and.returnValue(Observable.throw({ error: { text: 'Error' }}));
    spyOn(toasterService, 'popSuccess').and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.ngOnInit();
    component.form.patchValue({ acceptTerms: true });
    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith([`candidate/onboarding-process/${component.assignment.id}`]);
  });

  it('should load the onSubmit method and call the acceptOffer and throw an error', () => {
    spyNgOnInit.and.callThrough();
    spyOn(assignmentService, 'candidateAcceptsOffer').and.returnValue(Observable.throw({ error: { text: 'Error' }}));
    spyOn(assignmentService, 'getAssignmentById').and.returnValue(of({ manager: { firstName: 'Rajesh' } }));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({ firstName: 'Bruno' }));

    component.ngOnInit();
    component.form.patchValue({ acceptTerms: true });
    component.onSubmit();

    expect(component.error).toBe('Error');
  });

  it('should load the onSubmit method and not call the acceptOffer method, because the form is invalid', () => {
    spyNgOnInit.and.callThrough();
    spyOn(assignmentService, 'getAssignmentById').and.returnValue(of({ manager: { firstName: 'Rajesh' } }));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({ firstName: 'Bruno' }));
    spyOn(router, 'navigate');

    component.ngOnInit();
    component.form.patchValue({ acceptTerms: false });
    component.onSubmit();

    expect(component.error).not.toBe('Error');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should display the toaster with a successful message and navigate to the hiring page when the offer is rejected', () => {
    component.assignment = Object.assign({ id: 11 }) as Assignment;
    spyOn(alertService, 'createDialog').and.returnValue(of(['ok']));
    spyOn(assignmentService, 'candidateDeclinesOffer').and.returnValue(of({}));
    spyOn(toasterService, 'popSuccess').and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.onDeclineClicked();

    expect(router.navigate).toHaveBeenCalledWith(['candidate/dashboard/hiring']);
  });

  it('should load the onDeclineClicked method and and do nothing if cancel is clicked in the modal', () => {
    spyOn(alertService, 'createDialog').and.returnValue(of(['cancel']));
    spyOn(router, 'navigate');

    component.onDeclineClicked();

    expect(router.navigate).not.toHaveBeenCalledWith(['candidate']);
  });

  it('should load the declineOffer method and call the handleError method in a negative response', () => {
    spyOn(alertService, 'createDialog').and.returnValue(of(['ok']));
    spyOn(assignmentService, 'candidateDeclinesOffer').and.returnValue(Observable.throw({ error: { text: 'Error' }}));

    component.onDeclineClicked();

    expect(component.error).toBe('Error');
  });
});
