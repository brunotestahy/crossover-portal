import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sprintf } from 'sprintf-js';

import { Candidate } from 'app/core/models/candidate/';

@Component({
  selector: 'app-availability-form',
  templateUrl: './availability-form.component.html',
  styleUrls: ['./availability-form.component.scss'],
})
export class AvailabilityFormComponent implements OnInit {

  public form: FormGroup;

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();

  @Input()
  public availabilities: string[];

  @Input()
  public displayFormat = '';

  @Input()
  public set initialValue(value: Partial<Candidate>) {
    // This form is visible on page load at parent, so the data association
    // must be done outside ngOnInit()
    /* istanbul ignore else */
    if (this.form) {
      this.form.controls['availability'].setValue(value.availability);
    }
  }

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      availability: [null, Validators.required],
    });
  }

  public optionsTransform(value: string): string {
    return sprintf(this.displayFormat, value);
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

}
