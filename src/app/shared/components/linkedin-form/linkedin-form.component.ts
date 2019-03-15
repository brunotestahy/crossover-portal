import { Component, Inject } from '@angular/core';
import { DfAlert, DfAlertService, DfAlertType } from '@devfactory/ngx-df';

import { LinkedInService } from 'app/core/services/linkedin';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';

@Component({
  selector: 'app-linkedin-form',
  templateUrl: './linkedin-form.component.html',
  styleUrls: ['./linkedin-form.component.scss'],
})
export class LinkedinFormComponent {
  constructor(
    private alertService: DfAlertService,
    private linkedinService: LinkedInService,
    @Inject(WINDOW_TOKEN) private window: Window
  ) {
  }

  public onImport(): DfAlert {
    return this.alertService
      .createAlertComponent({
        title: 'Import information',
        message: [
          [
            'Importing your profile from LinkedIn will over-write your current profile on Crossover.com ',
            'and you will lose any changes you have made to that profile.',
          ].join(''),
          'Would you like to continue?',
        ].join('<br><br>'),
        icon: 'fa fa-warning',
        type: DfAlertType.Custom,
        buttons: [
          {
            text: 'Yes, Import from LinkedIn',
            handler: () => this.window.location.replace(
              this.linkedinService.generateAuthorizationUrl('profileImport', 'assets')
            ),
            className: 'info',
          },
          { text: 'Cancel' },
        ],
      });
  }
}
