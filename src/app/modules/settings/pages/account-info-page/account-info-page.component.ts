import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DfModalService,
  DfModalSize,
  DfToasterService,
} from '@devfactory/ngx-df';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ComponentRestrictions } from 'ngx-google-places-autocomplete/objects/options/componentRestrictions';
import 'rxjs/add/observable/forkJoin';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { startWith, take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { Country } from 'app/core/models/country';
import { ParsedError } from 'app/core/models/error';
import { SignInResponse, WindowWithAuth2 } from 'app/core/models/google';
import { CurrentUserDetail } from 'app/core/models/identity';
import { ResidenceInfo } from 'app/core/models/residence-info';
import { SlackUserDataResponse } from 'app/core/models/slack';
import { CommonService } from 'app/core/services/common/common.service';
import { GoogleService } from 'app/core/services/google/google.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { SlackService } from 'app/core/services/slack/slack.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { isApiError } from 'app/core/type-guards/is-api-error';
import { ChangeEmailModalComponent } from 'app/modules/settings/components/change-email-modal/change-email-modal.component';
import { AccountInfoFormData } from 'app/modules/settings/models/account-info.model';
import { ChangeAvatarComponent } from 'app/shared/components/change-avatar/change-avatar.component';

@Component({
  selector: 'app-account-info-page',
  templateUrl: './account-info-page.component.html',
  styleUrls: ['./account-info-page.component.scss'],
})
export class AccountInfoPageComponent implements AfterViewInit {
  @ViewChild('placesRef') public placesRef: GooglePlaceDirective;
  public form: FormGroup;

  public saving = false;

  public slackClientId = '3993618669.210642446615';
  public photoUrl = '';

  public connectError = '';

  public slack: SlackUserDataResponse | null;
  public google: SignInResponse | null;

  public testingSlack = false;
  public testingGoogle = false;
  public connectingSlack = false;
  public connectingGoogle = false;

  public countries$: Observable<Country[]>;
  public countries: Country[] = [];

  public currentUser$: Observable<CurrentUserDetail | null>;
  public currentUser: CurrentUserDetail | null;

  public error = '';

  public residenceInfoGroup: FormGroup;
  public personalInfoGroup: FormGroup;
  public entityInfoGroup: FormGroup;

  public secondaryCitizenshipControl = false;
  public tertiaryCitizenshipControl = false;

  constructor(
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
    private toasterService: DfToasterService,
    private commonService: CommonService,
    private modalService: DfModalService,
    private googleService: GoogleService,
    private slackService: SlackService,
    @Inject(WINDOW_TOKEN) private window: WindowWithAuth2
  ) {
    this.countries$ = this.commonService.getCountries();
    this.countries$.subscribe(countries => {
      this.countries = countries;
    });
    this.form = this.formBuilder.group({
      accountInfo: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
      }),
      residenceInfo: this.formBuilder.group({
        workingThroughEntity: [false],
        personalInfo: this.formBuilder.group({
          title: [null, Validators.required],
          address1: ['', Validators.required],
          address2: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zip: ['', Validators.required],
          country: [],
          primaryCitizenship: [],
          secondaryCitizenship: [],
          tertiaryCitizenship: [],
          countryId: [null, Validators.required],
          primaryCitizenshipId: [null, Validators.required],
          secondaryCitizenshipId: [],
          tertiaryCitizenshipId: [],
        }),
        entityInfo: this.formBuilder.group({
          name: ['', Validators.required],
          country: [],
          address1: ['', Validators.required],
          address2: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zip: ['', Validators.required],
          countryId: [null, Validators.required],
        }),
      }),
    });

    this.residenceInfoGroup = this.form.controls.residenceInfo as FormGroup;
    this.personalInfoGroup = this.residenceInfoGroup.controls
      .personalInfo as FormGroup;
    this.entityInfoGroup = this.residenceInfoGroup.controls
      .entityInfo as FormGroup;

    this.residenceInfoGroup.controls.workingThroughEntity.valueChanges
      .pipe(startWith(false))
      .subscribe((isWorkingThroughEntity: boolean) => {
        if (isWorkingThroughEntity) {
          this.personalInfoGroup.disable();
          this.entityInfoGroup.enable();
        } else {
          this.personalInfoGroup.enable();
          this.entityInfoGroup.disable();
        }
      });

    this.currentUser$ = this.identityService.getCurrentUser();
    this.currentUser$
      .pipe(take(1))
      .subscribe(user => {
        if (user) {
          this.photoUrl = user.photoUrl;
        }
      });

    combineLatest(
      this.identityService.getCurrentUserResidenceInfo(),
      this.countries$
    ).subscribe(([residenceInfo, countries]) => {
      const initialData: ResidenceInfo = {
        workingThroughEntity: residenceInfo.workingThroughEntity,
      };
      const personal = residenceInfo.personalInfo;
      if (personal) {
        initialData.personalInfo = {
          ...personal,
        };
        if (personal.country) {
          const countryId = personal.country.id;
          const country = countries.find(c => c.id === countryId);
          if (country !== undefined) {
            initialData.personalInfo.countryId = country.id;
          }
        }
        if (personal.primaryCitizenship) {
          const countryId = personal.primaryCitizenship.id;
          const country = countries.find(c => c.id === countryId);
          if (country !== undefined) {
            initialData.personalInfo.primaryCitizenshipId = country.id;
          }
        }
        if (personal.secondaryCitizenship) {
          const countryId = personal.secondaryCitizenship.id;
          const country = countries.find(c => c.id === countryId);
          if (country !== undefined) {
            initialData.personalInfo.secondaryCitizenshipId = country.id;
            this.secondaryCitizenshipControl = true;
          }
        } else {
          this.secondaryCitizenshipControl = false;
        }
        if (personal.tertiaryCitizenship) {
          const countryId = personal.tertiaryCitizenship.id;
          const country = countries.find(c => c.id === countryId);
          if (country !== undefined) {
            initialData.personalInfo.tertiaryCitizenshipId = country.id;
            this.tertiaryCitizenshipControl = true;
          }
        } else {
          this.tertiaryCitizenshipControl = false;
        }
      }
      const entity = residenceInfo.entityInfo;
      if (entity) {
        initialData.entityInfo = {
          ...entity,
        };
        if (entity.country) {
          const countryId = entity.country.id;
          const country = countries.find(c => c.id === countryId);
          if (country !== undefined) {
            initialData.entityInfo.countryId = country.id;
          }
        }
      }
      this.form.patchValue({
        residenceInfo: initialData,
      });
    });

    this.slackService.getUserData().subscribe(slack => (this.slack = slack));

    this.googleService
      .getUserData()
      .subscribe(google => (this.google = google));

    this.currentUser$.subscribe(currentUser => {
      this.currentUser = currentUser;
      if (currentUser) {
        const initialData: Partial<AccountInfoFormData> = {
          accountInfo: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
          },
        };
        this.form.patchValue(initialData);
      }
    });
  }

  public ngAfterViewInit(): void {
    this.placesRef.options.types = ['(cities)'];
    this.placesRef.reset();

    this.onCountryChange();
  }

  public setComponentRestrictions(value: number): void {
    if (value) {
      const country = this.getCountry(value);
      if (country !== undefined) {
        this.placesRef.options.types = ['(cities)'];
        this.placesRef.options.componentRestrictions = new ComponentRestrictions(
          {
            country: country.code,
          }
        );
        this.placesRef.reset();
      }
    }
  }

  public onCountryChange(): void {
    this.personalInfoGroup.controls.countryId.valueChanges.subscribe(value => {
      this.setComponentRestrictions(value);
    });

    this.entityInfoGroup.controls.countryId.valueChanges.subscribe(value => {
      this.setComponentRestrictions(value);
    });
  }

  public handleAddressChange(event: Address): void {
    const parsedAddress = this.getCity(event.formatted_address);
    if (parsedAddress.city !== undefined) {
      const residenceInfo = {
        personalInfo: {
          city: parsedAddress.city.trim(),
        },
      };
      this.form.patchValue({
        residenceInfo: residenceInfo,
      });
    }

    if (parsedAddress.state !== undefined) {
      const residenceInfo = {
        personalInfo: {
          state: parsedAddress.state.trim(),
        },
      };

      this.form.patchValue({
        residenceInfo: residenceInfo,
      });
    }
  }

  public handleEntityAddressChange(event: Address): void {
    const parsedAddress = this.getCity(event.formatted_address);
    if (parsedAddress.city !== undefined) {
      const residenceInfo = {
        entityInfo: {
          city: parsedAddress.city.trim(),
        },
      };
      this.form.patchValue({
        residenceInfo: residenceInfo,
      });
    }

    if (parsedAddress.state !== undefined) {
      const residenceInfo = {
        entityInfo: {
          state: parsedAddress.state.trim(),
        },
      };

      this.form.patchValue({
        residenceInfo: residenceInfo,
      });
    }
  }

  public getCity(address: string): { city: string, state: string, country: string } {
    const parts = address.toString().split(',');
    const city = parts[0];
    const result = {
      city: city,
      state: '',
      country: '',
    };
    if (parts.length === 3) {
      result.state = parts[1];
    }

    return result;
  }

  public getSlackAuthorizationUrl(): string {
    const params = {
      client_id: this.slackClientId,
      scope: [
        'identify',
        'channels:history',
        'groups:history',
        'im:history',
        'mpim:history',
        'users.profile:read',
        'channels:read',
        'users:read',
        'users:read.email',
        'groups:read',
        'im:read',
        'mpim:read',
      ],
      redirect_uri: this.window.location.origin + '/settings/account-info',
    };
    return `https://slack.com/oauth/authorize?${this.objectToParams(params)}`;
  }

  public objectToParams(data: { [key: string]: string | string[] }): string {
    const params = [];
    for (const key in data) {
      if (data[key]) {
        if (typeof data[key] === 'string') {
          params.push(`${key}=${data[key]}`);
        } else {
          const item = data[key] as string[];
          params.push(`${key}=${item.join(',')}`);
        }
      }
    }

    return params.join('&');
  }

  public connectSlack(): void {
    this.window.location.href = this.getSlackAuthorizationUrl();
  }

  public connectGoogle(): void {
    this.connectError = '';
    this.connectingGoogle = true;
    this.window.auth2
      .grantOfflineAccess({ prompt: 'consent' })
      .then(response => {
        this.googleService.signIn(response.code).subscribe(
          connection => {
            this.connectingGoogle = false;
            if (connection && connection.googleAccessToken) {
              this.google = connection;
            }
          },
          () => {
            this.connectError = `Oops! Something went wrong :( We couldn't connect with Google.
          You might want to retry the request after waiting a few minutes. If you need assistance,
          please reach out to our support team. They'll be glad to help!`;
            this.connectingGoogle = false;
          }
        );
      });
  }

  public getCountry(id: number): Country | undefined {
    return this.countries.find(country => country.id === id);
  }

  public unlinkSlack(): void {
    this.slackService.disconnect().subscribe(
      () => {
        this.slack = null;
        this.toasterService.popSuccess('Slack account unlinked successfully!');
      },
      error => {
        if (isApiError(error)) {
          this.error = error.error.text;
        } else {
          this.error = 'Error unlinking Slack account.';
        }
      }
    );
  }

  public unlinkGoogle(): void {
    this.googleService.disconnect().subscribe(
      () => {
        this.google = null;
        this.toasterService.popSuccess('Google account unlinked successfully!');
      },
      error => {
        if (isApiError(error)) {
          this.error = error.error.text;
        } else {
          this.error = 'Error unlinking Google account.';
        }
      }
    );
  }

  public testGoogleConnection(): void {
    this.connectError = '';
    this.testingGoogle = true;
    this.googleService.testConnection().subscribe(
      () => {
        this.toasterService.popSuccess('Google connection is OK');
        this.testingGoogle = false;
      },
      error => {
        if (isApiError(error)) {
          this.connectError = error.error.text;
          this.testingGoogle = false;
        } else {
          this.connectError = `Oops! Something went wrong :( We weren't able to process your request due
        to an internal communication issue with Google. You might want to retry
        the request after waiting a few minutes. If you need assistance,
        please reach out to our support team. They'll be glad to help!`;
          this.testingGoogle = false;
        }
      }
    );
  }

  public testSlackConnection(): void {
    this.connectError = '';
    this.testingSlack = true;
    this.slackService.testConnection().subscribe(
      () => {
        this.toasterService.popSuccess('Slack connection is OK');
        this.testingSlack = false;
      },
      error => {
        if (isApiError(error)) {
          this.connectError = error.error.text;
          this.testingSlack = false;
        } else {
          this.connectError = `Oops! Something went wrong :( We weren't able to process your request due
        to an internal communication issue with Slack. You might want to retry
        the request after waiting a few minutes. If you need assistance,
        please reach out to our support team. They'll be glad to help!`;
          this.testingSlack = false;
        }
      }
    );
  }

  public onSubmit(): void {
    if (this.form.valid && !this.saving) {
      this.saving = true;
      this.error = '';

      const accountModel = this.form.get('accountInfo') as AbstractControl;
      const residenceModel = this.form.get('residenceInfo') as AbstractControl;
      const conditions = {
        accountModel: {
          value: () => accountModel ? accountModel.value : null,
        },
        residenceModel: {
          value: () => {
            const data = residenceModel ? residenceModel.value : null;
            if (data && data.workingThroughEntity) {
              const country = this.getCountry(data.entityInfo.countryId);
              Object.assign(data.entityInfo, { country });
            }
            if (data && !data.workingThroughEntity) {
              data.personalInfo.country =
                this.getCountry(data.personalInfo.countryId);
              data.personalInfo.primaryCitizenship =
                this.getCountry(data.personalInfo.primaryCitizenshipId);

              if (
                data.personalInfo.secondaryCitizenshipId &&
                this.secondaryCitizenshipControl
              ) {
                data.personalInfo.secondaryCitizenship =
                  this.getCountry(data.personalInfo.secondaryCitizenshipId);
              } else {
                delete data.personalInfo.secondaryCitizenship;
              }

              if (
                data.personalInfo.tertiaryCitizenshipId &&
                this.tertiaryCitizenshipControl
              ) {
                data.personalInfo.tertiaryCitizenship =
                  this.getCountry(data.personalInfo.tertiaryCitizenshipId);
              } else {
                delete data.personalInfo.tertiaryCitizenship;
              }
            }
            return data;
          },
        },
      };
      const accountInfo = conditions.accountModel.value();
      const residenceInfo = conditions.residenceModel.value();

      const requests = [
        this.identityService.saveAccountInfo(accountInfo),
        this.identityService.saveResidenceInfo(residenceInfo),
      ];

      Observable.forkJoin(requests).subscribe(
        () => {
          this.saving = false;
          this.toasterService.popSuccess('Account info changed successfully!');
          if (!residenceInfo.workingThroughEntity) {
            this.secondaryCitizenshipControl = !!residenceInfo.personalInfo
              .secondaryCitizenship;
            this.tertiaryCitizenshipControl = !!residenceInfo.personalInfo
              .tertiaryCitizenship;
          }
        },
        error => {
          this.saving = false;
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error changing account info.';
          }
        }
      );
    }
  }

  public addCitizenship(): void {
    if (!this.secondaryCitizenshipControl) {
      this.secondaryCitizenshipControl = true;
    } else {
      this.tertiaryCitizenshipControl = true;
    }
  }

  public removeCitizenship(): void {
    if (this.tertiaryCitizenshipControl) {
      this.tertiaryCitizenshipControl = false;
    } else {
      this.secondaryCitizenshipControl = false;
    }
  }

  public changeEmail(): void {
    this.modalService.open(ChangeEmailModalComponent, {
      size: DfModalSize.Small,
    });
  }

  public openChangePhotoModal(): void {
    this.modalService.open(ChangeAvatarComponent, {
      size: DfModalSize.Large,
    });
  }

  public updateProfilePhoto(photoUrl: string): void {
    this.identityService.patchCurrentUser({ photoUrl });
  }

  public deleteProfilePhoto(): void {
    const currentUser = this.currentUser as CurrentUserDetail;
    this.identityService.deleteImage(currentUser.id)
    .pipe(take(1))
    .subscribe(
      () => {
        const empty = Object.assign({ value: null });
        this.photoUrl = empty.value;
        this.updateProfilePhoto(this.photoUrl);
      },
      error => this.error = ParsedError.fromHttpError(error).text
    );
  }
}
