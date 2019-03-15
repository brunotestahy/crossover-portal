import { TestBed } from '@angular/core/testing';
import { mock } from 'ts-mockito/lib/ts-mockito';

import { MappedActivityInfo } from 'app/core/models/productivity';
import { ActivityInfoMapService } from 'app/core/services/productivity/activity-info-map.service';
import { TopBottomPerformerCalculatorService } from 'app/core/services/productivity/top-bottom-performer-calculator.service';

describe('ActivityInfoMapService', () => {
  let service: ActivityInfoMapService;
  let topBottomPerformerCalculatorService: TopBottomPerformerCalculatorService;

  beforeEach(
    () => TestBed.configureTestingModule({
      imports: [],
      providers: [
        ActivityInfoMapService,
        { provide: TopBottomPerformerCalculatorService, useFactory: () => mock(TopBottomPerformerCalculatorService)  },
      ],
    })
    .compileComponents()
    .then(() => {
      service = TestBed.get(ActivityInfoMapService);
      topBottomPerformerCalculatorService = TestBed.get(TopBottomPerformerCalculatorService);
    })
  );

  it('should return an unknown value when assignment pre-conditions are not fulfilled', () => {
    const summary = Object.assign({ assignment: true });
    const metricStats = 0;

    spyOn(topBottomPerformerCalculatorService, 'calculateAverages').and.returnValue({ metricStats });
    spyOn(topBottomPerformerCalculatorService, 'areWeeksCovered').and.returnValue(false);

    const data = service.map(summary);

    expect(data).toBe(null);
  });

  it('should calculate the metric changes the assignment has metrics available for the last eight weeks', () => {
    const summary = Object.assign({ assignment: true });
    const calculateAverages = { metricsStats: 10, previousMetricStats: 5 };

    spyOn(topBottomPerformerCalculatorService, 'calculateAverages').and.returnValue(calculateAverages);
    spyOn(topBottomPerformerCalculatorService, 'areWeeksCovered').and.returnValue(true);

    const data = service.map(summary) as MappedActivityInfo;

    expect(data.metricsChange).toBe(1);
  });

  it('should not calculate the metric changes the assignment does not have metrics available for the last eight weeks', () => {
    const summary = Object.assign({ assignment: true });
    const calculateAverages = { metricsStats: 10, previousMetricStats: 5 };

    spyOn(topBottomPerformerCalculatorService, 'calculateAverages').and.returnValue(calculateAverages);
    spyOn(topBottomPerformerCalculatorService, 'areWeeksCovered').and.callFake(
      (_summary: {}, rangeStart: number, rangeEnd: number) => rangeStart === 1 && rangeEnd === 5
    );

    const data = service.map(summary) as MappedActivityInfo;

    expect(data.metricsChange).toBe(undefined);
  });
});
