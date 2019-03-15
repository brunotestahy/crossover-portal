import { Component, OnInit } from '@angular/core';

import { ApplicationProcessService } from '../../shared/application-process.service';

@Component({
  selector: 'app-testing-invite-pending',
  templateUrl: './testing-invite-pending.component.html',
  styleUrls: ['./testing-invite-pending.component.scss'],
})

export class TestingInvitePendingComponent implements OnInit {

  public static readonly STEP_NO = 0;

  constructor(private process: ApplicationProcessService) { }

  public ngOnInit(): void {
    this.process.currentStep(TestingInvitePendingComponent.STEP_NO);
  }
}
