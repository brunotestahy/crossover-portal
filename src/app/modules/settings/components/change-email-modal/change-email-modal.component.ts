import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DfActiveModal, DfToasterService } from '@devfactory/ngx-df';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { CurrentUserDetail } from 'app/core/models/identity';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { isApiError } from 'app/core/type-guards/is-api-error';
import { EmailOrEmpty } from 'app/shared/validators/email';

@Component({
  selector: 'app-change-email-modal',
  templateUrl: './change-email-modal.component.html',
  styleUrls: ['./change-email-modal.component.scss'],
})
export class ChangeEmailModalComponent {
  public emailControl: FormControl = new FormControl(
    '',
    Validators.compose([Validators.required, EmailOrEmpty])
  );

  public isLoading = false;

  public currentUser$: Observable<CurrentUserDetail | null>;

  public error: string | null = null;

  constructor(
    private identityService: IdentityService,
    private activeModal: DfActiveModal,
    private toasterService: DfToasterService
  ) {
    this.currentUser$ = this.identityService.getCurrentUser();
  }

  public submit(): void {
    if (this.emailControl.valid) {
      this.isLoading = true;
      this.error = null;
      this.identityService
        .changeCurrentUserEmail(this.emailControl.value)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe(() => {
          this.activeModal.close();
          this.toasterService.popSuccess(
            'A confirmation email was sent to your new email.'
          );
        },
        (error) => {
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error changing email.';
          }
        }
      );
    }
  }

  public close(): void {
    this.activeModal.close();
  }
}
