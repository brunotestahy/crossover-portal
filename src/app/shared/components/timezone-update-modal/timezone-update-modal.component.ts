import { Component, OnInit } from '@angular/core';
import { DfActiveModal } from '@devfactory/ngx-df';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { finalize, take } from 'rxjs/operators';

import { CurrentUserDetail } from 'app/core/models/identity';
import { EnvironmentTimezone } from 'app/core/models/identity';
import { IdentityService } from 'app/core/services/identity/identity.service';

@Component({
  selector: 'app-timezone-update-modal',
  templateUrl: './timezone-update-modal.component.html',
  styleUrls: ['./timezone-update-modal.component.scss'],
})
export class TimezoneUpdateModalComponent implements OnInit {
  public isLoading = false;
  public isSaving = false;
  public environmentTimezone: EnvironmentTimezone | null = null;
  public currentTimeZone: string;
  public user: CurrentUserDetail;
  public error: string | null = null;

  constructor(
    private identityService: IdentityService,
    private activeModal: DfActiveModal
  ) {
  }

  public ngOnInit(): void {
    this.isLoading = true;
    combineLatest(
      this.identityService.getCurrentUser(),
      this.identityService.getEnvironmentTimezone()
    )
    .pipe(
      take(1),
      finalize(() => this.isLoading = false)
    )
    .subscribe(
      ([user, environmentTimezone]) => {
        this.user = user as CurrentUserDetail;
        this.environmentTimezone = environmentTimezone;
      },
      () => this.environmentTimezone = null
    );
  }

  public change(): void {
    this.activeModal.close(true);
  }

  public close(): void {
    this.activeModal.close(false);
  }
}
