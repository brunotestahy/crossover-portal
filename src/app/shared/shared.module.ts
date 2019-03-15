import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  DfAccordionModule,
  DfAlertModule,
  DfBadgeModule,
  DfBarModule,
  DfBubbleWizardModule,
  DfButtonModule,
  DfCardModule,
  DfCheckboxModule,
  DfCoreModule,
  DfDatepickerModule,
  DfDonutModule,
  DfExportXLSXModule,
  DfFileUploadModule,
  DfGridModule,
  DfGroupToggleModule,
  DfIconModule,
  DfInputModule,
  DfLabelModule,
  DfLegendModule,
  DfLineModule,
  DfListPanelModule,
  DfLoadingSpinnerModule,
  DfModalModule,
  DfPieModule,
  DfPortalModule,
  DfProgressBarModule,
  DfRadioInputModule,
  DfSelectModule,
  DfSliderModule,
  DfSlideToggleModule,
  DfStarRatingModule,
  DfTablePaginatorModule,
  DfTabsModule,
  DfTimePickerModule,
  DfToolTipModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'angular-calendar';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { RecaptchaModule } from 'ng-recaptcha/recaptcha/recaptcha.module';
import { DndModule } from 'ng2-dnd';
import { DateFnsModule } from 'ngx-date-fns';
import { ImageCropperModule } from 'ngx-img-cropper';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MomentModule } from 'ngx-moment';

