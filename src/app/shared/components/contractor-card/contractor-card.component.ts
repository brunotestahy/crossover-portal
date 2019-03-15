import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { Assignment } from 'app/core/models/assignment';
import { WorkDiary } from 'app/core/models/logbook';
import { Timezone } from 'app/core/models/timezone';
import { OnlineStatusService } from 'app/core/services/timetracking/online-status.service';

@Component({
  selector: 'app-contractor-card',
  templateUrl: './contractor-card.component.html',
  styleUrls: ['./contractor-card.component.scss'],
})
export class ContractorCardComponent implements OnInit {
  @HostBinding('class')
  public classes = 'd-flex flex-column';

  @Input()
  public assignment: Assignment;

  @Input()
  public manager: string = '';

  @Input()
  public workDiaries = [] as WorkDiary[];

  public lastOnlineText = '';
  public lastOnlineClass = '';

  constructor(
    private onlineStatusService: OnlineStatusService
  ) {
  }

  public ngOnInit(): void {
    const workDiary = this.onlineStatusService.getWorkDiary(this.assignment, this.workDiaries);
    if (workDiary) {
      this.lastOnlineText = this.onlineStatusService.getWorkDiaryOnlineStatusText(workDiary);
      this.lastOnlineClass = this.onlineStatusService.getWorkDiaryOnlineStatusClass(workDiary);
    }
  }

  public getContractorTime(timezone: Timezone): Date {
    return this.getUTC(timezone.offset);
  }

  public getUTC(offset: number): Date {
    const date = new Date();
    const minuteInMilliseconds = 60 * 1000;

    offset += date.getTimezoneOffset() * minuteInMilliseconds;

    const time = date.getTime() + offset;
    return new Date(time);
  }
}
