import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { filter, map, switchMap, take } from 'rxjs/operators';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { Candidate } from 'app/core/models/candidate';
import { ParsedError } from 'app/core/models/error';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { isDefined } from 'app/core/type-guards/is-defined';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss'],
})
export class UserProfilePageComponent implements OnInit {
  private linkedInKey = 'code';
  public candidate: Candidate;
  public error: string | null;

  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private identityService: IdentityService
  ) {
  }

  public ngOnInit(): void {
    forkJoin(
      this.identityService.getCurrentUser()
        .pipe(
          take(1),
          filter(isDefined)
        ),
      this.route.queryParams.pipe(take(1))
    )
      .pipe(
        switchMap(([user, params]) => params[this.linkedInKey] ?
          this.candidateService.importProfile(user.id, params[this.linkedInKey]) :
          this.identityService.getCurrentUserAs(AvatarTypes.Candidate)
            .pipe(map(currentUser => currentUser as Candidate))
        )
      )
      .subscribe(candidate => {
        this.candidate = candidate;
      },
        error => this.error = ParsedError.fromHttpError(error).text
      );
  }
}
