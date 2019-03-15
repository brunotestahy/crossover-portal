import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Candidate, Education } from 'app/core/models/candidate';

@Component({
  selector: 'app-education-list',
  templateUrl: './education-list.component.html',
  styleUrls: ['./education-list.component.scss'],
})
export class EducationListComponent {

  @Input()
  public educations: Education[];

  @Input()
  public isEditable = true;

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();

  @Output()
  public remove = new EventEmitter<Partial<Candidate>>();

  @Output()
  public edit = new EventEmitter<Education>();

  @Output()
  public cancel = new EventEmitter<boolean>();

  @Input()
  public selectedEntry: Education;

  @Output()
  public selectedEntryChange = new EventEmitter<Education>();

  public onEdit(entry: Education): void {
    this.selectedEntry = entry;
    this.edit.emit(entry);
  }

  public onSave(entry: Partial<Candidate>): void {
    this.save.emit(entry);
  }

  public onCancel(): void {
    Object.assign(this, { selectedEntry: null });
    this.cancel.emit(true);
  }

  public onDelete(entry: Partial<Candidate>): void {
    this.remove.emit(entry);
  }
}
