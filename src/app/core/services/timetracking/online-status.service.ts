import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { OnlineStatus } from 'app/core/constants/timetracking/online-status';
import { OnlineText } from 'app/core/constants/timetracking/online-text';
import { Assignment } from 'app/core/models/assignment';
import { WorkDiary } from 'app/core/models/logbook';

@Injectable()
export class OnlineStatusService {
  public getWorkDiary(
    assignment: Assignment,
    workDiaries: WorkDiary[]
  ): WorkDiary | undefined {
    return workDiaries.find(workDiary => {
      const candidateId = assignment.candidate !== undefined ?
        assignment.candidate.id : assignment.selection.marketplaceMember.application.candidate.id;
      return workDiary.candidateId === candidateId;
    });
  }

  public getLastOnlineAgo(workDiary: WorkDiary): number {
    const timeDiff = moment().valueOf() - moment(workDiary.date).valueOf();
    const hourInMillisseconds = 60000;
    return timeDiff / hourInMillisseconds;
  }

  public getWorkDiaryOnlineStatusClass(workDiary: WorkDiary): string {
    const onlineTime = this.getLastOnlineAgo(workDiary);
    return OnlineStatus.filter(status => status.condition(onlineTime))[0].cssClass;
  }

  public getWorkDiaryOnlineStatusText(workDiary: WorkDiary): string {
    const onlineTime = this.getLastOnlineAgo(workDiary);
    return OnlineText.filter(type => type.condition(onlineTime))[0].content(onlineTime);
  }
}