import { EndorsementCommentsComponent } from 'app/modules/account-manager/pages/endorsement-comments/endorsement-comments.component';
import { EndorsementFilterComponent } from 'app/modules/account-manager/pages/endorsement-filter/endorsement-filter.component';
import { EndorsementNotesComponent } from 'app/modules/account-manager/pages/endorsement-notes/endorsement-notes.component';
import { HireAddRoleModalComponent } from 'app/modules/contractor/components/hire-add-role-modal/hire-add-role-modal.component';
import { NewTeamModalComponent } from 'app/modules/contractor/components/organization/new-team-modal/new-team-modal.component';
import { ReportsActivityModalComponent } from 'app/modules/contractor/components/reports-activity-modal/reports-activity-modal.component';
import {
  PaymentsReportsDownloadModalComponent
} from 'app/modules/enforcer/components/payments-reports-download-modal/payments-reports-download-modal.component';
import { JobDescriptionModalComponent } from 'app/modules/job-dashboard/components/job-description-modal/job-description-modal.component';
import { ChangeEmailModalComponent } from 'app/modules/settings/components/change-email-modal/change-email-modal.component';
import { ActivityLevelBarComponent } from 'app/shared/components/activity-level-bar/activity-level-bar.component';
import { AvailabilityFormComponent } from 'app/shared/components/availability-form/availability-form.component';
import { CertificationFormComponent } from 'app/shared/components/certification-form/certification-form.component';
import { CertificationListComponent } from 'app/shared/components/certification-list/certification-list.component';
import { ChangeAvatarComponent } from 'app/shared/components/change-avatar/change-avatar.component';
import { ChangeContractorAvatarComponent } from 'app/shared/components/change-contractor-avatar/change-contractor-avatar.component';
import { ContractorCardComponent } from 'app/shared/components/contractor-card/contractor-card.component';
import { ContractorDashboardBarComponent } from 'app/shared/components/contractor-dashboard-bar/contractor-dashboard-bar.component';
import { CookieAlertComponent } from 'app/shared/components/cookie-alert/cookie-alert.component';
import { CookiePreferencesFormComponent } from 'app/shared/components/cookie-preferences-form/cookie-preferences-form.component';
import { CookiePreferencesModalComponent } from 'app/shared/components/cookie-preferences-modal/cookie-preferences-modal.component';
import { CountdownComponent } from 'app/shared/components/countdown/countdown.component';
import { DeleteTimecardsModalComponent } from 'app/shared/components/delete-timecards-modal/delete-timecards-modal.component';
import { EducationFormComponent } from 'app/shared/components/education-form/education-form.component';
import { EducationListComponent } from 'app/shared/components/education-list/education-list.component';
import { EndContractComponent } from 'app/shared/components/end-contract/end-contract.component';
import { HeadlineFormComponent } from 'app/shared/components/headline-form/headline-form.component';
import { InterviewMapComponent } from 'app/shared/components/interview-map/interview-map.component';
import { LanguageFormComponent } from 'app/shared/components/language-form/language-form.component';
import { LanguageListComponent } from 'app/shared/components/language-list/language-list.component';
import { LinkedinFormComponent } from 'app/shared/components/linkedin-form/linkedin-form.component';
import { LocationFormComponent } from 'app/shared/components/location-form/location-form.component';
import { LogbookScreenshotViewerComponent } from 'app/shared/components/logbook-screenshot-viewer/logbook-screenshot-viewer.component';
import { LogbookComponent } from 'app/shared/components/logbook/logbook.component';
import { MarkdownViewerComponent } from 'app/shared/components/markdown-viewer/markdown-viewer.component';
import { MyDashboardDatepickerComponent } from 'app/shared/components/my-dashboard-datepicker/my-dashboard-datepicker.component';
import { NameFormComponent } from 'app/shared/components/name-form/name-form.component';
import { NotificationBadgeComponent } from 'app/shared/components/notification-badge/notification-badge.component';
import { PageAlertComponent } from 'app/shared/components/page-alert/page-alert.component';
import { PageInfoComponent } from 'app/shared/components/page-info/page-info.component';
import { PageSuccessComponent } from 'app/shared/components/page-success/page-success.component';
import { PasswordStrengthComponent } from 'app/shared/components/password-strength/password-strength.component';
import { PhoneFormComponent } from 'app/shared/components/phone-form/phone-form.component';
import { PictureCardComponent } from 'app/shared/components/picture-card/picture-card.component';
import { PlaceholderBarChartComponent } from 'app/shared/components/placeholder-bar-chart/placeholder-bar-chart.component';
import { PlaceholderCardImageComponent } from 'app/shared/components/placeholder-card-image/placeholder-card-image.component';
import { PlaceholderTableComponent } from 'app/shared/components/placeholder-table/placeholder-table.component';
import { PositionsFormComponent } from 'app/shared/components/positions-form/positions-form.component';
import { PositionsListComponent } from 'app/shared/components/positions-list/positions-list.component';
import { ProfileImageSelectorComponent } from 'app/shared/components/profile-image-selector/profile-image-selector.component';
import { ResumeFormComponent } from 'app/shared/components/resume-form/resume-form.component';
import { ScheduleCalendarComponent } from 'app/shared/components/schedule-calendar/schedule-calendar.component';
import { SkillFormComponent } from 'app/shared/components/skill-form/skill-form.component';
import { SkillListComponent } from 'app/shared/components/skill-list/skill-list.component';
import { SkypeFormComponent } from 'app/shared/components/skype-form/skype-form.component';
import { SkypeModalComponent } from 'app/shared/components/skype-modal/skype-modal.component';
import { StandardModalComponent } from 'app/shared/components/standard-modal/standard-modal.component';
import { SummaryFormComponent } from 'app/shared/components/summary-form/summary-form.component';
import { TeamSelectorComponent } from 'app/shared/components/team-selector/team-selector.component';
import { TimeLoggedWeekComponent } from 'app/shared/components/time-logged-week/time-logged-week.component';
import { TimeLoggedComponent } from 'app/shared/components/time-logged/time-logged.component';
import { TimecardDetailsModalComponent } from 'app/shared/components/timecard-details-modal/timecard-details-modal.component';
import { TimecardsListViewComponent } from 'app/shared/components/timecards-list-view/timecards-list-view.component';
import { TimecardsNotIdleModalComponent } from 'app/shared/components/timecards-not-idle-modal/timecards-not-idle-modal.component';
import { TimezoneUpdateModalComponent } from 'app/shared/components/timezone-update-modal/timezone-update-modal.component';
import { TopActivitiesWeekComponent } from 'app/shared/components/top-activities-week/top-activities-week.component';
import { UserProfileComponent } from 'app/shared/components/user-profile/user-profile.component';
import { DurationFormatPipe } from 'app/shared/pipes/duration-format.pipe';
import { EnumToStringPipe } from 'app/shared/pipes/enum-to-string.pipe';
import { FormatHoursPipe } from 'app/shared/pipes/format-hours.pipe';
import { EscapeHtmlPipe } from 'app/shared/pipes/keep-html.pipe';
import { PropertyFilterPipe } from 'app/shared/pipes/property-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DfInputModule,
    DfButtonModule,
    DfBarModule,
    DfSelectModule,
    DfAlertModule,
    DfModalModule,
    DfCardModule,
    DfDatepickerModule,
    DfDonutModule,
    DfValidationMessagesModule,
    DfCheckboxModule,
    DfToolTipModule,
    DfFileUploadModule,
    DfBubbleWizardModule,
    DfBadgeModule,
    DfGridModule,
    DfGroupToggleModule,
    DfTablePaginatorModule,
    DfRadioInputModule,
    DfLabelModule,
    DfListPanelModule,
    DfPortalModule,
    DfProgressBarModule,
    DfStarRatingModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    DateFnsModule,
    InfiniteScrollModule,
    NgbPopoverModule,
    NgbTooltipModule,
    DfLoadingSpinnerModule,
    ImageCropperModule,
    CalendarModule,
    DfGroupToggleModule,
    DfLegendModule,
    DfTimePickerModule,
    DfPieModule,
    DfSliderModule,
    DfLineModule,
    DfExportXLSXModule,
    DfTabsModule,
    MomentModule,
    DfAccordionModule,
    NgbDropdownModule,
    DfCoreModule,
    DndModule,
    DfIconModule,
    DfAccordionModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DfInputModule,
    DfButtonModule,
    DfBarModule,
    DfSelectModule,
    DfAlertModule,
    DfModalModule,
    DfCardModule,
    DfDatepickerModule,
    DfDonutModule,
    DfLabelModule,
    DfValidationMessagesModule,
    DfCheckboxModule,
    DfSlideToggleModule,
    DfToolTipModule,
    DfFileUploadModule,
    DfBubbleWizardModule,
    DfBadgeModule,
    DfGridModule,
    DfGroupToggleModule,
    DfTablePaginatorModule,
    DfRadioInputModule,
    DfListPanelModule,
    DfPortalModule,
    DfLegendModule,
    DfSliderModule,
    DfExportXLSXModule,
    DfProgressBarModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    DateFnsModule,
    InfiniteScrollModule,
    NgbPopoverModule,
    NgbTooltipModule,
    CalendarModule,
    DfGroupToggleModule,
    DfTimePickerModule,
    DfStarRatingModule,
    MomentModule,
    DfPieModule,
    DfLineModule,
    DfTabsModule,
    DfAccordionModule,
    DfCoreModule,
    DndModule,
    DfIconModule,
    DfAccordionModule,
    // components
    MarkdownViewerComponent,
    PageAlertComponent,
    PageInfoComponent,
    PageSuccessComponent,
    PasswordStrengthComponent,
    ProfileImageSelectorComponent,
    ChangeEmailModalComponent,
    InterviewMapComponent,
    EnumToStringPipe,
    EscapeHtmlPipe,
    FormatHoursPipe,
    ChangeAvatarComponent,
    DfLoadingSpinnerModule,
    ImageCropperModule,
    CountdownComponent,
    ScheduleCalendarComponent,
    PictureCardComponent,
    TimeLoggedComponent,
    PlaceholderBarChartComponent,
    PlaceholderTableComponent,
    PlaceholderCardImageComponent,
    TimeLoggedWeekComponent,
    TopActivitiesWeekComponent,
    LogbookComponent,
    ActivityLevelBarComponent,
    DurationFormatPipe,
    MyDashboardDatepickerComponent,
    NotificationBadgeComponent,
    TeamSelectorComponent,
    CookiePreferencesFormComponent,
    CookiePreferencesModalComponent,
    ContractorCardComponent,
    EndContractComponent,
    AvailabilityFormComponent,
    EducationFormComponent,
    EducationListComponent,
    LocationFormComponent,
    CertificationFormComponent,
    CertificationListComponent,
    LanguageFormComponent,
    LanguageListComponent,
    LinkedinFormComponent,
    NameFormComponent,
    HeadlineFormComponent,
    ResumeFormComponent,
    SkypeFormComponent,
    PhoneFormComponent,
    PositionsFormComponent,
    PositionsListComponent,
    SkillFormComponent,
    SkillListComponent,
    SummaryFormComponent,
    UserProfileComponent,
    SkypeModalComponent,
    ChangeContractorAvatarComponent,
    PropertyFilterPipe,
    ReportsActivityModalComponent,
    JobDescriptionModalComponent,
    HireAddRoleModalComponent,
  ],
  declarations: [
    MarkdownViewerComponent,
    PageAlertComponent,
    PageInfoComponent,
    PageSuccessComponent,
    PasswordStrengthComponent,
    ChangeEmailModalComponent,
    EnumToStringPipe,
    EscapeHtmlPipe,
    ChangeAvatarComponent,
    CountdownComponent,
    InterviewMapComponent,
    ScheduleCalendarComponent,
    StandardModalComponent,
    TimezoneUpdateModalComponent,
    CookieAlertComponent,
    FormatHoursPipe,
    EndorsementFilterComponent,
    EndorsementNotesComponent,
    EndorsementCommentsComponent,
    PictureCardComponent,
    TimeLoggedComponent,
    PlaceholderBarChartComponent,
    PlaceholderTableComponent,
    PlaceholderCardImageComponent,
    ProfileImageSelectorComponent,
    ContractorDashboardBarComponent,
    TimeLoggedWeekComponent,
    TopActivitiesWeekComponent,
    LogbookComponent,
    DeleteTimecardsModalComponent,
    TimecardsNotIdleModalComponent,
    TimecardDetailsModalComponent,
    ActivityLevelBarComponent,
    LogbookScreenshotViewerComponent,
    TimecardsListViewComponent,
    DurationFormatPipe,
    MyDashboardDatepickerComponent,
    NotificationBadgeComponent,
    TeamSelectorComponent,
    CookiePreferencesFormComponent,
    CookiePreferencesModalComponent,
    ContractorCardComponent,
    EndContractComponent,
    AvailabilityFormComponent,
    EducationFormComponent,
    EducationListComponent,
    LocationFormComponent,
    CertificationFormComponent,
    CertificationListComponent,
    LanguageFormComponent,
    LanguageListComponent,
    LinkedinFormComponent,
    NameFormComponent,
    HeadlineFormComponent,
    ResumeFormComponent,
    SkypeFormComponent,
    PhoneFormComponent,
    PositionsFormComponent,
    PositionsListComponent,
    SkillFormComponent,
    SkillListComponent,
    SummaryFormComponent,
    UserProfileComponent,
    SkypeModalComponent,
    PaymentsReportsDownloadModalComponent,
    NewTeamModalComponent,
    ChangeContractorAvatarComponent,
    PropertyFilterPipe,
    ReportsActivityModalComponent,
    JobDescriptionModalComponent,
    HireAddRoleModalComponent,
    PropertyFilterPipe,
  ],
  providers: [EnumToStringPipe, FormatHoursPipe, DurationFormatPipe, PropertyFilterPipe],
  entryComponents: [
    ChangeEmailModalComponent,
    ChangeAvatarComponent,
    TimezoneUpdateModalComponent,
    CookieAlertComponent,
    EndorsementFilterComponent,
    EndorsementNotesComponent,
    EndorsementCommentsComponent,
    ProfileImageSelectorComponent,
    DeleteTimecardsModalComponent,
    TimecardsNotIdleModalComponent,
    TimecardDetailsModalComponent,
    LogbookScreenshotViewerComponent,
    CookiePreferencesModalComponent,
    PaymentsReportsDownloadModalComponent,
    ReportsActivityModalComponent,
    NewTeamModalComponent,
    JobDescriptionModalComponent,
    HireAddRoleModalComponent,
  ],
})
export class SharedModule {}
