import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfActiveModal } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { mock } from 'ts-mockito';

import { HireService } from 'app/core/services/hire/hire.service';
import {
  EndorsementNotesComponent,
} from 'app/modules/account-manager/pages/endorsement-notes/endorsement-notes.component';

describe('EndorsementNotesComponent', () => {
  let component: EndorsementNotesComponent;
  let fixture: ComponentFixture<typeof component>;
  let hireService: HireService;
  let activeModal: DfActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [EndorsementNotesComponent],
      imports: [],
      providers: [
        { provide: DfActiveModal, useFactory: () => mock(DfActiveModal) },
        { provide: HireService, useFactory: () => mock(HireService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsementNotesComponent);

    component = fixture.componentInstance;
    hireService = TestBed.get(HireService);
    activeModal = TestBed.get(DfActiveModal);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load existing notes successfully', () => {
    const applicationNotes = Object.assign([
      {
        sender: { printableName: 'Sample User' },
        createdOn: new Date(),
      },
    ]);

    spyOn(hireService, 'getApplicationNotes').and.returnValue(of(applicationNotes));
    activeModal.data = { id: 1 };
    fixture.detectChanges();

    expect(component.notes).toBe(applicationNotes);
  });

  it('should set an error message when application notes retrieval fails', () => {
    const error = ErrorObservable.create({});

    spyOn(hireService, 'getApplicationNotes').and.returnValue(error);
    activeModal.data = { id: 1 };
    fixture.detectChanges();

    expect(component.error).toBe('An unknown error occurred while retrieving application notes data.');
  });

  it('should store a new application note successfully', () => {
    const note = 'New Note';

    spyOn(activeModal, 'close');
    spyOn(hireService, 'postApplicationNote').and.returnValue(of(null));
    activeModal.data = { id: 1 };
    component.form.controls['note'].setValue(note);

    component.submit();

    expect(activeModal.close).toHaveBeenCalledWith(note);
  });

  it('should raise an error message when application note storage fails', () => {
    const errorMessage = 'An error occurred';
    const error = ErrorObservable.create({
      error: {
        error: { text: errorMessage },
      },
    });

    spyOn(activeModal, 'close');
    spyOn(hireService, 'postApplicationNote').and.returnValue(error);
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
