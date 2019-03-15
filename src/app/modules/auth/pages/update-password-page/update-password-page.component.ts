import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { confirmPasswordValidator, DfValidationMessagesMap } from '@devfactory/ngx-df';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { isApiError } from 'app/core/type-guards/is-api-error';
import { switchMap } from 'rxjs/operators/switchMap';

export interface UpdatePasswordFormData {
  question: string;
  answer: string;
  passwordGroup: {
    password: string;
    confirm: string;
  };
}

@Component({
  selector: 'app-update-password-page',
  templateUrl: './update-password-page.component.html',
  styleUrls: ['./update-password-page.component.scss'],
})
export class UpdatePasswordPageComponent implements OnInit {

  public token: string;

  public form: FormGroup;

  public customQuestionControl: FormControl;

  public passwordMessages: DfValidationMessagesMap =  {
    pattern: () => 'At least 8 characters, 1 letter and a number or symbol',
  };

  public pending = false;
  public success = false;

  public error: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private identityService: IdentityService
  ) {
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      passwordGroup: this.formBuilder.group(
        {
          password: [
            '',
            Validators.compose([
              Validators.required,
              Validators.minLength(8),
              Validators.maxLength(64),
              Validators.pattern(/^(?=.*[^a-zA-Z])(?=.*[a-zA-Z]).{8,64}$/),
            ]),
          ],
          confirm: ['', Validators.required],
        },
        { validator: confirmPasswordValidator() }
      ),
    });

    this.activatedRoute.params
      .pipe(
        switchMap(p => {
          this.token = p.token;
          return this.identityService.confirmForgotPasswordToken(p.token);
        })
      )
      .subscribe(
        (res) => {
          this.form.controls.question.setValue(res.securityQuestion);
        },
        (error) => {
          if (isApiError(error)) {
            this.error = error.error.text;
          }
        }
      );
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.pending = true;
      this.error = null;
      this.identityService.updatePassword({
          passwordResetToken: this.token,
          rawPassword: this.form.value.passwordGroup.password,
          securityQuestion: this.form.value.question,
          securityQuestionAnswer: this.form.value.answer,
        })
        .subscribe(() => {
          this.pending = false;
          this.success = true;
        },
        (error) => {
          this.pending = false;
          this.success = false;
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error updating the password.';
          }
        }
      );
    }
  }
}
