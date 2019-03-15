import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Candidate } from 'app/core/models/candidate/';

@Component({
  selector: 'app-headline-form',
  templateUrl: './headline-form.component.html',
  styleUrls: ['./headline-form.component.scss'],
})
export class HeadlineFormComponent implements OnInit {
  public form: FormGroup;

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();

  @Output()
  public cancel = new EventEmitter<void>();

  @Input()
  public initialValue = {} as Candidate;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      headline: [this.initialValue.headline, Validators.required],
    });
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

}
