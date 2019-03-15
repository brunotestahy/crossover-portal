import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { ScheduleInterviewComponent } from './components/schedule-interview/schedule-interview.component';
import { InterviewRoutingModule } from './interview-routing.module';
import { AcceptInterviewComponent } from './pages/accept-interview/accept-interview.component';
import { InterviewResponseComponent } from './pages/interview-response/interview-response.component';
import {
  InterviewVideoConferenceManagerPageComponent,
} from './pages/interview-video-conference-manager-page/interview-video-conference-manager-page.component';
import { InterviewVideoConferencePageComponent } from './pages/interview-video-conference-page/interview-video-conference-page.component';
import { ScheduleInterviewPageComponent } from './pages/schedule-interview-page/schedule-interview-page.component';
import { VideoConferenceComponent } from './pages/video-conference/video-conference.component';
import { ViewInterviewComponent } from './pages/view-interview/view-interview.component';

@NgModule({
  imports: [SharedModule, InterviewRoutingModule],
  declarations: [
    ViewInterviewComponent,
    AcceptInterviewComponent,
    ScheduleInterviewComponent,
    ScheduleInterviewPageComponent,
    InterviewResponseComponent,
    VideoConferenceComponent,
    InterviewVideoConferencePageComponent,
    InterviewVideoConferenceManagerPageComponent,
  ],
})
export class InterviewModule {}
