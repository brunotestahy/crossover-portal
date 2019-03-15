import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import {
  Candidate,
  CandidateLanguage,
  CandidateSkill,
  Certification,
  Education,
  Employment,
  Industry,
  Language,
  LanguageProficiency,
  Skill,
} from 'app/core/models/candidate';
import { Country } from 'app/core/models/country';
import { EnumsResponse } from 'app/core/models/enums';
import { ParsedError } from 'app/core/models/error';
import { GetApplicationResponse as Application } from 'app/core/models/hire';
import { CommonService } from 'app/core/services/common/common.service';
import { EnumsService } from 'app/core/services/enums/enums.service';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { PublicService } from 'app/core/services/public/public.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy, OnChanges {
  public enums$ = new Subject<EnumsResponse>();

  public countries = [] as Country[];
  public industries = [] as Industry[];
  public applications = [] as Application[];
  public languages = [] as Language[];
  public proficiencies = LanguageProficiency;
  public skills$ = new Subject<Skill[]>();
  public destroy$ = new Subject();

  @Input()
  public showBodyOnly = false;

  @Input()
  public isEditable = true;

  @Input()
  public candidate: Candidate;

  public editingItem = {
    photoUrl: null as string | null,
    resume: false,
    summary: false,
    experiences: false,
    position: null as Employment | null,
    skills: false,
    skillFilter: null as number | null,
    languages: false,
    candidateLanguage: null as CandidateLanguage | null,
    certifications: false,
    educations: false,
    candidateEducation: null as Education | null,
    candidateCertification: null as Certification | null,
  };

  public error: string | null;

  constructor(
    private commonService: CommonService,
    private enumsService: EnumsService,
    private hireService: HireService,
    private identityService: IdentityService,
    private publicService: PublicService
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.candidate) {
      this.candidate = this.candidateWithLocalIds(changes.candidate.currentValue);
      this.editingItem.photoUrl = this.candidate.photoUrl as string;
    }
  }

  public ngOnInit(): void {
    if (this.candidate) {
      this.candidate = this.candidateWithLocalIds(this.candidate);
      this.editingItem.photoUrl = this.candidate.photoUrl as string;
    }
    this.commonService.getCountries()
      .pipe(take(1))
      .subscribe(
        countries => this.countries = countries,
        error => this.error = ParsedError.fromHttpError(error).text
      );

    this.enumsService.getEnums()
      .pipe(take(1))
      .subscribe(
        data => this.enums$.next(data),
        error => this.error = ParsedError.fromHttpError(error).text
      );

    this.publicService
      .getIndustries()
      .pipe(take(1))
      .subscribe(
        industries => this.industries = industries,
        error => this.error = ParsedError.fromHttpError(error).text
      );

    this.publicService
      .getLanguages()
      .pipe(take(1))
      .subscribe(
        languages => this.languages = languages,
        error => this.error = ParsedError.fromHttpError(error).text
      );

    this.hireService.searchCurrentUserApplications('CANDIDATE')
      .pipe(take(1))
      .subscribe(
        data => {
          this.applications = data.content;
          data.content.forEach(
            entry => this.hireService.getApplicationFile(
              entry.id.toString(),
              entry.resumeFile.id.toString()
            )
              .pipe(take(1))
              .subscribe(
                url => entry.fileUrl = url,
                error => this.error = ParsedError.fromHttpError(error).text
              )
          );
        },
        error => this.error = ParsedError.fromHttpError(error).text
      );
  }

  public saveProfile(changes: Partial<Candidate>): void {
    const candidate = {
      ...this.candidate,
      ...changes,
      location: {
        ...this.candidate.location,
        ...changes.location,
      },
      certifications: Certification.manageEntries(
        this.candidate.certifications as Certification[],
        changes.certifications as Certification[]
      ),
      educations: Education.manageEntries(
        this.candidate.educations as Education[],
        changes.educations as Education[]
      ),
      employments: Employment.manageEntries(
        this.candidate.employments as Employment[],
        changes.employments as Employment[]
      ),
      languages: CandidateLanguage.manageEntries(
        this.candidate.languages as CandidateLanguage[],
        changes.languages as CandidateLanguage[]
      ),
      skills: CandidateSkill.manageEntries(
        this.candidate.skills as CandidateSkill[],
        changes.skills as CandidateSkill[]
      ),
    };
    this.identityService
      .saveProfile(candidate)
      .pipe(take(1))
      .subscribe(
        entry => this.candidate = this.candidateWithLocalIds(entry),
        error => this.error = ParsedError.fromHttpError(error).text
      );
  }

  public filterSkills(term: string): number | void {
    const debounceTimeMilliseconds = 500;
    window.clearTimeout(this.editingItem.skillFilter as number);
    /* istanbul ignore else */
    if (term !== '') {
      this.editingItem.skillFilter = window.setTimeout(
        () => this.commonService
          .getSkills(term)
          .pipe(take(1))
          .subscribe(
            data => this.skills$.next(data),
            error => this.error = ParsedError.fromHttpError(error).text
          ),
        debounceTimeMilliseconds
      );
      return debounceTimeMilliseconds;
    }
  }

  public updateProfilePhoto(urlOrNull: string | null): void {
    const photoUrl = urlOrNull as string;
    this.identityService.patchCurrentUser({ photoUrl });
  }

  public deleteProfilePhoto(): void {
    /* istanbul ignore else */
    if (this.candidate) {
      this.identityService.deleteImage(this.candidate.id)
        .pipe(take(1))
        .subscribe(
          () => {
            this.editingItem.photoUrl = null;
            this.updateProfilePhoto(this.editingItem.photoUrl);
          },
          error => this.error = ParsedError.fromHttpError(error).text
        );
    }
  }

  public toggleSection(key: keyof typeof UserProfileComponent.prototype.editingItem): void {
    this.editingItem[key] = !this.editingItem[key];
  }

  public setSection(
    key: keyof typeof UserProfileComponent.prototype.editingItem,
    value?: string | number | boolean | null
  ): void {
    this.editingItem[key] = value === undefined ?
      true :
      value;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected candidateWithLocalIds(candidate: Candidate): Candidate {
    /* Set local IDs for entries coming without an uniqueness identfier */
    return {
      ...candidate,
      certifications: (candidate.certifications || [] as Certification[])
        .map((certification, id) => Certification.from(
          { ...certification, id }
        )),
      educations: (candidate.educations || [] as Education[])
        .map((education, id) => Education.from(
          { ...education, id }
        )),
      employments: (candidate.employments || [] as Employment[])
        .map((employment, id) => Employment.from(
          { ...employment, id }
        )),
      languages: (candidate.languages || [] as CandidateLanguage[])
        .map((language, id) => CandidateLanguage.from(
          { ...language, id }
        )),
      skills: (candidate.skills || [] as CandidateSkill[])
        .map((skillCandidate, id) => CandidateSkill.from(
          { ...skillCandidate, id }
        )),
    };
  }
}
