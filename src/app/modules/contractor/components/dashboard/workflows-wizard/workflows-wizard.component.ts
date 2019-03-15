import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { JiraProject, JiraServer, JiraWorkflow } from 'app/core/models/workflow';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { WorkflowsService } from 'app/core/services/workflows/workflows.service';

@Component({
  selector: 'app-workflows-wizard',
  templateUrl: './workflows-wizard.component.html',
  styleUrls: ['./workflows-wizard.component.scss'],
})
export class WorkflowsWizardComponent implements OnInit {

  @Output()
  public close: EventEmitter<{}> = new EventEmitter<{}>();

  public servers: JiraServer[] = [];
  public projects: JiraProject[] = [];

  public readonly CHECK_DEFAULT = 'default';
  public readonly SERVER = 'SERVER';
  public readonly PROJECT = 'PROJECT';
  public readonly FINISH = 'FINISH';

  public server: FormControl = new FormControl();
  public project: FormControl = new FormControl();
  public projectCheck: FormControl = new FormControl(this.CHECK_DEFAULT);

  public error = '';
  public isLoading = false;

  public teamId: number;

  public step = this.SERVER;

  constructor(
    private workflowsService: WorkflowsService,
    private identityService: IdentityService
  ) { }

  public onClose(): void {
    this.close.emit();
  }

  public ngOnInit(): void {
    const teamManagerGroup = this.identityService.getTeamManagerGroupSelectionValue();
    if (teamManagerGroup !== null) {
      this.teamId = teamManagerGroup.team.id;
      this.isLoading = true;
      this.workflowsService.getServers()
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(servers => this.servers = servers, error => this.error = error);
    }
  }

  public goToProjectsStep(): void {
    this.isLoading = true;
    this.workflowsService.getProjects(this.server.value)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(projects => {
        this.step = this.PROJECT;
        this.projects = projects;
      }, error => this.error = error);
  }

  public goToFinish(): void {
    this.isLoading = true;
    const jiraWorkflow = {
      jiraKey: this.project.value,
      workflowJiraServer: {
        id: this.server.value,
      }
    } as JiraWorkflow;
    this.workflowsService.saveWorkflow(this.teamId.toString(), jiraWorkflow)
      .pipe(finalize(() => this.isLoading = false)).subscribe(() => this.step = this.FINISH);
  }

  public finalizeProcess(): void {
    this.onClose();
  }

  public isGoToProjectDisabled(): boolean {
    return !this.server.value;
  }

  public isGoToFinishDisabled(): boolean {
    return !this.project.value;
  }

  public getServerCheckIcon(): string {
    return this.step === this.SERVER ? 'assets/images/xo-check.png' : 'assets/images/xo-check-green.png';
  }

  public getProjectCheckIcon(): string {
    return this.step === this.FINISH ? 'assets/images/xo-check-green.png' : 'assets/images/xo-check.png';
  }

  public getServerIconClass(): string {
    return this.step === this.SERVER ? '': 'step-completed';
  }

  public getProjectIconClass(): string {
    return this.step === this.FINISH ? 'step-completed' : '';
  }
}
