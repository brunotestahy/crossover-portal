import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, OnInit } from '@angular/core';
import { BREAKPOINT_CONFIG } from '@devfactory/ngx-df';
import { format } from 'date-fns';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { Assignment, AssignmentHistory, AssignmentRow } from 'app/core/models/assignment';
import { Company } from 'app/core/models/company';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { isApiError } from 'app/core/type-guards/is-api-error';
import { EnumToStringPipe } from 'app/shared/pipes/enum-to-string.pipe';

@Component({
  selector: 'app-assignments-page',
  templateUrl: './assignments-page.component.html',
  styleUrls: ['./assignments-page.component.scss'],
})
export class AssignmentsPageComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public data: AssignmentRow[] = [];
  public isLoading = false;
  public error: string | null = null;
  public isResponsive$: Observable<boolean>;

  constructor(
    private identityService: IdentityService,
    private enumPipe: EnumToStringPipe,
    private breakpointObserver: BreakpointObserver
  ) { }

  public ngOnInit(): void {
    this.isLoading = true;
    this.isResponsive$ = this.breakpointObserver
      .observe(BREAKPOINT_CONFIG)
      .pipe(map(matches => matches.matches));
    this.identityService.getAssignmentsForCurrentUser()
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((assignments: Assignment[]) =>
        this.data = Object.assign(this.getAssignmentHistory(assignments))
        , error => {
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error fetching assignment.';
          }
        });
  }

  public getAssignmentHistory(assignments: Assignment[]): AssignmentRow[] {
    const assignmentHistories = [] as AssignmentHistory[];
    let job: string;
    let status: string;
    assignments.forEach(assignment => {
      job = assignment.jobTitle ? assignment.jobTitle : '';
      status = assignment.status ? assignment.status : '';
      /* istanbul ignore else */
      if (assignment.assignmentHistories) {
        assignment.assignmentHistories.forEach(assignmentHistory => {
          assignmentHistory.jobTitle = job;
          assignmentHistory.status = status;
          assignmentHistories.push(assignmentHistory);
        });
      }
    });
    return assignmentHistories
      .map<AssignmentRow>(a => {
        let date: string = format(a.effectiveDateBegin as string, 'YYYY-MM-DD');
        if (a.effectiveDateEnd) {
          date += ' to ' + format(a.effectiveDateEnd, 'YYYY-MM-DD');
        }
        return <AssignmentRow>{
          company: a.team ? (a.team.company as Company).name : (a.manager.company as Company).name,
          manager: a.manager.printableName,
          team: a.team ? a.team.name : '',
          weeklyLimit: `${a.weeklyLimit}`,
          job: a.jobTitle,
          contractType: this.enumPipe.transform(`${a.salaryType}`, false, true),
          date: date,
          rate: '$' + a.salary + '/h',
          status: this.getStatus(a),
        };
      })
      .sort((previous, current) => current.date.localeCompare(previous.date));
  }

  public getStatus(assignmentHistory: AssignmentHistory): string {
    let status: string;
    if (assignmentHistory.status === 'ACTIVE') {
      status = assignmentHistory.effectiveDateEnd ? 'Terminated' : this.enumPipe.transform(assignmentHistory.status, false, true);
    } else {
      status = this.enumPipe.transform(assignmentHistory.status as string, false, true);
    }
    return status;
  }
}
