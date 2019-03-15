import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Candidate, CandidateSkill } from 'app/core/models/candidate';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss'],
})
export class SkillListComponent {
  @Input()
  public edit = false;

  @Input()
  public isEditable = true;
  @Output()
  public editChange = new EventEmitter<boolean>();

  @Input()
  public candidateSkills: CandidateSkill[];

  @Output()
  public delete = new EventEmitter<Partial<Candidate>>();

  public onEdit(edit: boolean): void {
    /* istanbul ignore else */
    if (!this.edit) {
      this.editChange.emit(this.edit = edit);
    }
  }

  public onDelete(entry: CandidateSkill): void {
    /* istanbul ignore else */
    if (this.edit) {
      const skills = [{ ...entry, markedToDelete: true }];
      this.delete.emit({ skills });
    }
  }
}
