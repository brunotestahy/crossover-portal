import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnChanges } from '@angular/core';
import { DfBarChartItem, DfChartAlignment, DfChartMargins } from '@devfactory/ngx-df';
import { format } from 'date-fns';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { RESPONSIVE_BREAKPOINT } from 'app/core/constants/breakpoint';
import { COLORS } from 'app/core/constants/colors';
import { TrackingTimesheet } from 'app/core/models/time-tracking/index';

@Component({
  selector: 'app-time-logged',
  templateUrl: './time-logged.component.html',
  styleUrls: ['./time-logged.component.scss'],
})
export class TimeLoggedComponent implements OnChanges {

  private destroy$ = new Subject();

  @Input()
  public timesheets: TrackingTimesheet[];

  public data: DfBarChartItem[];

  public colors: string[] = [
    COLORS.blue,
    COLORS.blue,
    COLORS.blue,
    COLORS.blue,
  ];

  public margins: DfChartMargins = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 60,
  };

  public isLoading = false;

  public horizontalAlignment = DfChartAlignment.Horizontal;

  constructor(private breakpointObserver: BreakpointObserver) {}

  public tickFormatter = (value: number) => value + 'h';

  public ngOnChanges(): void {
    /* istanbul ignore else */
    if (this.timesheets) {
      this.breakpointObserver.observe(RESPONSIVE_BREAKPOINT)
      .pipe(takeUntil(this.destroy$))
      .subscribe(responsive => {
        if (responsive.matches) {
          this.margins = {
            top: 20,
            right: 20,
            bottom: 60,
            left: 60,
          };
          this.data = this.setupDataResponsive();
        } else {
          this.margins = {
            top: 20,
            right: 20,
            bottom: 60,
            left: 115,
          };
          this.data = this.setupData();
        }
      });
    }
  }

  public getFourWeeksTitle(): string {
    const fourWeeksStartDate = `${format(this.timesheets[3].weekStartDate.toDateString(), 'MMMM Do')}`;
    const fourWeeksEndDate = `${format(this.timesheets[0].weekEndDate.toDateString(), 'MMMM Do')}`;
    return `${fourWeeksStartDate} - ${fourWeeksEndDate}`;
  }

  private setupDataResponsive(): DfBarChartItem[] {
    return this.timesheets.map(timesheet => (
      {
        xKey: format(timesheet.weekStartDate.toDateString(), 'MMM DD'),
        yKey: Number(timesheet.hourWorked),
      })
    );
  }

  private setupData(): DfBarChartItem[] {
    return this.timesheets.map(timesheet => (
      {
        xKey: `${format(timesheet.weekStartDate.toDateString(), 'MMM DD')} - ${format(timesheet.weekEndDate.toDateString(), 'MMM DD')}`,
        yKey: Number(timesheet.hourWorked),
      })
    );
  }
}
