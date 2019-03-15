import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DfAlertService, DfAlertType, DfGroupToggleItem, DfLoadingSpinnerService } from '@devfactory/ngx-df';
import {
  JobApplication,
  WrittenAssignationQuestionnaireQuestion,
  WrittenAssignationTest,
} from 'app/core/models/application';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import { filter, finalize, take } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-written-evaluation-assignment',
  templateUrl: './written-evaluation-assignment.component.html',
  styleUrls: ['./written-evaluation-assignment.component.scss'],
})
export class WrittenEvaluationAssignmentComponent implements OnInit, OnDestroy {

  private applicationId: number;
  private destroy$ = new Subject();

  public data: WrittenAssignationTest;
  public description = '';

  public error: string;
  public questions: WrittenAssignationQuestionnaireQuestion[];
  public questionButtons: DfGroupToggleItem[] = [
    {
      text: 'Q1',
      id: 'Q1',
    },
    {
      text: 'Q2',
      id: 'Q2',
    },
    {
      text: 'Q3',
      id: 'Q3',
    },
    {
      text: 'Q4',
      id: 'Q4',
    },
    {
      text: 'Q5',
      id: 'Q5',
    },
  ];
  public questionButtonsLoaded = false;
  public questionSelectedIndex = 1;
  public editorOptions = {
    height: '300px',
    placeholderText: '',
    charCounterCount: false,
    quickInsertTags: [''],
  };
  public form: FormGroup = new FormGroup({});

  public a: FormGroup;

  @ViewChild('card', {read: ElementRef})
  public card: ElementRef;

  constructor(private service: CandidateService,
              private loader: DfLoadingSpinnerService,
              private alert: DfAlertService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.service.getCurrentApplication()
      .take(1)
      .flatMap((application: JobApplication) => {
        this.applicationId = application.id;
        return this.service.getWrittenEvaluationAssignment(this.applicationId);
      })
      .subscribe((assignation: WrittenAssignationTest) => {
        this.questions = assignation.test.questions.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

        this.initQuestionsAndButtons();

        this.initDescription(assignation);

        this.initAnswers(assignation);
      });
  }

  public onToggleChange(event: DfGroupToggleItem): void {
    this.questionSelectedIndex = this.questionButtons.findIndex(it => it === event);
  }

  public previous(): void {
    this.questionSelectedIndex = this.questionSelectedIndex - 1;
    this.card.nativeElement.scrollIntoView({
      inline: 'start',
      block: 'start',
      behavior: 'smooth',
    });
  }

  public next(): void {
    this.questionSelectedIndex = this.questionSelectedIndex + 1;
    this.card.nativeElement.scrollIntoView({
      inline: 'start',
      block: 'start',
      behavior: 'smooth',
    });
  }

  public saveDraft(hideLoader: boolean | null = false): void {
    if (!hideLoader) {
      this.loader.reveal();
    }

    this.service.saveWrittenEvaluationAssignmentDraft(this.applicationId, this.data)
      .pipe(take(1))
      .subscribe(
        () => {
          if (!hideLoader) {
            this.loader.hide();
          }
        },
        () => {
          if (!hideLoader) {
            this.loader.hide();
          }
        }
      );
  }

  public submit(): void {
    this.alert.createDialog({
      title: 'Confirmation',
      message: 'Once submitted, these cannot be changed. <br />Do you want to submit these answers?',
      type: DfAlertType.Confirm,
      icon: 'fa fa-warning',
      iconColor: 'orange',
    })
      .pipe(filter(data => data[0] === 'ok'))
      .subscribe(() => this.doSubmit());
  }

  public doSubmit(): void {
    this.loader.reveal();

    this.service.submitWrittenEvaluationAssignment(this.applicationId, this.data)
      .pipe(
        take(1),
        finalize(() => this.loader.hide())
      )
      .subscribe(
        () => this.router.navigate(['../written-evaluation-submitted'], {relativeTo: this.route}),
        err => this.error = err.error.error.text
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private initQuestionsAndButtons(): void {
    const controls: { [key: string]: AbstractControl } = {};
    this.questionButtons = [];
    this.questions
      .forEach(question => {
        // dynamically create form controls
        controls[`q${question.sequenceNumber}`] = new FormControl('', [Validators.required]);

        // dynamically create question buttons
        this.questionButtons.push({
          text: `Q${question.sequenceNumber}`,
          id: `Q${question.sequenceNumber}`,
        });
      });

    this.questionSelectedIndex = 0;
    this.questionButtonsLoaded = true;

    this.form = new FormGroup(controls);
  }

  private initDescription(assignation: WrittenAssignationTest): void {
    this.description = assignation.test.description;
  }

  private initAnswers(assignation: WrittenAssignationTest): void {
    this.initValidityCheck();

    this.data = assignation;
    this.data.answers = this.data.answers.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

    this.data.answers.forEach((el, i) => {
      this.form.controls[`q${i + 1}`].setValue(el.answer);
    });

    this.initDraftChanges();
  }

  private initValidityCheck(): void {
    for (const controlName in this.form.controls) {
      if (this.form.controls[controlName]) {
        const control = this.form.controls[controlName];
        control.valueChanges
          .subscribe((value: string) => {
            this.applyChanges(controlName, value);
          });
      }
    }
  }

  /**
   * Auto-saves the assignment, if answer is changed.
   */
  private initDraftChanges(): void {
    this.form.valueChanges
      .debounceTime(60000)
      .distinctUntilChanged()
      .takeUntil(this.destroy$)
      .subscribe(() => this.saveDraft(true));
  }

  private applyChanges(controlName: string, value: string): void {
    this.applyChangesAnswer(controlName, value);
    this.setButtonIcon(controlName);
  }

  private applyChangesAnswer(controlName: string, value: string): void {
    const index = parseInt(controlName.slice(1), 10) - 1;
    this.data.answers[index].answer = value;
  }

  private setButtonIcon(controlName: string): void {
    const index = parseInt(controlName.slice(1), 10) - 1;
    const questionButtons: DfGroupToggleItem[] = Object.assign([], this.questionButtons);

    if (this.form.controls[controlName].valid) {
      questionButtons[index].icon = 'fa fa-check';
    } else {
      delete questionButtons[index].icon;
    }

    this.questionButtons = questionButtons;
  }
}
