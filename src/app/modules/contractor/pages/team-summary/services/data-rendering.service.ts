import { Injectable } from '@angular/core';
import { format } from 'date-fns';

import * as GridTrends from 'app/core/constants/team-summary/grid-trends';
import * as SummaryLevels from 'app/core/constants/team-summary/summary-levels';
import { Assignment } from 'app/core/models/assignment';
import { AssignmentSummary } from 'app/core/models/productivity';
import { TeamSummaryComponent } from 'app/modules/contractor/pages/team-summary/team-summary.component';

@Injectable()
export class DataRenderingService {
  public getInactiveMessage(item: Partial<AssignmentSummary>): string | undefined {
    if (!item.active) {
      const formatDate = 'MMMM, D YYYY';
      return `This person left the team on ${format(item.effectiveDateEnd as string, formatDate)}`;
    }
    return;
  }

  public getScoreClass(value: number, maxValue: number): string {
    const types = Object.keys(SummaryLevels)
      .map(key => SummaryLevels[key as keyof typeof SummaryLevels]);
    return types.filter(entry => entry.threshold(value, maxValue))[0].cssClass;
  }

  public getTrendClass(value: number, maxValue: number): { cssClass: string, barColor: string } {
    const types = Object.keys(GridTrends)
      .map(key => GridTrends[key as keyof typeof GridTrends]);
    return types.filter(entry => entry.threshold(value, maxValue))[0];
  }

  public getOnlineStatusClass(instance: TeamSummaryComponent, assignment: Assignment): string {
    const workDiary = instance.onlineStatusService.getWorkDiary(assignment, instance.workDiaries);
    return workDiary ? instance.onlineStatusService.getWorkDiaryOnlineStatusClass(workDiary) : '';
  }
}
