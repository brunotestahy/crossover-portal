import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Candidate, Certification } from 'app/core/models/candidate';

@Component({
  selector: 'app-certification-list',
  templateUrl: './certification-list.component.html',
  styleUrls: ['./certification-list.component.scss'],
})
export class CertificationListComponent {
  @Input()
  public certifications: Certification[];

  @Input()
  public isEditable = true;

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();

  @Output()
  public remove = new EventEmitter<Partial<Candidate>>();

  @Output()
  public edit = new EventEmitter<Certification>();

  @Output()
  public cancel = new EventEmitter<boolean>();

  @Input()
  public selectedEntry: Certification;

  @Output()
  public selectedEntryChange = new EventEmitter<Certification>();

  public onEdit(entry: Certification): void {
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
