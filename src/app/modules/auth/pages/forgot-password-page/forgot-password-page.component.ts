import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss'],
})
export class ForgotPasswordPageComponent implements OnInit {

  public error: string | null;
  public pending = false;
  public success = false;

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder, private identityService: IdentityService) {}

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  public onSubmit(): void {
    if (this.form.valid && !this.pending) {
      this.pending = true;
      this.error = null;
      this.identityService.forgotPassword(this.form.value)
        .subscribe(
          () => {
            this.pending = false;
            this.success = true;
          },
          (error) => {
            this.pending = false;
            if (isApiError(error)) {
              this.error = error.error.text;
            } else {
              this.error = 'Error requesting the forgot password email.';
            }
          }
        );
    }
  }

}
