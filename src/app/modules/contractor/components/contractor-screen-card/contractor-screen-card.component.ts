import { Component, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';

import { Assignment } from 'app/core/models/assignment';
import { WorkDiary } from 'app/core/models/logbook';
import { OnlineStatusService } from 'app/core/services/timetracking/online-status.service';
import * as moment from 'moment';

@Component({
  selector: 'app-contractor-screen-card',
  templateUrl: './contractor-screen-card.component.html',
  styleUrls: ['./contractor-screen-card.component.scss'],
})
export class ContractorScreenCardComponent implements OnInit {

  @Input()
  public assignment: Assignment;

  @Input()
  public workDiaries: WorkDiary[];

  @Input()
  public screenTime: string;

  public workDiary: WorkDiary | undefined;

  constructor(private onlineStatusService: OnlineStatusService) {}

  public ngOnInit(): void {
    this.workDiary = this.onlineStatusService.getWorkDiary(this.assignment, this.workDiaries);
  }

  public getOnlineStatusClass(): string {
    return this.workDiary ? this.onlineStatusService.getWorkDiaryOnlineStatusClass(this.workDiary) : '';
  }

  public getWorkDiaryTime(): string {
    if (this.workDiary) {
      return format(moment(this.workDiary.date).toDate(), 'HH:mm a');
    }
    return '';
  }
}
