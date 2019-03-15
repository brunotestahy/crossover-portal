import { Component, OnInit } from '@angular/core';
import { DfActiveModal } from '@devfactory/ngx-df';

import { WorkDiaryWithFlags } from 'app/core/models/logbook';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-delete-timecards-modal',
  templateUrl: './delete-timecards-modal.component.html',
  styleUrls: ['./delete-timecards-modal.component.scss'],
})
export class DeleteTimecardsModalComponent implements OnInit {

  public isSaving = false;
  public error: string | null;
  public diaries: WorkDiaryWithFlags[];
  public is12HFormat: boolean;
  public readonly HOUR_FORMAT12 = 'hh:mm a';
  public readonly HOUR_FORMAT24 = 'HH:mm';

  constructor(
    private activeModal: DfActiveModal,
    private timetrackingService: TimetrackingService
  ) {}

  public ngOnInit(): void {
    this.diaries = this.activeModal.data.diaries;
    this.is12HFormat = this.activeModal.data.is12HFormat;
  }

  public deleteTimecards(): void {
    this.isSaving = true;
    this.error = null;
    const ids = this.diaries.map(diary => diary.id);
    this.timetrackingService.deleteTimecards(ids)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe(() => this.activeModal.close('OK'),
      () => this.error = 'Error deleting timecards.');
  }

  public getHourFormat(): string {
    return this.is12HFormat ? this.HOUR_FORMAT12 : this.HOUR_FORMAT24;
  }

  public close(): void {
    this.activeModal.close();
  }
}
