import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DfAlertService, DfAlertType, DfLoadingSpinnerService, DfModalService } from '@devfactory/ngx-df';
import { filter } from 'rxjs/operators';

import { JobApplication, ProjectEvaluationInvitation } from 'app/core/models/application';
import { CandidateService } from 'app/core/services/candidate/candidate.service';

@Component({
  selector: 'app-project-evaluation-instructions',
  templateUrl: './project-evaluation-instructions.component.html',
  styleUrls: ['./project-evaluation-instructions.component.scss'],
})
export class ProjectEvaluationInstructionsComponent implements OnInit {

  private readonly DEFAULT_ASSIGNMENT_DAYS_COUNT = 3;

  public applicationId: number;
  public data: ProjectEvaluationInvitation;

  constructor(private service: CandidateService,
    private loader: DfLoadingSpinnerService,
    private modal: DfModalService,
    private alert: DfAlertService,
    private router: Router,
    private route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.loader.showLoader({});
    this.service.getCurrentApplication()
      .subscribe((application: JobApplication) => {
        this.applicationId = application.id;
        this.service.getProjectEvaluationInvitation(application.id)
          .subscribe((invitation: ProjectEvaluationInvitation) => {
            this.data = invitation;
            // if assignmentDaysCount is not set, use default value
            this.data.assignmentDaysCount = this.data.assignmentDaysCount || this.DEFAULT_ASSIGNMENT_DAYS_COUNT;
            this.loader.hide();
          });
      });
  }

  public openPrerequisitesModal(template: TemplateRef<{}>): void {
    this.modal.open(template);
  }

  public startProject(): void {
    this.alert.createDialog({
      title: 'Get ready for your trial!',
      message: `<p>You are about to start your technical assessment.
        Please make sure you have installed the pre-requisites when needed.
        The trial requires a good amount of your time and once started we
        cannot pause it, so ensure you have plenty of time to work on the
        assignment and show all your magic skills.</p>
        <p>You have <b>${this.data.assignmentDaysCount} days</b> to complete it.
        Once started, you can request an extension if you need a little more time.</p>
        <p>We are happy to see you entering this stage and we wish you the best.</p>`,
      type: DfAlertType.Confirm,
    })
    .pipe(
      filter(data => data[0] === 'ok')
    )
    .subscribe(() => this.doStartProject());
  }

  public doStartProject(): void {
    this.loader.showLoader({});
    this.service.startProjectEvaluation(this.applicationId)
      .subscribe(
        () => {
          this.router.navigate(['../project-evaluation-assignment'], {relativeTo: this.route});
          this.loader.hide();
        },
        () => {}
      );
  }

}
