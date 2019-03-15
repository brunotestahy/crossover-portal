import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { Assignment } from 'app/core/models/assignment';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-change-contractor-avatar',
  templateUrl: './change-contractor-avatar.component.html',
  styleUrls: ['./change-contractor-avatar.component.scss'],
})
export class ChangeContractorAvatarComponent implements OnInit {

  @Input()
  public assignment: Assignment;

  @Output()
  public close: EventEmitter<{}> = new EventEmitter();

  public error = '';
  public isLoading: boolean = true;
  public isSaving: boolean = false;

  public selectedAvatar: number | undefined;

  public avatars: string[] = Array.from({ length: 8 });

  constructor(private assignmentService: AssignmentService) {
  }

  public ngOnInit(): void {
    this.assignmentService.getAssignmentById(this.assignment.id.toString())
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        assignment => this.selectedAvatar = assignment.assignmentAvatar ? assignment.assignmentAvatar.id : undefined,
        negativeResponse => {
          if (isApiError(negativeResponse)) {
            this.error = negativeResponse.error.text;
          } else {
            this.error = 'Error trying to fetch the contractor avatar.';
          }
        },
      );
  }

  public onClose(): void {
    this.close.emit();
  }

  public saveAvatar(): void {
    this.isSaving = true;
    this.error = '';
    this.assignmentService.saveContractorAvatar(
      this.assignment.id.toString(),
      (this.selectedAvatar as number).toString())
      .pipe(finalize(() => this.isSaving = false))
      .subscribe(
        () => this.onClose(),
        negativeResponse => {
          if (isApiError(negativeResponse)) {
            this.error = negativeResponse.error.text;
          } else {
            this.error = 'Error trying to save the contractor avatar.';
          }
        },
      );
  }

  public isSelectedClass(index: number): boolean {
    return index === this.selectedAvatar;
  }

  public selectAvatar(index: number): void {
    this.selectedAvatar = index;
  }
}
