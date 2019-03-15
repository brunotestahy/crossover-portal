import { Injectable } from '@angular/core';

import { AssignmentSummary, CalculatedAverages } from 'app/core/models/productivity';

@Injectable()
export class TopBottomPerformerCalculatorService {
  public calculatePropertyAverage(
    property: number[],
    rangeStart: number,
    rangeEnd: number
  ): number {
    const sumEntries = (property || [])
      .slice(rangeStart, rangeEnd)
      .reduce((carry, current) => carry + current, 0);
    return sumEntries / (rangeEnd - rangeStart);
  }

  public calculateAverages(summary: AssignmentSummary): CalculatedAverages {
    return {
      previousMetricStats: this.calculatePropertyAverage(summary.metricsStats, 5, 9),
      metricsStats: this.calculatePropertyAverage(summary.metricsStats, 1, 5),
      activityMetrics: this.calculatePropertyAverage(summary.activityMetrics, 1, 5),
      focusScores: this.calculatePropertyAverage(summary.focusScores, 1, 5),
      intensityScores: this.calculatePropertyAverage(summary.intensityScores, 1, 5),
      recordedHours: this.calculatePropertyAverage(summary.recordedHours, 1, 5),
    };
  }

  public areWeeksCovered(
    summary: AssignmentSummary,
    recordedHoursStart: number,
    recordedHoursEnd: number): boolean {
    const chunk = summary.recordedHours.slice(recordedHoursStart, recordedHoursEnd);
    return chunk.reduce((carry, current) => carry && current !== 0, true);
  }
}
