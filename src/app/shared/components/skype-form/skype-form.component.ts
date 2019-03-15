import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Candidate } from 'app/core/models/candidate/';

@Component({
  selector: 'app-skype-form',
  templateUrl: './skype-form.component.html',
  styleUrls: ['./skype-form.component.scss'],
})
export class SkypeFormComponent implements OnInit {
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
      skypeId: [this.initialValue.skypeId, Validators.required],
    });
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
