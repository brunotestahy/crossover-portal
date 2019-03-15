import { Component, EventEmitter, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DfAlertService, DfAlertType, DfToasterService } from '@devfactory/ngx-df';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';

import { Assignment } from 'app/core/models/assignment';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { EventService } from 'app/shared/services/event.service';

const TOASTER_AUTO_CLOSE_TIME = 3000;

@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.component.html',
  styleUrls: ['./view-contract.component.scss'],
})

export class ViewContractComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public form: FormGroup;

  public isLoading = true;

  public error: string | null = null;

  public assignmentIdURL: string;
  public assignment: Assignment;

  public currentUser: CurrentUserDetail | null;
  public manager: Manager;

  public refreshNotifications: EventEmitter<{}> = new EventEmitter<{}>();

  constructor(private formBuilder: FormBuilder,
              private alert: DfAlertService,
              private toaster: DfToasterService,
              private activatedRoute: ActivatedRoute,
              private identifyService: IdentityService,
              private assignmentService: AssignmentService,
              private eventService: EventService,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.fetchUserAndAssignmentData();
    this.buildForm();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.acceptOffer();
    }
  }

  public onDeclineClicked(): void {
    this.alert.createDialog({
      title: 'Decline Offer',
      message: 'You are going to decline the offer, are you sure?',
      type: DfAlertType.Confirm,
    }).subscribe((data: string[]) => {
      if (data[0] === 'ok') {
        this.isLoading = true;
        this.declineOffer();
      }
    });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  private fetchUserAndAssignmentData(): void {
    Observable.zip(this.identifyService.getCurrentUser(), this.activatedRoute.params)
      .mergeMap(([user, route]) => {
        this.currentUser = user;
        this.assignmentIdURL = route.id;
        return this.assignmentService.getAssignmentById(this.assignmentIdURL);
      })
      .subscribe(
        (assignmentResponse: Assignment) => {
          this.assignment = assignmentResponse;
          this.manager = this.assignment.manager;
          this.isLoading = false;
        },
        (negativeResponse) => {
          this.handleError(negativeResponse.error);
        });
  }

  private acceptOffer(): void {
    this.isLoading = true;
    this.assignmentService.candidateAcceptsOffer(this.assignmentIdURL)
      .subscribe(
        () => {
          this.showMessageAndRedirect(
            'You have successfully accepted job offer. Your response has been sent.',
            `candidate/onboarding-process/${this.assignment.id}`
          );
          this.eventService.refreshNotifications(this.refreshNotifications);
        },
        (negativeResponse) => {
          this.handleError(negativeResponse.error);
        });
  }

  private declineOffer(): void {
    this.assignmentService.candidateDeclinesOffer(this.assignmentIdURL)
      .subscribe(() => {
          this.showMessageAndRedirect(
            'You have declined the offer!',
            'candidate/dashboard/hiring'
          );
        },
        (negativeResponse) => {
          this.handleError(negativeResponse.error);
        });
  }

  private showMessageAndRedirect(message: string, targetRoute: string): void {
    this.toaster.popSuccess(message, { autoCloseTime: TOASTER_AUTO_CLOSE_TIME })
      .subscribe(() => {
        this.router.navigate([targetRoute]);
      });
  }

  private handleError(error: { text: string }): void {
    if (this.isLoading) {
      this.isLoading = false;
    }
    this.error = error.text;
  }
}
