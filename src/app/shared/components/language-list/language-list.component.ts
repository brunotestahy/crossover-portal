import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CandidateLanguage, LanguageProficiency } from 'app/core/models/candidate';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss'],
})
export class LanguageListComponent {
  public proficiencies = LanguageProficiency;

  @Input()
  public candidateLanguages: CandidateLanguage[];

  @Input()
  public isEditable = true;

  @Input()
  public selectedEntry: CandidateLanguage;

  @Output()
  public selectedEntryChange = new EventEmitter<CandidateLanguage>();

  public onSelect(entry: CandidateLanguage): void {
    this.selectedEntryChange.emit(this.selectedEntry = entry);
  }
}
