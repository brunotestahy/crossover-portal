import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DfActiveModal } from '@devfactory/ngx-df';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { ApplicationNote } from 'app/core/models/application';
import { Manager } from 'app/core/models/manager';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';

@Component({
  selector: 'app-endorsement-comments',
  templateUrl: './endorsement-comments.component.html',
  styleUrls: ['./endorsement-comments.component.scss',
]})
export class EndorsementCommentsComponent implements OnInit {
  public loading = false;
  public avatarTypes = {} as { [key: string]: string };
  public notes = [] as ApplicationNote[];
  public form = new FormBuilder().group({
    selectedManager: [],
    note: ['', Validators.required],
  });
  public error: string | null;
  public managers: Manager[];
  public isAccountManager$: Observable<boolean>;

  constructor(
    private hireService: HireService,
    private identityService: IdentityService,
    public modal: DfActiveModal
  ) {
  }

  public ngOnInit(): void {
    this.parseAvatarTypes();
    this.loading = true;
    this.isAccountManager$ = this.identityService.currentUserIsAccountManager();

    this.hireService.getApplicationComment(
      this.modal.data.id,
      this.modal.data.avatarType,
      this.modal.data.type
    )
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe(
      res => this.notes =
        res.sort((previous, current) => {
          const previousDate = previous.createdOn as string;
          const currentDate = current.createdOn as string;
          return previousDate.localeCompare(currentDate);
        }),
      () => this.error = 'An unknown error occurred while retrieving HM notes data.'
    );
  }

  public submit(): void {
    this.hireService.postApplicationComment(
      this.modal.data.id,
      this.modal.data.avatarType,
      this.form.value.note,
      this.form.value.selectedManager,
      this.modal.data.type
    )
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe(
      () => this.modal.close(this.form.value.note),
      err => this.error = err.error.error.text
    );
  }

  public close(): void {
    this.modal.close();
  }

  private parseAvatarTypes(): void {
    const parsedAvatarTypes = Object.keys(AvatarTypes)
      .reduce(
        (carry, key) => {
          carry[AvatarTypes[key as keyof typeof AvatarTypes]] = key.replace(/([a-z])([A-Z])/g, '$1 $2');
          return carry;
        },
        {} as {[index: string]: string}
      );
    this.avatarTypes = parsedAvatarTypes;
  }
}
