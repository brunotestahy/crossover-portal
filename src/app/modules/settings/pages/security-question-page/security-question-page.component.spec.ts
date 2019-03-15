import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DfToasterService } from '@devfactory/ngx-df';
import { EnumsService } from 'app/core/services/enums/enums.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { mock } from 'ts-mockito';

import { SecurityQuestionPageComponent } from './security-question-page.component';

describe('SecurityQuestionPageComponent', () => {
  let component: SecurityQuestionPageComponent;
  let fixture: ComponentFixture<SecurityQuestionPageComponent>;
  let toasterService: DfToasterService;
  let identityService: IdentityService;
  let enumService: EnumsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityQuestionPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: DfToasterService, useFactory: () => mock(DfToasterService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: EnumsService, useFactory: () => mock(EnumsService) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityQuestionPageComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(DfToasterService);
    identityService = TestBed.get(IdentityService);
    enumService = TestBed.get(EnumsService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid and not submit on empty fields', () => {
    spyOn(enumService, 'getSecurityQuestions').and.returnValue(of([ 'Sample Question' ]));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of(null));
    spyOn(identityService, 'changeCurrentUserSecurityQuestion');
    component.ngOnInit();
    component.form.setValue({ answer: '', question: '', customQuestion: '', newAnswer: '', 'accept': false });

    component.onSubmit();

    expect(component.form.valid).toBeFalsy();
    expect(identityService.changeCurrentUserSecurityQuestion).not.toHaveBeenCalled();
    expect(component.saving).toBeFalsy();
    expect(component.error).toBeUndefined();
  });

  it('should be invalid and not submit on not accept', () => {
    spyOn(enumService, 'getSecurityQuestions').and.returnValue(of([ 'Sample Question' ]));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of(null));
    spyOn(identityService, 'changeCurrentUserSecurityQuestion');
    component.ngOnInit();
    component.form.setValue({ answer: 'test1', question: 'Sample Question', customQuestion: '', newAnswer: 'test2', 'accept': false });

    component.onSubmit();

    expect(component.form.valid).toBeFalsy();
    expect(identityService.changeCurrentUserSecurityQuestion).not.toHaveBeenCalled();
    expect(component.saving).toBeFalsy();
    expect(component.error).toBeUndefined();
  });

  it('should call changeCurrentUserSecurityQuestion when valid [dropdown question]', () => {
    spyOn(enumService, 'getSecurityQuestions').and.returnValue(of([ 'Sample Question' ]));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of(null));
    spyOn(identityService, 'changeCurrentUserSecurityQuestion').and.returnValue(of(null));
    spyOn(toasterService, 'popSuccess');
    component.ngOnInit();
    component.form.setValue({ answer: 'test1', question: 'Sample Question', customQuestion: '', newAnswer: 'test2', 'accept': true });

    component.onSubmit();

    expect(component.form.valid).toBeTruthy();
    expect(identityService.changeCurrentUserSecurityQuestion).toHaveBeenCalledWith('test1', 'Sample Question', 'test2');
    expect(toasterService.popSuccess).toHaveBeenCalledWith('Security question changed successfully!');
    expect(component.currentQuestion).toBe('Sample Question');
    expect(component.form.value.answer).toBe('test2');
    expect(component.saving).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should call changeCurrentUserSecurityQuestion when valid [custom question]', () => {
    spyOn(enumService, 'getSecurityQuestions').and.returnValue(of([ 'Sample Question' ]));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of(null));
    spyOn(identityService, 'changeCurrentUserSecurityQuestion').and.returnValue(of(null));
    spyOn(toasterService, 'popSuccess');
    component.ngOnInit();
    component.form.setValue({ answer: 'test1', question: 'other', customQuestion: 'Sample Question', newAnswer: 'test2', 'accept': true });

    component.onSubmit();

    expect(component.form.valid).toBeTruthy();
    expect(identityService.changeCurrentUserSecurityQuestion).toHaveBeenCalledWith('test1', 'Sample Question', 'test2');
    expect(toasterService.popSuccess).toHaveBeenCalledWith('Security question changed successfully!');
    expect(component.currentQuestion).toBe('Sample Question');
    expect(component.form.value.answer).toBe('test2');
    expect(component.saving).toBeFalsy();
    expect(component.error).toBeNull();
  });

it('should Submit - and return server error', () => {
    spyOn(enumService, 'getSecurityQuestions').and.returnValue(of([ 'Sample Question' ]));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of(null));
    spyOn(identityService, 'changeCurrentUserSecurityQuestion').and.callThrough()
      .and.returnValue(_throw({
        error: {
          type: 'ERROR',
        },
      }));
    spyOn(toasterService, 'popSuccess');
    component.ngOnInit();
    component.form.setValue({ answer: 'test1', question: 'other', customQuestion: 'Sample Question', newAnswer: 'test2', 'accept': true });

    component.onSubmit();

    expect(component.saving).toBe(false);
  });

});
