import { Injectable } from '@angular/core';

import { AssignmentSummary, MappedActivityInfo } from 'app/core/models/productivity';
import { TopBottomPerformerCalculatorService } from 'app/core/services/productivity/top-bottom-performer-calculator.service';

@Injectable()
export class ActivityInfoMapService {
  constructor(
    private topBottomPerformerCalculator: TopBottomPerformerCalculatorService
  ) {
  }

  public map(summary: AssignmentSummary): MappedActivityInfo | null {
    const calculatedAverages = this.topBottomPerformerCalculator.calculateAverages(summary);
    const hasWorkedFourHours = this.topBottomPerformerCalculator.areWeeksCovered(summary, 1, 5);
    const hasWorkedEightHours = hasWorkedFourHours && this.topBottomPerformerCalculator.areWeeksCovered(summary, 5, 9);
    if (!summary.assignment || !hasWorkedFourHours || calculatedAverages.metricsStats === 0) {
      return null;
    }
    const mappedActivityInfo = {
      ...summary,
      calculatedAverages,
      metricsChange: undefined,
    } as MappedActivityInfo;
    if (
      [calculatedAverages.metricsStats, calculatedAverages.previousMetricStats].indexOf(0) === -1 &&
      hasWorkedEightHours
    ) {
      mappedActivityInfo.metricsChange =
        calculatedAverages.metricsStats / calculatedAverages.previousMetricStats - 1;
    }
    return mappedActivityInfo;
  }
}
