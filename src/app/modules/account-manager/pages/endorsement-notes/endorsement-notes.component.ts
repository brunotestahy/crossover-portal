import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DfActiveModal } from '@devfactory/ngx-df';
import { finalize } from 'rxjs/operators';

import { ApplicationNote } from 'app/core/models/application';
import { HireService } from 'app/core/services/hire/hire.service';

@Component({
  selector: 'app-endorsement-notes',
  templateUrl: './endorsement-notes.component.html',
  styleUrls: ['./endorsement-notes.component.scss'],
})
export class EndorsementNotesComponent implements OnInit {
  public loading = false;
  public notes = [] as ApplicationNote[];
  public form = new FormBuilder().group({ note: ['', [Validators.required]] });
  public error: string | null;

  constructor(
    private hire: HireService,
    private modal: DfActiveModal
  ) {
  }

  public ngOnInit(): void {
    this.loading = true;

    this.hire.getApplicationNotes(
      this.modal.data.id,
      this.modal.data.avatarType,
      this.modal.data.noteType
    )
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe(
      res => this.notes =
        res.sort((previous, current) => {
          const previousDate = previous.createdOn as string;
          const currentDate = current.createdOn as string;
          return currentDate.localeCompare(previousDate);
        }),
      () => this.error = 'An unknown error occurred while retrieving application notes data.'
    );
  }

  public submit(): void {
    this.loading = true;

    this.hire.postApplicationNote(
      this.modal.data.id,
      this.modal.data.avatarType,
      this.modal.data.noteType,
      this.form.value.note
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
}
