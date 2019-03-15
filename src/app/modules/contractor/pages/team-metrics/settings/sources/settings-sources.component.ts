import { Component, EventEmitter, Output } from '@angular/core';

import * as METRIC_TYPE from 'app/core/constants/team-metric-setup/metric-setup-type';

@Component({
  selector: 'app-settings-sources',
  templateUrl: './settings-sources.component.html',
  styleUrls: ['./settings-sources.component.scss'],
})
export class SettingsSourcesComponent {
  public readonly metricType = METRIC_TYPE;

  @Output()
  public changeModel = new EventEmitter<string>();

  public showSettingModal(modalName: string): void {
    this.changeModel.emit(modalName);
  }
}
