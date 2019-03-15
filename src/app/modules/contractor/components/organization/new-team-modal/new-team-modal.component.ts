import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DfActiveModal } from '@devfactory/ngx-df';

import { CurrentUserDetail } from 'app/core/models/identity';
import { TeamStoreRequest } from 'app/core/models/team';

@Component({
  selector: 'app-new-team-modal',
  templateUrl: './new-team-modal.component.html',
  styleUrls: ['./new-team-modal.component.scss'],
})
export class NewTeamModalComponent implements OnInit {
  public formGroup: FormGroup;
  public isLoading = true;
  public error = '';
  public userDetail: CurrentUserDetail;

  @Output()
  public data = new EventEmitter<TeamStoreRequest>();

  constructor(
    private activeModal: DfActiveModal,
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  public submit(): void {
    this.data.emit({
      ...this.formGroup.value,
      teamOwner: this.userDetail
    });
  }

  public close(): void {
    this.activeModal.close(null);
  }
}
