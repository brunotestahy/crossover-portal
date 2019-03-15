import { AfterViewInit, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DfActiveModal, DfGroupToggle } from '@devfactory/ngx-df';

import * as endorsementConstants from 'app/core/constants/endorsement-filter/endorsement-filter';
import * as scoreType from 'app/core/constants/hire/score-type';
import { ScoreFieldsVisitor } from 'app/core/models/endorsement-filter';
import { AbstractTestVisitorFactory } from 'app/core/models/endorsement-filter/abstract-test-visitor-factory';
import {
  ScoreField,
  Test,
  TestDetails,
} from 'app/core/models/hire';

@Component({
  selector: 'app-endorsement-filter',
  templateUrl: './endorsement-filter.component.html',
  styleUrls: ['./endorsement-filter.component.scss'],
})
export class EndorsementFilterComponent implements OnInit, AfterViewInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public readonly applicationStatusModels = endorsementConstants.applicationStatusModels;
  public readonly tasks = endorsementConstants.tasks;
  public readonly scoreType = scoreType;

  public tests: Test[];
  @ViewChild('previewToggle')
  public previewToggle: DfGroupToggle;
  public previewItems: string[] = ['Yes', 'No', 'All'];
  public previewItemsSelected = '2';
  public scoreFields = [] as ScoreField[];

  public scoreFilters = new FormBuilder().group({});
  public form = new FormBuilder().group({
    createdOnFrom: [],
    createdOnTo: [],
    applicationStatus: [],
    tasks: [],
    totalScoreMin: [null, [Validators.min(0), Validators.max(100)]],
    totalScoreMax: [null, [Validators.min(0), Validators.max(100)]],
    keywordScoreMin: [null, [Validators.min(0), Validators.max(100)]],
    keywordScoreMax: [null, [Validators.min(0), Validators.max(100)]],
    hmRatingMin: [null, [Validators.min(0), Validators.max(100)]],
    hmRatingMax: [null, [Validators.min(0), Validators.max(100)]],
    previewToHM: [],
    scoreFilters: this.scoreFilters,
  });

  constructor(
    private modal: DfActiveModal
  ) {}

  public ngOnInit(): void {
    this.loadScoreFiltersInputs();
  }

  public ngAfterViewInit(): void {
    this.setPreviousFilters();
  }

  public submit(): void {
    let formObject = Object.assign(this.form.value);

    // Transform previewToHM to API mode
    if (formObject.previewToHM) {
      formObject.previewToHM = this.transformPreviewInAPIObject(formObject.previewToHM);
    }

    for (const key in formObject) {
      if (formObject.hasOwnProperty(key) && formObject[key] === null) {
        if (key === 'scoreFilters') {
          continue;
        }
        delete formObject[key];
      }
    }

    // Transform scoreFilters to API mode
    const scoreFilters = Object.assign([]);

    for (const key in formObject.scoreFilters) {
      if (formObject.scoreFilters.hasOwnProperty(key) && formObject.scoreFilters[key] === null) {
        delete formObject.scoreFilters[key];
      } else {
        this.scoreFields.forEach(scoreField => {
          if (scoreField.fields) {
            if (scoreField.fields.max === key) {
              scoreFilters.push(scoreField);

              // Get both just looping once
              scoreFilters[scoreFilters.length - 1].scoreMax = formObject.scoreFilters[key];
              scoreFilters[scoreFilters.length - 1].scoreMin = formObject.scoreFilters[scoreField.fields.min];
            }
          }
        });
      }
    }

    formObject = {
      ...formObject,
      scoreFilters,
    };

    if (!formObject.scoreFilters.length) {
      delete formObject.scoreFilters;
    }

    this.modal.close(formObject);
  }

  public close(): void {
    this.modal.close();
  }

  public clear(): void {
    this.previewToggle.selectItem(this.previewItems[2]);
    this.form.reset({
      applicationStatus: this.applicationStatusModels[0].value,
    });
  }

  private loadScoreFiltersInputs(): void {
    let fieldVisitor: AbstractTestVisitorFactory | null;
    this.modal.data[0].tests.forEach((test: TestDetails) => {
      fieldVisitor = AbstractTestVisitorFactory.getInstance(test.test.type, ScoreFieldsVisitor);
      if (fieldVisitor) {
        fieldVisitor.setFields(this.scoreFilters, this.scoreFields, test);
      }
    });
  }

  private setPreviousFilters(): void {
    if (Object.keys(this.modal.data[1]).length === 0) {
      return;
    }

    for (const keyForm in this.form.value) {
      if (this.form.value.hasOwnProperty(keyForm)) {
        for (const keyFilters in this.modal.data[1]) {
          if (this.modal.data[1].hasOwnProperty(keyFilters) && keyForm === keyFilters) {

            // Transform previewToHM to form object
            if (keyFilters === 'previewToHM') {
              this.transformPreviewInFormObject(this.modal.data[1].previewToHM, keyForm);

              continue;
            }

            if (keyFilters === 'scoreFilters') {
              continue;
            }

            this.form.patchValue({
              [keyForm]: this.modal.data[1][keyFilters],
            });
          }
        }
      }
    }

    // Transform scoreFilters to form object
    if (this.modal.data[1].scoreFilters) {
      for (const keyForm in this.form.value.scoreFilters) {

        if (this.form.value.scoreFilters.hasOwnProperty(keyForm)) {
          this.transformScoreFiltersInFormObject(keyForm);
        }
      }
    }
  }

  private transformPreviewInAPIObject(oldPreviewHM: string): boolean | null {
    switch (oldPreviewHM) {
      case this.previewItems[0]:
        return true;
      case this.previewItems[1]:
        return false;
      default:
        return null;
    }
  }

  private transformPreviewInFormObject(oldPreviewHM: boolean, formProperty: string): void {
    if (oldPreviewHM) {
      this.form.patchValue({
        [formProperty]: this.previewItems[0],
      });
      return;
    }
    this.form.patchValue({
      [formProperty]: this.previewItems[1],
    });
  }

  private transformScoreFiltersInFormObject(formProperty: string): void {
    for (const filter of this.modal.data[1].scoreFilters) {
      if (formProperty === filter.fields.max) {
        this.form.controls.scoreFilters.patchValue({
          [formProperty]: filter.scoreMax,
        });
      }

      if (formProperty === filter.fields.min) {
        this.form.controls.scoreFilters.patchValue({
          [formProperty]: filter.scoreMin,
        });
      }
    }
  }
}
