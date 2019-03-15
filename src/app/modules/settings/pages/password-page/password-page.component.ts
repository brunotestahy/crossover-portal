import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator, DfToasterService, DfValidationMessagesMap } from '@devfactory/ngx-df';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-password-page',
  templateUrl: './password-page.component.html',
  styleUrls: ['./password-page.component.scss'],
})
export class PasswordPageComponent implements OnInit {

  public saving = false;

  public error: null | string = null;

  public form: FormGroup;

  public passwordMessages: DfValidationMessagesMap =  {
    pattern: () => 'At least 8 characters, 1 letter and a number or symbol',
  };

  constructor(
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
    private toasterService: DfToasterService) {}

  public ngOnInit(): void {
    this.buildForm();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.saving = true;
      this.error = null;
      this.identityService.changeCurrentUserPassword(this.form.value.oldPassword, this.form.value.newPassword)
        .subscribe(() => {
          this.saving = false;
          this.toasterService.popSuccess('Password changed successfully!');
        },
        (error) => {
          this.saving = false;
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error changing password.';
          }
        }
      );
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      newPassword: ['',  Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        Validators.pattern(/^(?=.*[^a-zA-Z])(?=.*[a-zA-Z]).{8,64}$/),
      ])],
      newPasswordRetype: ['', Validators.required],
      oldPassword: ['', Validators.required],
    }, {
      validator: confirmPasswordValidator('newPassword', 'newPasswordRetype'),
    });
  }
}
