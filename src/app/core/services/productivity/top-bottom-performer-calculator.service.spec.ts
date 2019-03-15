import { TestBed } from '@angular/core/testing';

import { TopBottomPerformerCalculatorService } from 'app/core/services/productivity/top-bottom-performer-calculator.service';

describe('ActivityInfoMapService', () => {
  let service: TopBottomPerformerCalculatorService;

  beforeEach(
    () => TestBed.configureTestingModule({
      imports: [],
      providers: [
        TopBottomPerformerCalculatorService,
      ],
    })
    .compileComponents()
    .then(() => {
      service = TestBed.get(TopBottomPerformerCalculatorService);
    })
  );

  it('should calculate the averages properly', () => {
    const summary = Object.assign({
      metricsStats: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      focusScores: [3, 3, 3, 3, 3],
      intensityScores: [4, 4, 4, 4, 4],
      recordedHours: [40, 50, 40, 50, 40],
    });

    const averages = service.calculateAverages(summary);

    expect(averages.previousMetricStats).toBe(1);
    expect(averages.activityMetrics).toBe(0);
    expect(averages.focusScores).toBe(3);
    expect(averages.intensityScores).toBe(4);
    expect(averages.recordedHours).toBe(45);
  });

  it('should check if the provided week range is covered successfully', () => {
    const summary = Object.assign({
      recordedHours: [40, 50, 0, 50, 40],
    });

    const isCovered = service.areWeeksCovered(summary, 1, 5);

    expect(isCovered).toBe(false);
  });
});
