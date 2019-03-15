import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { _throw } from 'rxjs/observable/throw';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';


import { IdentityService } from 'app/core/services/identity/identity.service';
import { CURRENT_USER_DETAILS } from 'app/core/services/mocks/current-user-details.mock';
import { FinishingUpComponent } from 'app/modules/onboarding/pages/finishing-up/finishing-up.component';

describe('FinishingUp', () => {
  let component: FinishingUpComponent;
  let fixture: ComponentFixture<FinishingUpComponent>;
  let identityService: IdentityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FinishingUpComponent,
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishingUpComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] ', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(Observable.of(CURRENT_USER_DETAILS));
    component.ngOnInit();
    expect(identityService.getCurrentUserDetail).toHaveBeenCalled();
  });

  it('[ngOnInit] without photo', () => {
    delete CURRENT_USER_DETAILS.assignment.manager.photoUrl;
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(Observable.of(CURRENT_USER_DETAILS));
    component.ngOnInit();
    expect(identityService.getCurrentUserDetail).toHaveBeenCalled();
    expect(component.managerAvatar).toBeUndefined();
  });

  it('[ngOnInit] error', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(_throw({ error: { text: 'Error' }}));
    component.ngOnInit();
    expect(component.error).toBeDefined();
  });
});
