import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { endOfWeek, startOfToday, subWeeks } from 'date-fns';
import { tap } from 'rxjs/operators';

import { ProductivitySummaryWithMappedActivities } from 'app/core/models/productivity';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';

@Component({
  selector: 'app-team-summary-selector',
  templateUrl: './team-summary-selector.component.html',
  styleUrls: ['./team-summary-selector.component.scss'],
})
export class TeamSummarySelectorComponent implements OnInit {
  public isLoading = false;
  public error = '';

  public summaries = [] as ProductivitySummaryWithMappedActivities[];
  public endDate: Date;

  @Output()
  public teamSelect: EventEmitter<number> = new EventEmitter();

  constructor(
    private productivityService: ProductivityService
  ) {
  }

  public ngOnInit(): void {
    const startOfIsoWeek = { weekStartsOn: 1 };
    const lastWeek = subWeeks(startOfToday(), 1);

    this.endDate = endOfWeek(lastWeek, startOfIsoWeek);
    this.error = '';
    this.isLoading = true;

    this.productivityService
      .getOverallPerformers()
      .pipe (
        tap(
          summaries => {
            if (summaries.length === 0) {
              this.error = 'Sorry, you have no teams reporting to you.';
            }
          }
        )
      )
      .subscribe(
        summaries => {
          this.summaries = summaries;
          this.isLoading = false;
        },
        () => {
          this.error = 'An unknown error happened while retrieving teams summary data.';
          this.isLoading = false;
        });
  }

  public onTeamSelect(teamId: number): void {
    this.teamSelect.emit(teamId);
  }
}
