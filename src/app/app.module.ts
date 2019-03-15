import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfAlertModule,
  DfBadgeModule,
  DfBarModule,
  DfBubbleWizardModule,
  DfButtonModule,
  DfCardModule,
  DfCheckboxModule,
  DfCoreModule,
  DfDonutModule,
  DfDropdownModule,
  DfExportXLSXModule,
  DfFileUploadModule,
  DfGridModule,
  DfGroupToggleModule,
  DfIEInputEventManagerPluginModule,
  DfLegendModule,
  DfListPanelModule,
  DfLoadingSpinnerModule,
  DfModalModule,
  DfPortalModule,
  DfProgressBarModule,
  DfRadioInputModule,
  DfSelectModule,
  DfSidebarModule,
  DfSliderModule,
  DfSlideToggleModule,
  DfStarRatingModule,
  DfTablePaginatorModule,
  DfToasterModule,
  DfToolTipModule,
  DfTopbarModule,
  DfUserProfileModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import {
  NgbDropdownModule,
  NgbPopoverModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'angular-calendar';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import {
  RECAPTCHA_SETTINGS,
  RecaptchaModule,
  RecaptchaSettings,
} from 'ng-recaptcha';
import { DndModule } from 'ng2-dnd';

import { AppRoutingModule } from 'app/app-routing.module';
import { AppComponent } from 'app/app.component';
import { MainComponent } from 'app/containers/main/main.component';
import { CoreModule } from 'app/core/core.module';
import { CookiesService } from 'app/shared/services/cookies/cookies.service';
import { EventService } from 'app/shared/services/event.service';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';
import { TimeUtilsService } from 'app/shared/services/timeutils/time-utils.service';
import { SharedModule } from 'app/shared/shared.module';
import { environment } from 'environments/environment';

@NgModule({
  declarations: [AppComponent, MainComponent],
  imports: [
    // main modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LayoutModule,
    SharedModule,
    AppRoutingModule,

    // External modules
    NgbDropdownModule.forRoot(),
    NgbPopoverModule.forRoot(),
    NgbTooltipModule.forRoot(),
    RecaptchaModule.forRoot(),
    LayoutModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    CalendarModule.forRoot(),
    // ngx-df modules
    DfIEInputEventManagerPluginModule.forRoot(),
    DfButtonModule.forRoot(),
    DfSelectModule.forRoot(),
    DfAlertModule.forRoot(),
    DfSliderModule.forRoot(),
    DfModalModule.forRoot(),
    DfCardModule.forRoot(),
    DfValidationMessagesModule.forRoot(),
    DfTopbarModule.forRoot(),
    DfDropdownModule.forRoot(),
    DfDonutModule.forRoot(),
    DfUserProfileModule.forRoot(),
    DfCheckboxModule.forRoot(),
    DfSlideToggleModule.forRoot(),
    DfToasterModule.forRoot(),
    DfToolTipModule.forRoot(),
    DfFileUploadModule.forRoot(),
    DfSidebarModule.forRoot(),
    DfBubbleWizardModule.forRoot(),
    DfBadgeModule.forRoot(),
    DfGridModule.forRoot(),
    DfGroupToggleModule.forRoot(),
    DfUserProfileModule.forRoot(),
    DfLoadingSpinnerModule.forRoot(),
    DfRadioInputModule.forRoot(),
    DfExportXLSXModule.forRoot(),
    DfTablePaginatorModule.forRoot(),
    DfListPanelModule.forRoot(),
    DfPortalModule.forRoot(),
    DfProgressBarModule.forRoot(),
    DfLegendModule.forRoot(),
    DfBarModule.forRoot(),
    DfStarRatingModule.forRoot(),
    CoreModule,
    DfCoreModule.forRoot(),
    DndModule.forRoot(),
    DfExportXLSXModule.forRoot(),
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptchaKey,
      } as RecaptchaSettings,
    },
    EventService,
    TimeUtilsService,
    CookiesService,
    TeamSelectorStrategyService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
