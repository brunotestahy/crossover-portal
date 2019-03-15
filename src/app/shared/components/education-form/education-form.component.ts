import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Candidate, Education } from 'app/core/models/candidate';
import {
  DateIsSameOrAfterValidator,
  DateIsSameOrBeforeValidator,
} from 'app/shared/validators/date/';

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss'],
})
export class EducationFormComponent implements OnInit {
  public form: FormGroup;
  public yearRange = Education.getYearRange(
    new Date().getFullYear()
  );

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();

  @Output()
  public cancel = new EventEmitter<void>();

  @Output()
  public remove = new EventEmitter<{
    educations: Partial<Education>[]
  }>();

  @Input()
  public set initialValue(value: Education) {
    setTimeout(() => {
      /* istanbul ignore else */
      if (this.form) {
        this.form.patchValue({
          ...this.form.value,
          ...value,
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
      degree: [null],
      startDate: [null],
      endDate: [null],
      school: [null, Validators.required],
    });
    this.form.controls['startDate']
      .setValidators(DateIsSameOrAfterValidator(this.form.controls['endDate']));
    this.form.controls['endDate']
      .setValidators(DateIsSameOrBeforeValidator(this.form.controls['startDate']));
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.form.valid) {
      const educations = [this.form.value];
      this.save.emit({ educations });
    }
  }

  public onDelete(entry: Education): void {
    const educations = [
      {id: entry.id, markedToDelete: true },
    ];
    this.remove.emit({ educations });
  }
}
