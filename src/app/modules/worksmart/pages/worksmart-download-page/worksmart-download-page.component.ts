import { Component, OnInit } from '@angular/core';
import { IdentityService } from 'app/core/services/identity/identity.service';

import { Assignment } from 'app/core/models/assignment';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';

@Component({
  selector: 'app-worksmart-download-page',
  templateUrl: './worksmart-download-page.component.html',
  styleUrls: ['./worksmart-download-page.component.scss'],
})
export class WorksmartDownloadPageComponent implements OnInit {

  public hasDashboardLink: boolean;
  public currentUserIsCandidate: boolean;
  public assignment: Assignment | null;

  constructor(
    private identityService: IdentityService,
    private assignmentService: AssignmentService
  ) {}

  public ngOnInit(): void {
    this.identityService.currentUserIsCandidate().subscribe(currentUserIsCandidate => {
      this.currentUserIsCandidate = currentUserIsCandidate;
    });
    this.assignmentService.getCurrentUserAssignment()
      .subscribe(assignment => {
        this.assignment = assignment;
        this.hasDashboardLink = this.currentUserIsCandidate &&
          !!this.assignment &&
          !!this.assignment.currentAssignmentHistory &&
          this.assignment.currentAssignmentHistory.status === 'ACTIVE';
      });
  }
}
