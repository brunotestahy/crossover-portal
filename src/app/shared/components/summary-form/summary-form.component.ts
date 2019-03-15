import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Candidate } from 'app/core/models/candidate';

@Component({
  selector: 'app-summary-form',
  templateUrl: './summary-form.component.html',
  styleUrls: ['./summary-form.component.scss'],
})
export class SummaryFormComponent implements OnInit {
  public form: FormGroup;

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();
  @Output()
  public cancel = new EventEmitter<boolean>();

  @Input()
  public initialValue: string | null;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      summary: [this.initialValue],
    });
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

  public onCancel(): void {
    this.cancel.emit(true);
  }
}
