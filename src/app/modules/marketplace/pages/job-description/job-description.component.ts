import { Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DfValidationMessagesMap } from '@devfactory/ngx-df';

import { Country } from 'app/core/models/country';
import { JobDetails } from 'app/core/models/hire';
import { CurrentUserDetail } from 'app/core/models/identity';
import { CommonService } from 'app/core/services/common/common.service';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';

import { tap } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators/switchMap';
import { Subject } from 'rxjs/Subject';

const MAX_FILE_SIZE_IN_BYTES = 1048576;

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss'],
})
export class JobDescriptionComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  public readonly classes = 'flex-grow';

  public showHighway = false;
  public isAnonymous: boolean;
  public prerequisitesError: { text: string } | null;
  public isApplicationAllowed = true;
  public isError = false;
  public responseError:  { text: string } | null;
  public job: JobDetails;
  public isLoading = false;
  public isEmailExist = false;


  @ViewChild('top', { read: ElementRef })
  public topElement: ElementRef;
  @ViewChild('apply', { read: ElementRef })
  public applyElement: ElementRef;
  public form: FormGroup;
  public countries: Country[];
  public allowedCountries: Country[];
  public forbiddenCountries: Country[];
  public countryTooltip: string;
  public currentUser: CurrentUserDetail;


  public passwordMessages: DfValidationMessagesMap = {
    pattern: () => 'At least 8 characters, 1 letter and a number or symbol',
  };
  public nameMessages: DfValidationMessagesMap = {
    pattern: () => 'First name and last name are required',
  };
  public isApplying: boolean;
  public destroy$ = new Subject();

  public fileExtensionError = false;
  public fileSizeError = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hireService: HireService,
    private identityService: IdentityService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.createForm();
    this.getCurrentUser();
    this.getCountryList();
    this.getJobDetails();
  }

  public createForm(): void {
    this.form = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^((\b[a-zA-Z]{1,40}\b)\s*){2,}$/)]),
      ],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
        ]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(?=.*[^a-zA-Z])(?=.*[a-zA-Z]).{8,64}$/),
        ]),
      ],
      country: [null, Validators.required],
      resume: [null, Validators.required],
      recaptcha: [null, Validators.required],
    });
  }

  public getCountryList(): void {
    this.commonService.getCountries().subscribe((countries) => {
      this.countries = countries;
      this.allowedCountries = countries.filter(c => c.allowed);
      this.forbiddenCountries = countries.filter(c => c.allowed === false);
      this.countryTooltip = `<p> It is a violation of US law and/or regulation to engage any individual or entity
            who is a citizen or resident of a country listed below as a service provider.
            If you are a resident and/or citizen of a country listed below, please do not proceed.
            </p>
            ${this.forbiddenCountries.map(country => country.name).join(',<br>')}`;
          });
  }

  public getCurrentUser(): void {
    if (this.identityService.isUserLogged()) {
      this.identityService.getCurrentUser()
      .subscribe(user => {
          this.currentUser = user as CurrentUserDetail;
          this.isAnonymous = false;
          this.disableFormFields();
        },
        () => this.isAnonymous = true
      );
    } else {
      this.isAnonymous = true;
    }
  }

  public disableFormFields(): void {
    this.form.controls.name.disable();
    this.form.controls.email.disable();
    this.form.controls.password.disable();
    this.form.controls.country.disable();
    this.form.controls.recaptcha.disable();
  }

  public getJobDetails(): void {
    this.activatedRoute.params.pipe(
      tap(() => this.isLoading = true),
      switchMap(p => this.hireService.getJob(p.id))
    )
    .subscribe(job => {
      this.job = job;
      if (this.currentUser) {
        this.getPrerequisitesForJob(this.job.id);
      } else {
        this.isLoading = false;
      }
    });
  }

  public getPrerequisitesForJob(jobid: number): void {
    this.hireService.getPrerequisitesForJob(jobid)
    .subscribe(() => {
      this.prerequisitesError = null;
      this.isApplicationAllowed = true;
      this.isLoading = false;
    }, err => {
      if (err.error && err.error.type === 'ERROR') {
        this.prerequisitesError = err.error;
        this.isApplicationAllowed = false;
        this.isLoading = false;
      }
    });
  }

  public scrollToApply(): void {
    this.applyElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  public scrollToTop(): void {
    this.topElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  public isEmailUnique(input: {
    valid: boolean,
    value: string
  }): void {
    const emailControl = this.form.controls['email'];

    if (input.valid === true) {
      this.identityService.checkEmailExistence(input.value)
      .subscribe(res => {
        this.isEmailExist = res;
        if (this.isEmailExist) {
          emailControl.setErrors({ incorrect: true });
        }
      });
    } else {
      this.isEmailExist = false;
      emailControl.setErrors({ incorrect: false });
    }
  }

  public onFileChange(e: Event): void {
    const inputElement = e.target as HTMLInputElement;
    if (
      inputElement.files &&
      inputElement.files.length > 0 &&
      this.validFileExtension(inputElement.files[0])
    ) {
      const file = inputElement.files[0];
      this.form.patchValue({ resume: file });
    } else {
      this.form.patchValue({ resume: null });
    }
  }

  public get fileName(): string {
    return this.form.value.resume.name.split('\\').pop();
  }

  public clearFile(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    this.form.patchValue({ resume: null });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.isApplying = true;
      if (this.isAnonymous) {
        this.hireService.applyToJobAsAnonymousUser(this.form, this.job.id)
        .subscribe(response => {
          this.isApplying = false;
          this.router.navigate(['../../verify/' + response.id], {
            relativeTo: this.activatedRoute,
          });
        }, err => {
          this.isApplying = false;
          this.isError = true;
          this.responseError = err.error;
          this.scrollToTop();
        });
      } else {
        this.hireService
        .applyToJobAsAuthenticatedUser(this.currentUser, this.job.id, this.form.value.resume)
        .subscribe(
          () => this.showHighway = true,
          err => {
            this.isApplying = false;
            this.isError = true;
            this.responseError = err.error;
            this.scrollToTop();
        });
      }
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private validFileExtension(file: File): boolean {
    const fileName = file.name;
    const allowedExtensions = [
      '.pdf',
      '.md',
      '.doc',
      '.docx',
      '.xml',
      '.txt',
    ];
    let validExtension = false;
    allowedExtensions.forEach(extension => {
      validExtension = validExtension ||
        (fileName.lastIndexOf(extension) > 0 &&
         fileName.lastIndexOf(extension) === fileName.length - extension.length);
    });

    this.fileExtensionError = !validExtension;
    this.fileSizeError = file.size > MAX_FILE_SIZE_IN_BYTES;

    return !this.fileExtensionError && !this.fileSizeError;
  }
}
