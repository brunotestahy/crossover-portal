import { Component, OnInit } from '@angular/core';
import { DfToasterService } from '@devfactory/ngx-df';

import * as CookieConstants from 'app/core/constants/cookies';
import { CookiesService } from 'app/shared/services/cookies/cookies.service';


@Component({
  selector: 'app-privacy-settings-page',
  templateUrl: './privacy-settings-page.component.html',
  styleUrls: ['./privacy-settings-page.component.scss'],
})
export class PrivacySettingsPageComponent implements OnInit {

  public value: CookieConstants.COOKIES_SLIDER = CookieConstants.COOKIES_ADS_SLIDER;

  constructor(
    private cookiesService: CookiesService,
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
    this.toasterService.popSuccess('Change successfully saved. It will be applied next time you login.');
  }
}
