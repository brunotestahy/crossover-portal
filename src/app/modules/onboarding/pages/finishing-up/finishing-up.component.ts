import { Component, HostBinding, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';

import { CurrentUserDetail } from 'app/core/models/identity';
import { IdentityService } from 'app/core/services/identity/identity.service';

@Component({
  selector: 'app-finishing-up',
  templateUrl: './finishing-up.component.html',
  styleUrls: ['./finishing-up.component.scss'],
})
export class FinishingUpComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex align-items-center flex-grow';

  public error: string | null = null;
  public detail: CurrentUserDetail;
  public managerName: string;
  public isLoading = true;
  public managerAvatar: SafeResourceUrl;

  constructor(
    private identityService: IdentityService,
    private sanitizer: DomSanitizer
  ) {
  }

  public ngOnInit(): void {
    this.identityService.getCurrentUserDetail()
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(
      response => {
        this.detail = response;
        this.managerName = this.detail.assignment.manager.printableName as string;
        if (this.detail.assignment.manager.photoUrl) {
          this.managerAvatar = this.sanitizer.bypassSecurityTrustResourceUrl(this.detail.assignment.manager.photoUrl);
        }
      },
      negativeResponse => this.error = negativeResponse.error.text
    );
  }
}
