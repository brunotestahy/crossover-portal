import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { IdentityService } from '../../../../core/services/identity/identity.service';

import { VerifyEmailComponent } from './verify-email.component';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let identityService: IdentityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ VerifyEmailComponent ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: of({ applicationId: '1' }) }}},
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        FormBuilder,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
  });

  it('[resend] should resend email', () => {
    spyOn(identityService, 'resendActivation').and.returnValue(of(true));
    component.resend();
    expect(component.isSending).toBeFalsy();
  });
});
