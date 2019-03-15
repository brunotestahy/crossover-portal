import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';
}
