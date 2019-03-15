import {
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BubbleWizardEvent, BubbleWizardStep, DfValidationMessagesMap } from '@devfactory/ngx-df';
import { Country } from 'app/core/models/country';
import { JobDetails, VisiblePipelineVariants } from 'app/core/models/hire';
import { CommonService } from 'app/core/services/common/common.service';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CurrentUserDetail } from 'app/core/models/identity';

@Component({
  selector: 'app-pipeline-description',
  templateUrl: './pipeline-description.component.html',
  styleUrls: ['./pipeline-description.component.scss'],
})
export class PipelineDescriptionComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  public readonly classes = 'flex-grow';

  public showHighway = false;
  public isAnonymous: boolean;
  public job: JobDetails;

  public isLoading = false;

  public error: string;
  public isManager$: Observable<boolean>;

  public steps: BubbleWizardStep[] = [
    {
      name: 'Create your account',
      completed: true,
    },
    {
      name: 'Resume and Qualifications',
      completed: true,
    },
  ];

  @ViewChild('apply', { read: ElementRef })
  public applyElement: ElementRef;

  public form: FormGroup;

  public countries$: Observable<Country[]>;
  public allowedCountries$: Observable<Country[]>;
  public forbiddenCountries$: Observable<Country[]>;

  public passwordMessages: DfValidationMessagesMap = {
    pattern: () => 'At least 8 characters, 1 letter and a number or symbol',
  };
  public fullnameMessages: DfValidationMessagesMap = {
    pattern: () => 'Full name can only include letters',
  };

  public countryTooltip$: Observable<string>;

  public isApplying: boolean;

  public destroy$ = new Subject();

  public currentStep: 0 | 1 | 2 = 0;

  public otherPreferences: VisiblePipelineVariants[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private hireService: HireService,
              private identityService: IdentityService,
              private formBuilder: FormBuilder,
              private commonService: CommonService,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.initialSetUp();

    this.isManager$ = this.identityService.currentUserIsManager();

    this.activatedRoute.params
      .pipe(
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(p => {
          this.hireService.getVisiblePipelineVariants(p.id)
            .subscribe((data: VisiblePipelineVariants[]) => this.otherPreferences = data);
          return this.hireService.getJob(p.id);
        }),
        tap(() => {
          this.isLoading = false;
        })
      )
      .subscribe(job => {
        this.job = job;
      });
  }

  public scrollToApply(): void {
    this.applyElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  public onFileChange(e: Event): void {
    const inputElement = e.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.form.patchValue({ resume: file });
    } else {
      this.form.patchValue({ resume: null });
    }
  }

  public get fileName(): string | undefined {
    return this.form.value.resume.name.split('\\').pop();
  }

  public get checkedPreferences(): VisiblePipelineVariants[] {
    return this.otherPreferences
      .filter((preference: VisiblePipelineVariants) => preference.selected);
  }

  public getFirstName(fullName: string): string {
    return fullName.split(' ')[0];
  }

  public getLastName(fullName: string): string {
    return fullName.split(' ').length > 1 ? fullName.split(' ')[fullName.split(' ').length - 1] : '';
  }

  public isFirstStepFormValid(): boolean {
    return this.form.controls['name'].valid && this.form.controls['email'].valid && this.form.controls['password'].valid
      && this.form.controls['country'].valid && this.form.controls['recaptcha'].valid;
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
        this.applyAnonymously();
      } else {
        this.applyAuthenticated();
      }
    }
  }

  public onWizardBubbleClick(event: BubbleWizardEvent): void {
    this.currentStep = event.index as typeof PipelineDescriptionComponent.prototype.currentStep;
  }

  public backToStep1(): void {
    this.currentStep = 1;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initialSetUp(): void {
    this.buildForm();
    this.setFormStatusListener();
    this.setCountriesInTemplate();
    this.setCurrentUserState();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z ]+$/),
      ])],
      email: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[^a-zA-Z])(?=.*[a-zA-Z]).{8,64}$/),
        ]),
      ],
      country: [null, Validators.required],
      resume: [null, Validators.required],
      recaptcha: [null, Validators.required],
      mainRole: [null, Validators.required],
    });
  }

  private setFormStatusListener(): void {
    this.form.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.currentStep = 2;
        this.steps = this.steps.map(v => {
          return { ...v, completed: true };
        });
      }
    });
  }

  private setCountriesInTemplate(): void {
    this.countries$ = this.commonService.getCountries();
    this.allowedCountries$ = this.countries$.pipe(
      map(countries => countries.filter(c => c.allowed))
    );
    this.forbiddenCountries$ = this.countries$.pipe(
      map(countries => countries.filter(c => !c.allowed))
    );
    this.countryTooltip$ = this.forbiddenCountries$.pipe(
      map(countries => {
        const list = countries
          .map(c => `<div><strong>${c.name}</strong></div>`)
          .join('');
        return `
          <p> It is a violation of US law and/or regulation to engage any individual or entity
          who is a citizen or resident of a country listed below as a service provider.
          If you are a resident and/or citizen of a country listed below, please do not proceed.
          </p>
          ${list}
          `;
      })
    );
  }

  private setCurrentUserState(): void {
    this.identityService
      .getCurrentUser()
      .pipe(map(user => !user), takeUntil(this.destroy$))
      .subscribe(isAnonymous => {
        this.isAnonymous = isAnonymous;
        const controlsToToggle = [
          'name',
          'email',
          'password',
          'country',
          'recaptcha',
        ];
        controlsToToggle.forEach(key => {
          const control = this.form.controls[key];
          isAnonymous ? control.enable() : control.disable();
        });
        if (!this.isAnonymous) {
          this.currentStep = 2;
        }
      });
  }

  private applyAnonymously(): void {
    this.hireService
      .applyToPipelineAsAnonymousUser(
        this.form.value.email,
        this.getFirstName(this.form.value.name),
        this.getLastName(this.form.value.name),
        this.form.value.password,
        this.form.value.country,
        this.form.value.recaptcha,
        this.job.id,
        this.form.value.resume,
        this.checkedPreferences
      )
      .subscribe(response => {
          this.isApplying = false;
          this.router.navigate([`marketplace/verify/${response.id}`]);
        },
        (negativeResponse) => {
          this.isApplying = false;
          this.error = negativeResponse.error.text;
        });
  }

  private applyAuthenticated(): void {
    const candidate: CurrentUserDetail | null = this.identityService.getCurrentUserValue() as CurrentUserDetail;

    this.hireService
      .applyToPipelineAsAuthenticatedUser(candidate, this.job.id, this.form.value.resume, this.checkedPreferences)
      .subscribe(() => {
          this.isApplying = false;
          this.showHighway = true;
        },
        (negativeResponse) => {
          this.isApplying = false;
          this.error = negativeResponse.error.text;
        });
  }
}
