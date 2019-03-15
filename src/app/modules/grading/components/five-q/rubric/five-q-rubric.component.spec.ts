import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito/lib/ts-mockito';

import { HireService } from 'app/core/services/hire/hire.service';
import { FIVEQ_JOB_MOCK, NON_FIVEQ_JOB_MOCK } from 'app/core/services/mocks/jobs.mock';
import { FiveQRubricComponent } from 'app/modules/grading/components/five-q/rubric/five-q-rubric.component';

describe('FiveQRubricComponent', () => {
  let component: FiveQRubricComponent;
  let fixture: ComponentFixture<FiveQRubricComponent>;
  let hireService: HireService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FiveQRubricComponent,
      ],
      providers: [
        { provide: HireService, useFactory: () => mock(HireService) },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { pipelineId: '123' } } } },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiveQRubricComponent);
    component = fixture.componentInstance;
    hireService = TestBed.get(HireService);
  });

  it('should be created', () => expect(component).toBeTruthy());

  it('should load 5Q rubric when there is any', () => {
    spyOn(hireService, 'getJob').and.returnValue(of(FIVEQ_JOB_MOCK));
    fixture.detectChanges();
    expect(component.questions && component.questions.length).toBe(6);
  });

  it('should load page when there is not any rubric', () => {
    spyOn(hireService, 'getJob').and.returnValue(of(NON_FIVEQ_JOB_MOCK));
    fixture.detectChanges();
    expect(component.questions && component.questions.length).toBe(0);
  });
});
