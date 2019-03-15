import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfActiveModal } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { mock } from 'ts-mockito';

import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import {
  EndorsementCommentsComponent,
} from 'app/modules/account-manager/pages/endorsement-comments/endorsement-comments.component';

describe('EndorsementCommentsComponent', () => {
  let component: EndorsementCommentsComponent;
  let fixture: ComponentFixture<typeof component>;
  let hireService: HireService;
  let identityService: IdentityService;
  let activeModal: DfActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [EndorsementCommentsComponent],
      imports: [],
      providers: [
        { provide: DfActiveModal, useFactory: () => mock(DfActiveModal) },
        { provide: HireService, useFactory: () => mock(HireService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsementCommentsComponent);

    component = fixture.componentInstance;
    hireService = TestBed.get(HireService);
    identityService = TestBed.get(IdentityService);
    activeModal = TestBed.get(DfActiveModal);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load existing comments successfully', () => {
    const applicationNotes = Object.assign([
      {
        sender: { printableName: 'Sample User' },
        createdOn: new Date(),
      },
    ]);

    spyOn(identityService, 'currentUserIsAccountManager').and.returnValue(of(true));
    spyOn(hireService, 'getApplicationComment').and.returnValue(of(applicationNotes));
    activeModal.data = { id: 1 };
    fixture.detectChanges();

    expect(component.notes).toBe(applicationNotes);
  });

  it('should set an error message when application comments retrieval fails', () => {
    const error = ErrorObservable.create({});

    spyOn(identityService, 'currentUserIsAccountManager').and.returnValue(of(true));
    spyOn(hireService, 'getApplicationComment').and.returnValue(error);
    activeModal.data = { id: 1 };
    fixture.detectChanges();

    expect(component.error).toBe('An unknown error occurred while retrieving HM notes data.');
  });

  it('should store a new application comment successfully', () => {
    const note = 'New Note';

    spyOn(activeModal, 'close');
    spyOn(hireService, 'postApplicationComment').and.returnValue(of(null));
    activeModal.data = { id: 1 };
    component.form.controls['note'].setValue(note);

    component.submit();

    expect(activeModal.close).toHaveBeenCalledWith(note);
  });

  it('should raise an error message when application comment storage fails', () => {
    const errorMessage = 'An error occurred';
    const error = ErrorObservable.create({
      error: {
        error: { text: errorMessage },
      },
    });

    spyOn(activeModal, 'close');
    spyOn(hireService, 'postApplicationComment').and.returnValue(error);
    activeModal.data = { id: 1 };

    component.submit();

    expect(component.error).toBe(errorMessage);
  });

  it('should close the modal successfully', () => {
    spyOn(activeModal, 'close');

    component.close();

    expect(activeModal.close).toHaveBeenCalledWith();
  });
});
