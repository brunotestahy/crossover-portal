import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AcceptInterviewComponent } from './pages/accept-interview/accept-interview.component';
import { InterviewResponseComponent } from './pages/interview-response/interview-response.component';
import {
  InterviewVideoConferenceManagerPageComponent,
} from './pages/interview-video-conference-manager-page/interview-video-conference-manager-page.component';
import { InterviewVideoConferencePageComponent } from './pages/interview-video-conference-page/interview-video-conference-page.component';
import { ScheduleInterviewPageComponent } from './pages/schedule-interview-page/schedule-interview-page.component';
import { ViewInterviewComponent } from './pages/view-interview/view-interview.component';

const routes: Routes = [
  {
    path: ':id',
    children: [
      {
        path: 'view',
        component: ViewInterviewComponent,
      },
      {
        path: 'accept',
        component: AcceptInterviewComponent,
      },
      {
        path: 'schedule',
        component: ScheduleInterviewPageComponent,
      },
      {
        path: 'response',
        component: InterviewResponseComponent,
      },
      {
        path: 'video-conference',
        component: InterviewVideoConferencePageComponent,
      },
      {
        path: 'video-conference-manager',
        component: InterviewVideoConferenceManagerPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewRoutingModule { }
