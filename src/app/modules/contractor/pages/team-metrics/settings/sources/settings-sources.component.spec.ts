import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import * as METRIC_TYPE from 'app/core/constants/team-metric-setup/metric-setup-type';
import { SettingsSourcesComponent } from 'app/modules/contractor/pages/team-metrics/settings/sources/settings-sources.component';

describe('SettingsSourcesComponent', () => {
  let component: SettingsSourcesComponent;
  let fixture: ComponentFixture<SettingsSourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SettingsSourcesComponent],
      imports: [],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSourcesComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show jira setting model', () => {
    spyOn(component.changeModel, 'emit').and.returnValue({});
    component.showSettingModal(METRIC_TYPE.JIRA);
    expect(component.changeModel.emit).toHaveBeenCalled();
  });

});
