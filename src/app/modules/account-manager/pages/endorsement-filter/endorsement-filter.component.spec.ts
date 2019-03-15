import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { DfActiveModal } from '@devfactory/ngx-df';
import { mock } from 'ts-mockito';

import { TECH_JOB_DETAIL_TESTS_MOCK } from 'app/core/services/mocks/hire.mock';
import { EndorsementFilterComponent } from 'app/modules/account-manager/pages/endorsement-filter/endorsement-filter.component';

describe('EndorsementFilterComponent', () => {
  let component: EndorsementFilterComponent;
  let fixture: ComponentFixture<EndorsementFilterComponent>;

  let activeModalService: DfActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EndorsementFilterComponent,
      ],
      providers: [
        { provide: DfActiveModal, useFactory: () => mock(DfActiveModal) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsementFilterComponent);
    component = fixture.componentInstance;

    activeModalService = TestBed.get(DfActiveModal);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load all the form inputs when the modal is opened with score filters and preview', () => {
    const formObject = Object.assign({
      previewToHM: true,
      scoreFilters: [
        {
          fields: {
            max: 'q1Min',
            min: 'q1Max',
          },
        },
      ],
    });
    activeModalService.data = [TECH_JOB_DETAIL_TESTS_MOCK, formObject];

    fixture.detectChanges();

    expect(component.scoreFields.length).toBe(9);
    expect(component.form.value.previewToHM).toBe(component.previewItems[0]);
  });

  it('should load all the form inputs when the modal is opened with overall score', () => {
    const formObject = Object.assign({
      overallResumeGradeMin: 11,
      previewToHM: false,
    });
    activeModalService.data = [TECH_JOB_DETAIL_TESTS_MOCK, formObject];
    component.form.addControl(
      'overallResumeGradeMin',
      new FormControl()
    );

    fixture.detectChanges();

    expect(component.scoreFields.length).toBe(9);
    expect(component.form.value.overallResumeGradeMin).toBe(formObject.overallResumeGradeMin);
    expect(component.form.value.previewToHM).toBe(component.previewItems[1]);
  });

  it('should do nothing when the modal without initial score data', () => {
    activeModalService.data = [TECH_JOB_DETAIL_TESTS_MOCK, {}];

    fixture.detectChanges();

    expect(component.scoreFields.length).toBe(9);
  });

  it('should save the data and close the modal when the form is submitted with previews', () => {
    component.form.patchValue({
      previewToHM: component.previewItems[0],
    });
    component.scoreFields = [
      {
        name: 'Q1',
        type: 'QUESTION_SCORE',
        sequenceNumber: 1,
        fields: {
          min: 'q1Min',
          max: 'q1Max',
        },
        scoreMax: undefined,
        scoreMin: undefined,
      },
      {
        name: '5Q Total',
        type: 'TEST_SCORE',
        testType: 'FIVEQ',
        fields: undefined,
        scoreMax: undefined,
        scoreMin: undefined,
      },
    ];
    component.scoreFilters.addControl('q1Max', new FormControl(12));
    component.scoreFilters.addControl('q1Min', new FormControl(2));
    component.form.addControl('overallResumeGradeMin', new FormControl(null));
    spyOn(activeModalService, 'close').and.returnValue('');

    component.submit();

    expect(activeModalService.close).toHaveBeenCalled();
  });

  it('should save the data and close the modal when the form is submitted without previews', () => {
    component.form.patchValue({
      previewToHM: component.previewItems[1],
    });
    component.scoreFields = [
      {
        name: 'Q1',
        type: 'QUESTION_SCORE',
        sequenceNumber: 1,
        fields: {
          min: 'q1Min',
          max: 'q1Max',
        },
        scoreMax: undefined,
        scoreMin: undefined,
      },
      {
        name: '5Q Total',
        type: 'TEST_SCORE',
        testType: 'FIVEQ',
        fields: undefined,
        scoreMax: undefined,
        scoreMin: undefined,
      },
    ];
    component.scoreFilters.addControl('q1Max', new FormControl(12));
    component.scoreFilters.addControl('q1Min', new FormControl(2));
    component.form.addControl('overallResumeGradeMin', new FormControl());
    spyOn(activeModalService, 'close').and.returnValue('');

    component.submit();

    expect(activeModalService.close).toHaveBeenCalled();
  });

  it('should save the data and close the modal when the form is submitted', () => {
    component.form.patchValue({
      previewToHM: component.previewItems[2],
    });
    component.form.removeControl('scoreFilters');
    component.form.addControl('scoreFilters', new FormControl(null));
    component.form.addControl('overallResumeGradeMin', new FormControl());
    spyOn(activeModalService, 'close').and.returnValue('');

    component.submit();

    expect(activeModalService.close).toHaveBeenCalled();
  });

  it('should save the data and close the modal when the form is submitted with a null preview', () => {
    component.scoreFilters.addControl('q1Max', new FormControl());
    component.scoreFilters.addControl('q1Min', new FormControl());
    component.form.addControl('overallResumeGradeMin', new FormControl());
    component.form.addControl('scoreFilters', component.scoreFilters);
    spyOn(activeModalService, 'close').and.returnValue('');

    component.submit();

    expect(activeModalService.close).toHaveBeenCalled();
  });

  it('should close the modal successfully when the Close button is clicked', () => {
    spyOn(activeModalService, 'close').and.returnValue('');

    component.close();

    expect(activeModalService.close).toHaveBeenCalledWith();
  });

  it('should reset the form when the Clear button is clicked', () => {
    component.previewToggle = Object.assign({ selectItem: () => {} });
    spyOn(component.previewToggle, 'selectItem').and.returnValue('');
    spyOn(component.form, 'reset').and.returnValue('');

    component.clear();

    expect(component.previewToggle.selectItem).toHaveBeenCalledWith(component.previewItems[2]);
    expect(component.form.reset).toHaveBeenCalledWith({
      applicationStatus: component.applicationStatusModels[0].value,
    });
  });
});
