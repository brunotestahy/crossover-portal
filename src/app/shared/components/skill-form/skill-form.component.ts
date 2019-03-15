import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DfSelect } from '@devfactory/ngx-df';

import { Candidate, Skill } from 'app/core/models/candidate';

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.scss'],
})
export class SkillFormComponent implements OnInit {
  public form: FormGroup;

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();
  @Output()
  public cancel = new EventEmitter<void>();
  @Output()
  public filter = new EventEmitter<string>();

  @Input()
  public skills = [] as Skill[];

  @ViewChild(DfSelect)
  public selector: DfSelect;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [null],
      skill: [null, Validators.required],
    });
    this.selector.filterOptions = this.onSearch.bind(this);
  }

  public onSearch(): void {
    const searchTerm = this.selector.dfSelectFilterText;
    this.filter.emit(searchTerm);
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.form.valid) {
      const skills = [{ ...this.form.value, proficiency: 0 }];
      this.save.emit({ skills });
    }
  }
}
