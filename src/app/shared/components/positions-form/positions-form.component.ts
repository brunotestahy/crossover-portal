import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { Candidate, Employment } from 'app/core/models/candidate';
import { Country } from 'app/core/models/country';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss'],
})
export class PositionsFormComponent implements OnInit {
  private employment = {} as Employment;
  public form: FormGroup;

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();
  @Output()
  public cancel = new EventEmitter<void>();
  @Output()
  public remove = new EventEmitter<{ employments: Partial<Employment>[] }>();

  @Input()
  public set initialValue(value: Employment) {
    // This value can be changed after the form is rendered, so we're utilising
    // getter and setter against a private property to reflect its changes to form
    this.employment = value;
    /* istanbul ignore else */
    if (this.form) {
      this.form.patchValue(value);
    }
  }
  public get initialValue(): Employment {
    return this.employment;
  }

  @Input()
  public countries: Country[] = [];

  public roles = Employment.roles;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [this.initialValue.id],
      city: [this.initialValue.city],
      company: [this.initialValue.company, Validators.required],
      country: [
        Country.findById(
          this.countries,
          this.initialValue.country && this.initialValue.country.id || 0
        ),
      ],
      current: [this.initialValue.current],
      description: [this.initialValue.description],
      startDate: [
        this.initialValue.startDate && moment(this.initialValue.startDate).startOf('day').toDate() || null,
      ],
      endDate: [
        this.initialValue.endDate && moment(this.initialValue.endDate).startOf('day').toDate() || null,
      ],
      role: [this.initialValue.role],
      title: [this.initialValue.title, Validators.required],
    });
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.form.valid) {
      const employments = [this.form.value];
      this.save.emit({ employments });
    }
  }

  public onDelete(entry: Employment): void {
    const employments = [
      {id: entry.id, markedToDelete: true },
    ];
    this.remove.emit({ employments });
  }
}
