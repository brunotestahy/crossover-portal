import { Injectable } from '@angular/core';
import { filter, finalize, take, takeUntil } from 'rxjs/operators';

import { AssignmentStatus } from 'app/core/constants/assignments/assignment-status';
import { Team, TeamManagerGroup } from 'app/core/models/team';
import { HireComponent } from 'app/modules/contractor/pages/hire/hire.component';

@Injectable()
export class DataFetchingService {
  public currentTeam: Team;

  public load(instance: HireComponent): void {
    instance.identityService.getTeamManagerGroupSelection()
      .pipe(
        takeUntil(instance.destroy$),
        filter(teamManagerGroup =>
          !!teamManagerGroup && !!teamManagerGroup.team && !!teamManagerGroup.team.id
        )
      )
      .subscribe(teamManagerGroup => {
        const value = teamManagerGroup as TeamManagerGroup;
        this.currentTeam = value.team;
        this.getTeamData(instance, value);
      });
  }

  protected getTeamData(instance: HireComponent, teamManager: TeamManagerGroup): void {
    const status = [AssignmentStatus.ACTIVE, AssignmentStatus.MANAGER_SETUP].join(',');
    const limit = '1000';
    const teamId = teamManager.team.id.toString();
    instance.error = '';
    instance.isLoading = true;
    instance.assignmentService
      .getAssignmentsForTeam(teamId, { status, limit })
      .pipe(
        take(1),
        finalize(() => instance.isLoading = false)
      )
      .subscribe(
        data => instance.assignments = data.content,
        () => instance.error = 'An error occurred while retrieving assignment data.'
      );
  }
}
