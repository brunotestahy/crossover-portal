import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DfToasterService } from '@devfactory/ngx-df';
import { EnumsService } from 'app/core/services/enums/enums.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-security-question-page',
  templateUrl: './security-question-page.component.html',
  styleUrls: ['./security-question-page.component.scss'],
})
export class SecurityQuestionPageComponent implements OnInit {

  private static readonly OTHER_QUESTION = 'other';

  public saving: boolean;

  public currentQuestion = 'Loading ...';
  public questions: string[];

  public error: null | string;

  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: DfToasterService,
    private identityService: IdentityService,
    private enumService: EnumsService
  ) {}

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      answer: ['', Validators.required],
      question: ['', Validators.required],
      customQuestion: ['', Validators.required],
      newAnswer: ['', Validators.required],
      accept: [false, Validators.requiredTrue],
    });

    this.form.controls.customQuestion.disable();
    this.form.controls.question.valueChanges.subscribe(v => {
      if (v === SecurityQuestionPageComponent.OTHER_QUESTION) {
        this.form.controls.customQuestion.enable();
      } else {
        this.form.controls.customQuestion.disable();
      }
    });
    this.enumService.getSecurityQuestions()
      .subscribe(questions => this.questions = questions);
    this.identityService.getCurrentUser().subscribe(currentUser => {
      if (currentUser) {
        this.currentQuestion = currentUser.userSecurity.securityQuestion as string;
      }
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const newQuestion = this.resolveQuestionText();
      this.saving = true;
      this.error = null;
      this.identityService.changeCurrentUserSecurityQuestion(this.form.value.answer, newQuestion, this.form.value.newAnswer)
        .subscribe(() => {
          this.saving = false;
          // Moving the new question to be the existing
          this.currentQuestion = newQuestion;
          this.form.controls.answer.setValue(this.form.value.newAnswer);
          this.toasterService.popSuccess('Security question changed successfully!');
        },
        (error) => {
          this.saving = false;
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error changing security question.';
          }
        }
      );
    }
  }

  /**
   * @returns The questions either from the predefined selection or from the custom one
   */
  private resolveQuestionText(): string {
    return this.form.value.question === SecurityQuestionPageComponent.OTHER_QUESTION ?
      this.form.value.customQuestion : this.form.value.question;
  }

}
