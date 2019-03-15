import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdentityService } from 'app/core/services/identity/identity.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent {
  @HostBinding('class')
  public readonly classes = 'flex-grow flex-item-align-center';

  public isSending = false;

  constructor(private activatedRoute: ActivatedRoute, private identityService: IdentityService) { }

  public resend(): void {
    this.isSending = true;
    this.identityService.resendActivation(this.activatedRoute.snapshot.params['applicationId'])
      .subscribe(() => {
        this.isSending = false;
      });
  }
}
