import { Component, HostBinding, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, startWith, switchMap } from 'rxjs/operators';

import { Country } from 'app/core/models/country';
import { ResidenceInfo } from 'app/core/models/residence-info';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { CommonService } from 'app/core/services/common/common.service';
import { IdentityService } from 'app/core/services/identity/identity.service';


@Component({
  selector: 'app-setup-residence',
  templateUrl: './setup-residence.component.html',
  styleUrls: ['./setup-residence.component.scss'],
})
export class SetupResidenceComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'flex-grow';

  public form: FormGroup;
  public personalInfoGroup: FormGroup;
  public entityInfoGroup: FormGroup;
  public secondaryCitizenshipControl: FormControl;
  public tertiaryCitizenshipControl: FormControl;

  public countries: Country[] = [];
  public error: string | null;
  public isPending = false;
  public ieFixClass = '';
  public assignmentId = 0;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private assignmentService: AssignmentService,
    private commonService: CommonService,
    private identityService: IdentityService
  ) {
  }

  public ngOnInit(): void {
    this.buildForm();
    this.fetchCountries();
    this.fetchAssignmentId();
  }

  public onSubmit(): void {
    if (this.form.valid && !this.isPending) {
      this.isPending = true;
      this.error = null;

      const newResidenceInfo: ResidenceInfo = {
        workingThroughEntity: this.form.value.workingThroughEntity,
      };

      if (this.form.value.workingThroughEntity) {
        newResidenceInfo.entityInfo = this.form.value.entityInfo;
      } else {
        newResidenceInfo.personalInfo = this.form.value.personalInfo;
      }

      this.identityService.saveResidenceInfo(newResidenceInfo)
        .pipe(
          finalize(() => this.isPending = false),
          switchMap(() => this.assignmentService.candidateProvidesResidenceInfo(this.assignmentId))
        )
        .subscribe(
          () => this.router.navigate(['../setup-payment'], { relativeTo: this.activatedRoute }),
          error => this.error = error && error.error ?
            error.error.text :
            'An unknown error happened while attempting to store residence info.'
        );
    }
  }

  public addCitizenship(): void {
    this.ieFixClass = 'ie-fix';
    if (this.secondaryCitizenshipControl.disabled) {
      this.secondaryCitizenshipControl.enable();
    } else {
      this.tertiaryCitizenshipControl.enable();
    }
  }

  public removeCitizenship(): void {
    if (this.tertiaryCitizenshipControl.enabled) {
      this.tertiaryCitizenshipControl.disable();
      this.tertiaryCitizenshipControl.reset();
      return;
    }
    this.secondaryCitizenshipControl.disable();
    this.secondaryCitizenshipControl.reset();
    this.ieFixClass = '';
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      workingThroughEntity: [false],
      personalInfo: this.formBuilder.group({
        title: [null, Validators.required],
        address1: ['', Validators.required],
        address2: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
        country: [null, Validators.required],
        primaryCitizenship: [null, Validators.required],
        secondaryCitizenship: [],
        tertiaryCitizenship: [],
      }),
      entityInfo: this.formBuilder.group({
        name: ['', Validators.required],
        country: [null, Validators.required],
        address1: ['', Validators.required],
        address2: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
      }),
    });

    this.personalInfoGroup = this.form.controls.personalInfo as FormGroup;
    this.entityInfoGroup = this.form.controls.entityInfo as FormGroup;
    this.secondaryCitizenshipControl = this.personalInfoGroup.controls
      .secondaryCitizenship as FormControl;
    this.tertiaryCitizenshipControl = this.personalInfoGroup.controls
      .tertiaryCitizenship as FormControl;

    this.form.controls.workingThroughEntity.valueChanges
      .pipe(startWith(false))
      .subscribe((isWorkingThroughEntity: boolean) => {
        if (isWorkingThroughEntity) {
          this.personalInfoGroup.disable();
          return this.entityInfoGroup.enable();
        }
        this.personalInfoGroup.enable();
        this.entityInfoGroup.disable();
        if (!this.secondaryCitizenshipControl.value) {
          this.secondaryCitizenshipControl.disable();
          this.tertiaryCitizenshipControl.disable();
          this.tertiaryCitizenshipControl.reset();
        } else if (!this.tertiaryCitizenshipControl.value) {
          this.tertiaryCitizenshipControl.disable();
        }
      });

    this.secondaryCitizenshipControl.disable();
    this.tertiaryCitizenshipControl.disable();
  }

  private fetchAssignmentId(): void {
    const parentRoute = this.activatedRoute.parent as ActivatedRoute;
    this.assignmentId = parentRoute.snapshot.params['id'];
  }

  private fetchCountries(): void {
    this.commonService.getCountries()
      .subscribe(
        countries => this.countries = countries,
        () => this.error = 'An error occurred while loading country data.'
      );
  }
}
