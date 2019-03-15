import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Candidate } from 'app/core/models/candidate/';

@Component({
  selector: 'app-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.scss'],
})
export class NameFormComponent implements OnInit {
  public form: FormGroup;

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();

  @Output()
  public cancel = new EventEmitter<void>();

  @Input()
  public initialValue = {} as Partial<Candidate>;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: [this.initialValue.firstName, Validators.required],
      lastName: [this.initialValue.lastName, Validators.required],
    });
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

}
