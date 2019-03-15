import { MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HireService } from 'app/core/services/hire/hire.service';
import { SOURCING_DETAIL_MOCK } from 'app/core/services/mocks/sourcing-detail.mock';
import {
  PipelineSourcingDetailsComponent,
} from 'app/modules/pipeline-sourcing/pages/pipeline-sourcing-details/pipeline-sourcing-details.component';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito/lib/ts-mockito';

describe('PipelineSourcingDetailsComponent', () => {
  let component: PipelineSourcingDetailsComponent;
  let fixture: ComponentFixture<PipelineSourcingDetailsComponent>;
  let hireService: HireService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PipelineSourcingDetailsComponent],
      imports: [RouterTestingModule],
      providers: [
        MediaMatcher,
        Platform,
        { provide: HireService, useFactory: () => mock(HireService) },
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ id: 123 }),
            snapshot: {
              queryParams: { action: ''},
            },
          },
        }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineSourcingDetailsComponent);

    component = fixture.componentInstance;
    hireService = TestBed.get(HireService);
    hireService.getJobSourcingDetails = () => Observable.of(SOURCING_DETAIL_MOCK);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load campaign statistics for job', () => {
    fixture.detectChanges();

    expect(component.sourcingDetails.applicationsCount).toBe(76);
    expect(component.sourcingDetails.applicationsCountDay).toBe(0);
    expect(component.sourcingDetails.applicationsCountWeek).toBe(1);
    expect(Math.round(component.sourcingDetails.avgResumeScore)).toBe(10);
    expect(component.sourcingDetails.avgResumeScoreDay).toBe(0);
    expect(component.sourcingDetails.avgResumeScoreWeek).toBe(0);
    expect(component.campaignMostApplicants !== null).toBe(true);
    expect(component.campaignLeastApplicants !== null).toBe(true);
    expect(component.campaignBestScore !== null).toBe(true);
    expect(component.campaignLowestScore !== null).toBe(true);
    expect(component.gridTotal).toBe(51);
    expect(component.gridTotalDay).toBe(0);
    expect(component.gridTotalWeek).toBe(0);
    expect(Math.round(component.gridAverage)).toBe(15);
    expect(component.gridAverageDay).toBe(0);
    expect(component.gridAverageWeek).toBe(0);

  });

  it('should show error when loading statistics fails', () => {
    spyOn(hireService, 'getJobSourcingDetails').and.returnValue(Observable.throw(new Error()));
    fixture.detectChanges();
    expect(component.error !== '').toBe(true);
  });
});
