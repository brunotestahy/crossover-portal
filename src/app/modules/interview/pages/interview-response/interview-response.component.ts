import { Component, HostBinding, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DfModalService, DfToasterService } from '@devfactory/ngx-df';
import { InterviewDetailsResponse } from 'app/core/models/interview';
import { InterviewService } from 'app/core/services/interview/interview.service';
import { finalize, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-interview-response',
  templateUrl: './interview-response.component.html',
  styleUrls: ['./interview-response.component.scss'],
})

export class InterviewResponseComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public statusMap = {
    'CANDIDATE_ACCEPTED': ' Accepted',
    'CANDIDATE_REJECTED': ' Declined',
    'INITIAL': 'Candidate Informed',
    'SCHEDULED': 'Being scheduled',
    'CONDUCTED': 'Conducted',
    'NOT_CONDUCTED': 'Not conducted as per Schedule',
    'OFFER': 'Hired for job',
    'NOT_HIRED': 'Not hired for job',
  };

  public interview: InterviewDetailsResponse;
  public isLoading = false;
  public isSaving = false;
  public error: string | null = null;
  public modalError: string | null = null;
  public id: number;

  public form: FormGroup = new FormGroup({
    reason: new FormControl(null, [Validators.required, Validators.minLength(20)]),
  });

  @ViewChild('declineModal')
  public declineModal: TemplateRef<{}>;

  constructor(
    private interviewService: InterviewService,
    private activatedRoute: ActivatedRoute,
    private modalService: DfModalService,
    private toasterService: DfToasterService,
    private router: Router
    ) { }

  public ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.params.pipe(
        switchMap(params => {
          this.id = params.id;
          return this.interviewService.getInterviewDetails(params.id);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(interview => {
        this.interview = interview;
        this.decline();
      },
      () => this.error = `Unknown identifier ${this.id} specified. Retry the operation with a valid identifier.`
    );
  }

  public decline(): void {
    this.modalService.open(this.declineModal);
  }

  public declineInterview(close: Function): void {
    if (this.form.valid && !this.isSaving) {
      this.isSaving = true;
      this.modalError = null;
      this.interview.status = 'CANDIDATE_REJECTED';
      const reasons = this.form.get('reason');
      if (reasons !== null) {
        this.interview.intervieweeNotes = reasons.value;
      }
      close();
      this.interviewService.declineInterview(this.id, this.interview)
        .subscribe(() => {
          this.toasterService.popSuccess('Interview declined!');
          this.isSaving = false;
          this.router.navigate([`/interview/${this.id}/view`]);
        }, () => {
          this.modalError = 'Error declining interview';
          this.isSaving = false;
        });
    }
  }
}
