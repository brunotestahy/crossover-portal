import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfActiveModal } from '@devfactory/ngx-df';
import { mock } from 'ts-mockito';

import {
  JobDescriptionModalComponent,
} from 'app/modules/job-dashboard/components/job-description-modal/job-description-modal.component';
import { EscapeHtmlPipe } from 'app/shared/pipes/keep-html.pipe';

describe('JobDescriptionModalComponent', () => {
  let component: JobDescriptionModalComponent;
  let fixture: ComponentFixture<typeof component>;
  let dfActiveModal: DfActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        EscapeHtmlPipe,
        JobDescriptionModalComponent,
      ],
      imports: [
      ],
      providers: [
        { provide: DfActiveModal, useFactory: () => mock(DfActiveModal) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDescriptionModalComponent);
    component = fixture.componentInstance;
    dfActiveModal = TestBed.get(DfActiveModal);
  });

  it('should be created successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should be initialized successfully', () => {
    const sampleData = Object.assign({});
    dfActiveModal.data = sampleData;

    fixture.detectChanges();

    expect(component.job).toBe(sampleData);
  });

  it('should close the modal successfully', () => {
    spyOn(dfActiveModal, 'close');
    component.close();

    expect(dfActiveModal.close).toHaveBeenCalledWith();
  });
});
