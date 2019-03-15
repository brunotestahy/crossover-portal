import { Component, OnInit } from '@angular/core';
import { DfToasterService } from '@devfactory/ngx-df';
import { DfActiveModal } from '@devfactory/ngx-df/modal';

import * as CookieConstants from 'app/core/constants/cookies';
import { CookiesService } from 'app/shared/services/cookies/cookies.service';

@Component({
  selector: 'app-cookie-preferences-modal',
  templateUrl: './cookie-preferences-modal.component.html',
  styleUrls: ['./cookie-preferences-modal.component.scss'],
})
export class CookiePreferencesModalComponent implements OnInit {

  public value: CookieConstants.COOKIES_SLIDER = CookieConstants.COOKIES_ADS_SLIDER;

  error: string | null = null;

  constructor(
    private cookiesService: CookiesService,
    private activeModal: DfActiveModal,
    private toasterService: DfToasterService
  ) { }

  public ngOnInit(): void {
    const currentCookiesValue = this.cookiesService.getCookie(CookieConstants.COOKIE_NAME);
    /* istanbul ignore else */
    if (currentCookiesValue) {
      this.value = CookieConstants.COOKIES_LEVEL_TO_SLIDER_MAP[currentCookiesValue];
    }
  }

  public onValueChange(newValue: CookieConstants.COOKIES_SLIDER): void {
    this.value = newValue;
  }

  public submit(): void {
    this.cookiesService.setCookie(CookieConstants.COOKIE_NAME, CookieConstants.COOKIES_SLIDER_TO_LEVEL_MAP[this.value]);
    this.toasterService.popSuccess('Cookie settings updated.');
    this.activeModal.close();
  }

  public close(): void {
    this.activeModal.close();
  }
}
