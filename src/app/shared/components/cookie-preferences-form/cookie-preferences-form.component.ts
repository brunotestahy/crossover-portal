import { Component, EventEmitter, Input, Output } from '@angular/core';

import * as CookieConstants from 'app/core/constants/cookies';

@Component({
  selector: 'app-cookie-preferences-form',
  templateUrl: './cookie-preferences-form.component.html',
  styleUrls: ['./cookie-preferences-form.component.scss'],
})
export class CookiePreferencesFormComponent {

  @Input()
  public value: CookieConstants.COOKIES_SLIDER;
  @Output()
  public valueChange = new EventEmitter<CookieConstants.COOKIES_SLIDER>();

  public cookieConstants = CookieConstants;

  public setValue(newValue: CookieConstants.COOKIES_SLIDER): void {
    this.value = newValue;
    this.valueChange.emit(this.value);
  }
}
