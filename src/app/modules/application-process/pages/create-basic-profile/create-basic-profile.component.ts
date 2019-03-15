import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DfLoadingSpinnerService, DfModalService, DfModalSize } from '@devfactory/ngx-df';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { ApplicationFlowStep, JobApplication } from 'app/core/models/application';
import { Candidate } from 'app/core/models/candidate';
import { Country } from 'app/core/models/country';
import { JobDetails } from 'app/core/models/hire';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { CommonService } from 'app/core/services/common/common.service';
import { EnumsService } from 'app/core/services/enums/enums.service';
import { HireService } from 'app/core/services/hire/hire.service';
import { ApplicationProcessService } from 'app/modules/application-process/shared/application-process.service';
import { ChangeAvatarComponent } from 'app/shared/components/change-avatar/change-avatar.component';

@Component({
  selector: 'app-create-basic-profile',
  templateUrl: './create-basic-profile.component.html',
  styleUrls: [
    './create-basic-profile.component.scss',
    '../../shared/steps.scss',
  ],
})
export class CreateBasicProfileComponent implements OnInit {
  public static readonly STEP_NO = 1;

  @HostBinding('class')
  public readonly classes = 'create-basic-profile';

  public form: FormGroup;

  public countryTooltip$: Observable<string>;
  public countries$: Observable<Country[]>;
  public allowedCountries$: Observable<Country[]>;
  public forbiddenCountries$: Observable<Country[]>;
  public questions$: Observable<string[]>;
  public availabilities$: Observable<string[]>;

  public error: string | null;

  public data: JobApplication;
  public job: JobDetails;
  public isLoading = true;
  public currentStep = 1;
  public steps: ApplicationFlowStep[];
  public country: Country = {id: -1, timezones: [], name: '', code: '', allowed: false};
  public candidate: Candidate;

  @ViewChild('card', { read: ElementRef })
  public card: ElementRef;

  constructor(private service: CandidateService,
    private commonService: CommonService,
    private modal: DfModalService,
    private hireService: HireService,
    private enums: EnumsService,
    private loader: DfLoadingSpinnerService,
    private process: ApplicationProcessService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      avatar: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      timezone: new FormControl('', [Validators.required]),
      skypeId: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(18),
        Validators.pattern(/^[\d\-\_\(\)\+\' ' ]+$/),
      ]),
      securityQuestion: new FormControl('', [Validators.required]),
      customSecurityQuestion: new FormControl({value: '', disabled: true}, [Validators.required]),
      securityAnswer: new FormControl('', [Validators.required]),
      availability: new FormControl('', [Validators.required]),
    });

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

    this.service.getCurrentApplication()
      .subscribe((application: JobApplication) => {
        combineLatest(
          this.service.getSteps(application.applicationFlow.id),
          this.hireService.getJob(application.job.id)
        ).subscribe(data => {
          this.steps = data[0];
          this.job = data[1];
          this.data = application;
          this.candidate = application.candidate as Candidate;
          this.isLoading = false;

          const country = application.candidate.location.country as Country;
          this.form.controls.avatar.setValue(this.data.candidate.photoUrl);
          this.updateCountry(country.id);
          this.form.controls.mobile.setValue(this.candidate.location.phone);
          this.form.controls.securityQuestion.setValue(this.candidate.userSecurity.securityQuestion);
          this.form.controls.securityAnswer.setValue(this.candidate.userSecurity.rawSecurityAnswer);
          this.form.controls.skypeId.setValue(this.candidate.skypeId);
          this.form.controls.availability.setValue(this.candidate.availability);
        });
      });

    const enums = this.enums.getEnums();
    this.questions$ = enums.pipe(map(res => res.securityQuestions));
    this.availabilities$ = enums.pipe(map(res => res.candidateAvailabilities));
    this.process.currentStep(CreateBasicProfileComponent.STEP_NO);
  }

  public onCountryChange(id: number): void {
    this.updateCountry(id);
  }

  public updateCountry(id: number): void {
    this.allowedCountries$.pipe(
      map(countries => countries.filter(c => c.id === id))
    ).subscribe(countryValue => {
      this.country = countryValue[0];
      this.form.controls.country.setValue(this.country.id);
    });
  }

  public avatarSelection(): void {
    const modalRef = this.modal.open(ChangeAvatarComponent, {
      customClass: 'change-avatar-modal',
      size: DfModalSize.Large,
      data: this.form.value.avatar,
    });
    modalRef.instance.title = 'Change Avatar';
    modalRef.onClose.subscribe((newAvatar: string) => {
      if (newAvatar) {
        this.form.controls.avatar.setValue(this.sanitizer.bypassSecurityTrustResourceUrl(newAvatar));
      }
    });
  }

  public questionChange(value: string): void {
    if (value === 'other') {
      this.form.controls.customSecurityQuestion.enable();
    } else {
      this.form.controls.customSecurityQuestion.disable();
    }
  }

  public continue(): void {
    this.loader.reveal();

    this.candidate.location.country = this.country;
    this.candidate.location.phone = this.form.value.mobile;
    this.candidate.userSecurity.securityQuestion = this.form.value.securityQuestion;
    this.candidate.userSecurity.rawSecurityAnswer = this.form.value.securityAnswer;
    this.candidate.skypeId = this.form.value.skypeId;
    this.candidate.availability = this.form.value.availability;

    this.service.createBasicProfile(this.candidate, this.data.id).subscribe(
        () => {
          this.loader.hide();
          this.process.moveToStep(CreateBasicProfileComponent.STEP_NO + 1);
        },
        err => {
          this.error = err.error.text;
          this.loader.hide();
          this.card.nativeElement.scrollIntoView({
            inline: 'start',
            block: 'start',
            behavior: 'smooth',
          });
        }
      );
  }

  public continueTooltip(): string | null {
    if (!this.form.value.avatar) {
      return 'Your photo is required to continue to the next step.';
    }
    if (this.form.invalid) {
      return 'Please fill in all of the fields above to be able to continue to the next step.';
    }
    return null;
  }

}
