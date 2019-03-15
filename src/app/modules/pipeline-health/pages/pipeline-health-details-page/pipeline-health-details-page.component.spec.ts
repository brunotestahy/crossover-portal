import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { PIPELINE_HEALTH_DETAILS_MOCK } from 'app/core/services/mocks/pipeline-health.mock';
import { PipelineHealthService } from 'app/core/services/pipeline-health/pipeline-health.service';
import {
  PipelineHealthDetailsPageComponent,
} from 'app/modules/pipeline-health/pages/pipeline-health-details-page/pipeline-health-details-page.component';

describe('PipelineHealthDetailsPageComponent', () => {
  let component: PipelineHealthDetailsPageComponent;
  let fixture: ComponentFixture<PipelineHealthDetailsPageComponent>;
  let pipelineHealthService: PipelineHealthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PipelineHealthDetailsPageComponent],
      providers: [
        { provide: PipelineHealthService, useFactory: () => mock(PipelineHealthService) },
        { provide: ActivatedRoute, useValue: { params: of({ id: 1 }) } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineHealthDetailsPageComponent);
    component = fixture.componentInstance;
    pipelineHealthService = TestBed.get(PipelineHealthService);
  });

  it('check if the component has been created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] init job data', () => {
    spyOn(pipelineHealthService, 'getJobHealthDetail').and.returnValue(of(PIPELINE_HEALTH_DETAILS_MOCK));
    fixture.detectChanges();
    expect(component.isLoading).toBeFalsy();
    expect(component.total).toEqual(PIPELINE_HEALTH_DETAILS_MOCK.totalApplicants);
    expect(component.yearSalary).toEqual('$' + PIPELINE_HEALTH_DETAILS_MOCK.yearSalary + 'K / YEAR');
  });

  it('[ngOnInit] error getting pipeline details', () => {
    spyOn(pipelineHealthService, 'getJobHealthDetail').and.returnValue(Observable.throw({}));
    fixture.detectChanges();
    expect(component.error).toBe('Error loading pipeline details.');
  });
});
