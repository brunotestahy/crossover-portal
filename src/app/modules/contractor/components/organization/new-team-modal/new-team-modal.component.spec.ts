import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DfActiveModal } from '@devfactory/ngx-df';
import { mock } from 'ts-mockito';

import { TeamStoreRequest } from 'app/core/models/team';
import {
  NewTeamModalComponent,
} from 'app/modules/contractor/components/organization/new-team-modal/new-team-modal.component';

describe('NewTeamModalComponent', () => {
  let component: NewTeamModalComponent;
  let fixture: ComponentFixture<typeof component>;
  let activeModal: DfActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewTeamModalComponent,
      ],
      providers: [
        { provide: DfActiveModal, useFactory: () => mock(DfActiveModal) },
        FormBuilder
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTeamModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.get(DfActiveModal);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get initialized successfully', () => {
    fixture.detectChanges();

    expect(component.formGroup).not.toBeUndefined();
  });

  it('should submit data successfully', async(() => {
    const name = 'Test Name';
    fixture.detectChanges();

    component.data
      .subscribe((data: TeamStoreRequest) => expect(data.name).toBe(name));
    component.formGroup.setValue({ name });
    component.submit();
  }));

  it('should close the modal successfully', () => {
    spyOn(activeModal, 'close');
    component.close();

    expect(activeModal.close).toHaveBeenCalledWith(null);
  });
});
