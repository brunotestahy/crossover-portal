import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Candidate, Certification } from 'app/core/models/candidate';
import {
  DateIsSameOrAfterValidator,
  DateIsSameOrBeforeValidator,
} from 'app/shared/validators/date';

@Component({
  selector: 'app-certification-form',
  templateUrl: './certification-form.component.html',
  styleUrls: ['./certification-form.component.scss'],
})
export class CertificationFormComponent implements OnInit {
  public form: FormGroup;

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();

  @Output()
  public cancel = new EventEmitter<void>();

  @Output()
  public remove = new EventEmitter<{
    certifications: Partial<Certification>[]
  }>();

  @Input()
  public set initialValue(value: Partial<Certification>) {
    setTimeout(() => {
      const certification = Certification.from(value);
      /* istanbul ignore else */
      if (this.form) {
        this.form.patchValue({
          ...this.form.value,
          ...value,
          startDateTime: certification.startAsDate,
          endDateTime: certification.endAsDate,
        });
      }
    });
  }

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      startDateTime: [null],
      endDateTime: [null],
    });
    this.form.controls['startDateTime']
      .setValidators(DateIsSameOrAfterValidator(this.form.controls['endDateTime']));
    this.form.controls['endDateTime']
      .setValidators(DateIsSameOrBeforeValidator(this.form.controls['startDateTime']));
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.form.valid) {
      const certifications = [this.form.value];
      this.save.emit({ certifications });
    }
  }

  public onDelete(entry: Partial<Certification>): void {
    const certifications = [
      {id: entry.id, markedToDelete: true },
    ];
    this.remove.emit({ certifications });
  }
}
