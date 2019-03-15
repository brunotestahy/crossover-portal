import { Component, Input, OnChanges } from '@angular/core';
import { DfBarChartItem, DfChartMargins } from '@devfactory/ngx-df';
import { format } from 'date-fns';
import * as moment from 'moment';

import { COLORS } from 'app/core/constants/colors';
import { TrackingTimesheet } from 'app/core/models/time-tracking/tracking-timesheet.model';

@Component({
  selector: 'app-time-logged-week',
  templateUrl: './time-logged-week.component.html',
  styleUrls: ['./time-logged-week.component.scss'],
})
export class TimeLoggedWeekComponent implements OnChanges {

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
    left: 50,
  };

  public totalHours = 0;
  public printableTime = '';
  public timeLoggedMessage = '';

  @Input()
  public weeklyTimesheets: TrackingTimesheet[];
  @Input()
  public isLoading: boolean;

  constructor() {}

  public tickFormatter = (value: number) => value + 'h';

  public ngOnChanges(): void {
    /* istanbul ignore else */
    if (this.weeklyTimesheets) {
      this.data = this.setupData();
      this.totalHours = Number(this.weeklyTimesheets[0].hourWorked);
      this.printableTime = this.weeklyTimesheets[0].printableTime;
      if (moment.utc(this.weeklyTimesheets[0].weekStartDate).isSame(
        moment.utc(new Date()).startOf('isoWeek'),
        'date'
      )) {
        this.timeLoggedMessage = 'logged so far this week';
      } else {
        this.timeLoggedMessage = 'logged in the week';
      }
    }
  }

  private setupData(): DfBarChartItem[] {
    return this.weeklyTimesheets[0].stats.map(stat => {
      return {
        xKey: format(stat.date, 'ddd'),
        yKey: Number(stat.hours),
      };
    });
  }
}
