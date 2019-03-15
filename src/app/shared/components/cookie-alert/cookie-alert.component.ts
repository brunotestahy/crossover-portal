import { Component } from '@angular/core';
import { DfActivePortal, DfModalOptions, DfModalService, DfModalSize } from '@devfactory/ngx-df';

import * as CookieConstants from 'app/core/constants/cookies';
import { CookiePreferencesModalComponent } from 'app/shared/components/cookie-preferences-modal/cookie-preferences-modal.component';
import { CookiesService } from 'app/shared/services/cookies/cookies.service';

@Component({
  selector: 'app-cookie-alert',
  templateUrl: './cookie-alert.component.html',
  styleUrls: ['./cookie-alert.component.scss'],
})
export class CookieAlertComponent {

  constructor(
    private cookiesService: CookiesService,
    private activePortal: DfActivePortal,
    private modalService: DfModalService
  ) {}

  public close(): void {
    if (!this.cookiesService.getCookie(CookieConstants.COOKIE_NAME)) {
      this.cookiesService.setCookie(CookieConstants.COOKIE_NAME, CookieConstants.COOKIES_ADS_LEVEL);
    }
    this.activePortal.close();
  }

  public openPreferences(): void {
    this.modalService.open(CookiePreferencesModalComponent, <DfModalOptions>{size: DfModalSize.Large});
  }

}
