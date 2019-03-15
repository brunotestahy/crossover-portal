import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-schedule-interview-page',
  templateUrl: './schedule-interview-page.component.html',
  styleUrls: ['./schedule-interview-page.component.scss'],
})
export class ScheduleInterviewPageComponent {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';
}
