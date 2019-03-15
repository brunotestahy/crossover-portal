import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  Candidate,
  CandidateLanguage,
  Language,
  LanguageProficiency,
} from 'app/core/models/candidate';

@Component({
  selector: 'app-language-form',
  templateUrl: 'language-form.component.html',
  styleUrls: ['language-form.component.scss'],
})
export class LanguageFormComponent implements OnInit {
  public form: FormGroup;

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();

  @Output()
  public cancel = new EventEmitter<void>();

  @Output()
  public remove = new EventEmitter<{
    languages: Partial<CandidateLanguage>[]
  }>();

  @Input()
  public languages = [] as Language[];

  @Input()
  public proficiencies = [] as LanguageProficiency[];

  @Input()
  public initialValue = {} as CandidateLanguage;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    const data = this.initialValue;
    const language = data.language || {};
    const defaultProficiency = this.proficiencies[0] || {};

    this.form = this.formBuilder.group({
      id: [data.id],
      language: [Language.findById(this.languages, language.id), Validators.required],
      proficiency: [ data.proficiency || defaultProficiency.id ],
    });
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.form.valid) {
      const languages = [this.form.value];
      this.save.emit({ languages });
    }
  }

  public onDelete(entry: CandidateLanguage): void {
    const languages = [{
      id: entry.id,
      markedToDelete: true,
    }];
    this.remove.emit({ languages });
  }
}
