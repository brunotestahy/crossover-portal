import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DfActiveModal } from '@devfactory/ngx-df';

import { WorkDiaryWithFlags } from 'app/core/models/logbook';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';

@Component({
  selector: 'app-timecards-not-idle-modal',
  templateUrl: './timecards-not-idle-modal.component.html',
  styleUrls: ['./timecards-not-idle-modal.component.scss'],
})
export class TimecardsNotIdleModalComponent implements OnInit {
  public isSaving = false;
  public error: string | null;

  public form: FormGroup = new FormGroup({
    reason: new FormControl(null, Validators.required),
  });
  public idleTimeCards: WorkDiaryWithFlags[] = [];

  public readonly MODAL_CLOSE_ACTION = {
    no: 'No',
    yes: 'Yes',
  };

  constructor(private activeModal: DfActiveModal,
              private timetrackingService: TimetrackingService) {}

  public ngOnInit(): void {
    this.idleTimeCards = this.activeModal.data.selectedIdleCards;
  }

  public saveNotIdle(): void {
    if (this.form.valid && !this.isSaving) {
      this.isSaving = true;
      this.error = null;
      const action = 'SET_MEETING_TIME';

      this.timetrackingService.addWorkdiaryAction({
        action,
        assignmentId: this.activeModal.data.assignmentId as number,
        comment: this.form.value.reason as string,
        timecards: this.idleTimeCards.map(card => card.id),
      }).subscribe(
        () => this.activeModal.close(this.MODAL_CLOSE_ACTION.yes),
        (negativeResponse) => {
          this.error = negativeResponse.error.text;
          this.isSaving = false;
        }
      );
    }
  }

  public close(): void {
    this.activeModal.close(this.MODAL_CLOSE_ACTION.no);
  }
}
