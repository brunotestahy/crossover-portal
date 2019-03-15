import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DfModalService } from '@devfactory/ngx-df';
import { differenceInDays, format, startOfDay, startOfToday } from 'date-fns';

import * as PeriodConstants from 'app/core/constants/period';
import { Assignment } from 'app/core/models/assignment';
import { CurrentUserDetail } from 'app/core/models/identity';
import { HireService } from 'app/core/services/hire/hire.service';
import { isApiError } from 'app/core/type-guards/is-api-error';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-end-contract',
  templateUrl: 'end-contract.component.html',
  styleUrls: ['end-contract.component.scss'],
})
export class EndContractComponent implements OnInit {
  public formGroup: FormGroup;
  public error: string | null = null;
  public isLoading = false;

  public readonly reasons = [
    {
      value: 'BUDGET_RESTRICTION',
      label: 'Budget Restriction',
    },
    {
      value: 'LOW_PERFORMANCE',
      label: 'Low Performance',
    },
    {
      value: 'RESIGNATION',
      label: 'Resignation',
    },
    {
      value: 'NON_COMPLIANCE',
      label: 'Non-Compliance',
    },
    {
      value: 'END_OF_PROJECT',
      label: 'End of Project',
    },
  ];

  public scores: string[] = [];

  @Input()
  public userDetail: CurrentUserDetail | null = null;

  @Input()
  public assignment: Assignment | null = null;

  @Output()
  public close = new EventEmitter<void>();

  @Output()
  public success = new EventEmitter<string>();

  @ViewChild('confirmationModal')
  public confirmationModal: TemplateRef<{}>;

  constructor(
    private formBuilder: FormBuilder,
    private hireService: HireService,
    private modalService: DfModalService
  ) { }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      reason: [null, Validators.required],
      contractorScore: [1, Validators.required],
      additionalComments: [null, Validators.required],
      effectiveDate: [null, Validators.required],
    });
    this.buildScores();
  }

  public buildScores(): void {
    for (let i = 1; i <= 10; i++) {
      this.scores.push(i.toString());
    }
  }

  public onClose(): void {
    this.close.emit();
  }

  public getDailyFormat(date: Date): string {
    const day = `${PeriodConstants.DAYS[date.getDay()]}`;
    return `${day}, ${PeriodConstants.YEAR_MONTHS[date.getMonth()]} ${date.getDate()}`;
  }

  public twoWeeksNotice(): boolean {
    const today = startOfToday();
    const date = this.formGroup.value.effectiveDate;
    return date && differenceInDays(startOfDay(date), today) <= 14;
  }

  public openConfirmationModal(): void {
    this.modalService.open(this.confirmationModal);
  }

  public endContract(confirmationClose: Function): void {
    /* istanbul ignore else */
    if (this.formGroup.valid) {
      const formValues = this.formGroup.value;
      /* istanbul ignore else */
      if (this.assignment !== null) {
        this.isLoading = true;
        this.error = null;
        confirmationClose();
        this.hireService.endContract(
          format(formValues.effectiveDate, 'YYYY-MM-DD'),
          formValues.reason,
          formValues.additionalComments,
          formValues.contractorScore,
          this.assignment
        )
          .pipe(finalize(() => {
            this.isLoading = false;
          }))
          .subscribe(() => {
            this.onClose();
            this.success.emit(format(formValues.effectiveDate, 'YYYY-MM-DD'));
          }, error => {
            if (isApiError(error)) {
              this.error = error.error.text;
            } else {
              this.error = 'Error terminating contractor.';
            }
          }
          );
      }
    }
  }
}
