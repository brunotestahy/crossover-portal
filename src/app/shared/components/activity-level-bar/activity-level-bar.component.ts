import { Component, Input, OnInit } from '@angular/core';

import { WorkDiaryWithFlags } from 'app/core/models/logbook';

@Component({
  selector: 'app-activity-level-bar',
  templateUrl: './activity-level-bar.component.html',
  styleUrls: ['./activity-level-bar.component.scss'],
})
export class ActivityLevelBarComponent implements OnInit {

  @Input()
  public workDiary: WorkDiaryWithFlags;

  public ngOnInit(): void {}

  public hasLowActivity(diary: WorkDiaryWithFlags): boolean {
    return !diary.isMeeting && diary.intensityScore <= 10;
  }

  public hasNormalActivity(diary: WorkDiaryWithFlags): boolean {
    return !diary.isMeeting && diary.intensityScore > 10;
  }

  public isMeetingTime(diary: WorkDiaryWithFlags): boolean {
    return diary.isMeeting;
  }

  public getIntensityScore(diary: WorkDiaryWithFlags): string {
    return (diary.isMeeting ? '100' : diary.intensityScore) + '%';
  }
}
