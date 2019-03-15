import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TeamMetricRecord, TeamSetupServer } from 'app/core/models/metric';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-desk-dot-com-server-settings',
  templateUrl: './desk-dot-com-server-settings.component.html',
  styleUrls: ['./desk-dot-com-server-settings.component.scss'],
})
export class DeskDotComServerSettingsComponent implements OnInit {
  public formGroup: FormGroup;
  public deskDotComAccount: FormGroup;
  public metricInfo: FormGroup;

  @Input()
  public deskDotComUsers: TeamMetricRecord[] = [];

  public readonly SOLVED_TICKETS = 'resolved';
  public readonly CLOSED_TICKETS = 'closed';
  public validAdvancedQuery = true;

  @Input()
  public isLoading = false;
  public error = '';
  public showDetailContent = false;

  @Input()
  public servers: TeamSetupServer[] = [];

  @Output()
  public checkServers = new EventEmitter<{}>();
  @Output()
  public remove = new EventEmitter<{}>();

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      deskDotComAccount: this.formBuilder.group({
          confirmServer: [true],
          username: [''],
          baseUrl: [''],
          password: [''],
      }),
      metricInfo: this.formBuilder.group({
          name: ['', Validators.required],
          metricDefinition: [this.SOLVED_TICKETS],
          metricTarget: ['', Validators.required],
          customQuery: [''],
      }),
    });

    this.metricInfo = this.formGroup.controls.metricInfo as FormGroup;
    this.deskDotComAccount = this.formGroup.controls.deskDotComAccount as FormGroup;

    this.deskDotComAccount.controls.confirmServer.valueChanges.subscribe(confirmServer => this.checkAccountValues(confirmServer));
  }

  public updateServer(event: HTMLInputEvent, i: number): void {
    this.deskDotComUsers[i].server = event.target.value;
  }

  public updateUsername(event: HTMLInputEvent, i: number): void {
    this.deskDotComUsers[i].username = event.target.value;
  }

  public onCheckServers(): void {
    this.checkServers.emit();
  }

  public checkAccountValues(confirmServer: boolean): void {
    this.showDetailContent = !confirmServer;
    if (this.showDetailContent) {
      this.remove.emit();
    }
  }
}
