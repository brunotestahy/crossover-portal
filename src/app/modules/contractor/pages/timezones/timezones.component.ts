import { Component, HostBinding, OnInit } from '@angular/core';
import { endOfWeek, startOfWeek } from 'date-fns';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { Assignment } from 'app/core/models/assignment';
import { Candidate } from 'app/core/models/candidate';
import { UserAvatar } from 'app/core/models/current-user';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { Timezone } from 'app/core/models/timezone';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-timezones',
  templateUrl: './timezones.component.html',
  styleUrls: ['./timezones.component.scss'],
})
export class TimezonesComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public error = '';

  public candidates: Candidate[] = [];

  public isLoading = false;

  public currentTime: Date;

  public currentUserDetail: CurrentUserDetail;

  constructor(
    private assignmentService: AssignmentService,
    private identityService: IdentityService
  ) {  }

  public ngOnInit(): void {
    this.loadInitialContent();
  }

  public getManagerToShow(assignmentManager?: Manager): Manager | null {
    const managerAvatar = this.currentUserDetail.userAvatars
      .find((avatar: UserAvatar) => avatar.type === 'MANAGER');
    if (assignmentManager && (!managerAvatar || managerAvatar.id !== assignmentManager.id)) {
      return assignmentManager;
    }
    return null;
  }

  public getBarPosition(timezone: Timezone, minimumValue?: number): number {
    const
      MIDDLE_POS = 50,
      HOURS_AMOUNT = 8,
      MULTIPLY_FACTOR = 100 / 24;
    const currentDate = this.getUTC(timezone.offset);
    const currentTimeStr = currentDate.getHours() + '.' + Math.floor(currentDate.getMinutes() / 60 * 100);
    const currentTime = Number(currentTimeStr);
    let result = MIDDLE_POS + ((HOURS_AMOUNT - currentTime) * MULTIPLY_FACTOR);
    if (minimumValue !== undefined && result < minimumValue) {
      result = minimumValue;
    }
    return result;
  }

  public getMaxWidth(timezone: Timezone): number {
    let barWidth = 37.35;
    const
      MAX_WIDTH = 100,
      BAR_POSITION = this.getBarPosition(timezone),
      DIFF = MAX_WIDTH - BAR_POSITION;

    if (DIFF < barWidth) {
      barWidth = DIFF;
    } else if (BAR_POSITION < 0) {
      barWidth = barWidth + BAR_POSITION;
    }
    return barWidth;
  }

  public getUTC(offset: number): Date {
    const date = new Date();
    const minuteInMilliseconds = 60 * 1000;

    offset += date.getTimezoneOffset() * minuteInMilliseconds;

    const time = date.getTime() + offset;
    return new Date(time);
  }

  public setCurrentTime(timezone: Timezone): boolean {
    this.currentTime = this.getUTC(timezone.offset);
    return true;
  }

  public getUtcDifference(offsetMilliseconds: number): string {
    let difference = 'UTC';
    if (offsetMilliseconds !== 0) {
      const hourInMilliseconds = 3600 * 1000;
      const offsetHours = Math.abs(offsetMilliseconds) / hourInMilliseconds;
      const hours = Math.floor(offsetHours);

      if (offsetMilliseconds > 0) {
        difference += '+';
      } else {
        difference += '-';
      }
      difference += hours;

      if (offsetHours > hours) {
        difference += '.' + (offsetHours - hours) * 10;
      }
    }
    return difference;
  }

  private loadInitialContent(): void {
    this.isLoading = true;
    this.identityService.getCurrentUserDetail()
      .flatMap(userDetail => {
        this.currentUserDetail = userDetail;
        const manager = this.currentUserDetail.assignment.manager;
        const teamOwner = this.currentUserDetail.assignment.team.teamOwner;
        const teamId = this.currentUserDetail.assignment.team.id;
        if (manager && teamOwner) {
          const weekStartDefinition = { weekStartsOn: 1 };
          const currentDate = new Date();
          const dateFormat = 'YYYY-MM-DD';
          const endWeekDate = moment(endOfWeek(currentDate, weekStartDefinition)).format(dateFormat);
          const startWeekDate = moment(startOfWeek(currentDate, weekStartDefinition)).format(dateFormat);

          return this.assignmentService.getTeamAssignments(
            manager.id !== teamOwner.id ? manager.id.toString() : teamOwner.id.toString(),
            teamId.toString(),
            startWeekDate ,
            endWeekDate
          );
        } else {
          return Observable.of([]);
        }
      })
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        assignments => this.fetchCandidates(assignments),
        error => {
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error loading team timezones.';
          }
        });
  }

  private fetchCandidates(assignments: Assignment[]): void {
    const candidates = assignments.map(assignment => assignment.candidate);
    let candidateManager;
    if (assignments.length) {
      candidateManager = this.getManagerToShow(assignments[0].manager);
    }
    if (candidateManager) {
      candidates.push(candidateManager as Candidate);
    }

    this.candidates = candidates.filter(candidate => candidate.userId !== this.currentUserDetail.id)
      .sort(
        (candidateA: Candidate, candidateB: Candidate) => {
          if (candidateA.location.timeZone && candidateB.location.timeZone) {
            return candidateB.location.timeZone.offset - candidateA.location.timeZone.offset;
          }
          return 0;
        }
      );

    const currentCandidate = candidates.find(candidate => candidate.userId === this.currentUserDetail.id);
    if (currentCandidate) {
      currentCandidate.firstName = 'You';
      this.candidates.unshift(currentCandidate);
    }
  }
}
