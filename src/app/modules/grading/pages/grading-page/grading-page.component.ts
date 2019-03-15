import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DfModalService } from '@devfactory/ngx-df';

import { CanComponentDeactivate } from 'app/core/guards/interfaces/can-component-deactivate';
import { Job, JobDetails, Test } from 'app/core/models/hire';
import { HireService } from 'app/core/services/hire/hire.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { FiveQGradingComponent } from 'app/modules/grading/components/five-q/grading/five-q-grading.component';

@Component({
  selector: 'app-grading-page',
  templateUrl: './grading-page.component.html',
  styleUrls: ['./grading-page.component.scss'],
})
export class GradingPageComponent implements OnInit, CanComponentDeactivate {
  public readonly FIVE_Q = '5Q';
  public readonly ENGLISH = 'English';

  public pipelines: Job[] = [];
  public tests: Test[] = this.tests = [
    {
      id: 1,
      name: this.ENGLISH,
      type: '',
    },
    {
      id: 2,
      name: this.FIVE_Q,
      type: ''
    }
  ];
  public selectedJob: JobDetails;

  public pipelineControl: FormControl = new FormControl();
  public testControl: FormControl = new FormControl();
  public emailNameControl: FormControl = new FormControl();
  public error = '';

  public previousTestSelection: Test;
  public previousPipelineSelection: Job;
  public unconfirmedTestSelection: Test | null;
  public unconfirmedPipelineSelection: Job | null;

  @ViewChild(FiveQGradingComponent)
  public fiveQGradingComponent: FiveQGradingComponent;

  @ViewChild('saveConfirmationModal')
  public saveConfirmationModal: TemplateRef<{}>;

  constructor(
    private modalService: DfModalService,
    private hireService: HireService,
    @Inject(WINDOW_TOKEN) private window: Window
  ) { }

  public ngOnInit(): void {
    const options = {
      applicationType: 'NATIVE'
    };
    this.hireService.getJobs(options)
      .subscribe(jobs => this.pipelines = jobs, error => this.error = error.error.text);

    this.pipelineControl.valueChanges.subscribe((value: Job) => this.checkForUnsavedChanges(value, null));
    this.testControl.valueChanges.subscribe((value) => this.checkForUnsavedChanges(null, value));
  }

  public showFiveQ(): boolean {
    if (this.fiveQGradingComponent && !this.fiveQGradingComponent.changesSaved) {
      return true;
    } else {
      return this.testControl.value && this.testControl.value.name === this.FIVE_Q;
    }
  }

  public canDeactivate(): boolean {
    return this.checkForUnsavedChanges();
  }

  public checkForUnsavedChanges(pipeline?: Job | null, test?: Test | null): boolean {
    let changesSaved = true;
    if (this.fiveQGradingComponent) {
      changesSaved = this.fiveQGradingComponent.changesSaved;
    }

    if (!changesSaved && pipeline) {
      this.unconfirmedPipelineSelection = pipeline;
      this.pipelineControl.setValue(this.previousPipelineSelection, {emitEvent : false });
      this.testControl.setValue(this.previousTestSelection, {emitEvent : false });
      this.openSaveConfirmationModal();
      return false;
    } else if (!changesSaved && test) {
      this.unconfirmedTestSelection = test;
      this.pipelineControl.setValue(this.previousPipelineSelection, {emitEvent : false });
      this.testControl.setValue(this.previousTestSelection, {emitEvent : false });
      this.openSaveConfirmationModal();
      return false;
    } else if (changesSaved && pipeline) {
      this.previousPipelineSelection = pipeline;
      this.testControl.setValue(null, { emitEvent: false });
      this.hireService.getJob(this.pipelineControl.value.id).subscribe(job => this.selectedJob = job);
    } else if (changesSaved && test) {
      this.previousTestSelection = test;
    } else if (!changesSaved) {
      this.openSaveConfirmationModal();
      return false;
    }

    return true;
  }

  public isSaveGradesDisabled(): boolean {
    return !this.fiveQGradingComponent || (this.fiveQGradingComponent && this.fiveQGradingComponent.changesSaved);
  }

  public goTo5QRubric(): void {
    this.window.open(`/grading/rubric/${this.pipelineControl.value.id}`, '_blank');
  }

  public saveGrades(): void {
    this.fiveQGradingComponent.saveGrades();
  }

  public cancelSave(close: Function): void {
    this.unconfirmedPipelineSelection = null;
    this.unconfirmedTestSelection = null;
    close();
  }

  public filterFiveQCandidates(event?: { key: string }): void {
    if (!event || event.key === 'Enter') {
      this.fiveQGradingComponent.fetchData(this.emailNameControl.value);
    }
  }

  public openSaveConfirmationModal(): void {
    this.modalService.open(this.saveConfirmationModal);
  }

  public hideFiveQTest(test: Test): boolean {
    return test.name === this.FIVE_Q && !(this.pipelineControl.value && this.pipelineControl.value.flowType);
  }

  public saveAndLeave(close: Function): void {
    this.saveGrades();

    this.fiveQGradingComponent.changesSaved = true;
    if (this.unconfirmedPipelineSelection) {
      this.pipelineControl.setValue(this.unconfirmedPipelineSelection);
    }
    if (this.unconfirmedTestSelection) {
      this.testControl.setValue(this.unconfirmedTestSelection);
    }

    this.unconfirmedPipelineSelection = null;
    this.unconfirmedTestSelection = null;

    close();
  }
}
