import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Candidate } from 'app/core/models/candidate/';

@Component({
  selector: 'app-phone-form',
  templateUrl: './phone-form.component.html',
  styleUrls: ['./phone-form.component.scss'],
})
export class PhoneFormComponent implements OnInit {

  public form: FormGroup;

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();

  @Output()
  public cancel = new EventEmitter<void>();

  @Input()
  public initialValue = {} as Partial<Candidate>;

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      phone: [
          this.initialValue.location &&
          this.initialValue.location.phone || null,
          Validators.compose([
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(18),
            Validators.pattern(/^[0-9]+$/),
          ]),
      ],
    });
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.form.valid) {
      const phone = this.form.value;
      this.save.emit({
        location: phone,
      });
    }
  }
}
