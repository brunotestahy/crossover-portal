import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { TASKS_ORDER } from 'app/core/constants/onboarding/task-order';
import { Assignment } from 'app/core/models/assignment/assignment.model';
import { InterviewDetailsResponse } from 'app/core/models/interview/interview-details-response.model';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { InterviewService } from 'app/core/services/interview/interview.service';

@Component({
  selector: 'app-hiring',
  templateUrl: './hiring.component.html',
  styleUrls: ['./hiring.component.scss'],
})
export class HiringComponent implements OnInit {
  private readonly ASSIGNMENT_ACCEPTED_STATUS = 'CANDIDATE_ACCEPTED|MANAGER_SETUP|ACTIVE';
  private readonly ASSIGNMENT_OTHER_STATUS = 'PENDING|CANDIDATE_REJECTED';
  private readonly INTERVIEW_SCHEDULE_STATUS = 'INITIAL|CANDIDATE_ACCEPTED';
  private readonly INTERVIEW_SELECTION_SCHEDULE_STATUS = 'IN_PROGRESS|REINTERVIEW';

  public error: string | null = null;
  public isLoading = false;
  public acceptedAssignments: Assignment[] = [];
  public otherAssignments: Assignment[] = [];
  public interviewsInProgress: InterviewDetailsResponse[] = [];

  constructor(
    private interviewService: InterviewService,
    private assignmentService: AssignmentService,
    private identityService: IdentityService,
    private sanitizer: DomSanitizer
  ) { }

  public ngOnInit(): void {
    this.isLoading = true;
    this.getData();
  }

  public getImageUrl(imageUrl: string): SafeStyle {
    return this.sanitizer.
      bypassSecurityTrustStyle(`url(https://s3.amazonaws.com/${imageUrl})`);
  }

  private getData(): void {
    combineLatest(
      this.interviewService.getInterviewList(),
      this.assignmentService.getAssignmentList()
    ).subscribe(([interviews, assignments]) => {
      this.setupInterviews(interviews);
      this.setupAssignments(assignments);
    },
    () => {
      this.isLoading = false;
      this.error = 'Error loading data.';
    });
  }

  private setupInterviews(interviews: InterviewDetailsResponse[]): void {
    this.interviewsInProgress = interviews.filter((interview) => {
      return this.INTERVIEW_SCHEDULE_STATUS.indexOf(interview.status) >= 0 &&
      this.INTERVIEW_SELECTION_SCHEDULE_STATUS.indexOf(interview.selection.status) >= 0;
    });
  }

  private setupAssignments(assignments: Assignment[]): void {
    this.acceptedAssignments = assignments.filter((assignment) => {
      return this.ASSIGNMENT_ACCEPTED_STATUS.indexOf(assignment.status) >= 0;
    });
    this.otherAssignments = assignments.filter((assignment) => {
      return this.ASSIGNMENT_OTHER_STATUS.indexOf(assignment.status) >= 0;
    });
    this.setupTasksForAssignments();
  }

  private setupTasksForAssignments(): void {
    this.identityService.getCurrentUserTasks().subscribe((tasks) => {
      if (tasks.length === 0 && this.acceptedAssignments[0]) {
        this.acceptedAssignments[0].currentStep = 5;
      }
      tasks.forEach((task) => {
        const matchedAssignments = this.acceptedAssignments.filter((assignment) => {
          return task.object && assignment.id === task.object.id;
        });
        if (matchedAssignments.length === 1) {
          const matchedAssignment = matchedAssignments[0];
          matchedAssignment.currentStep = TASKS_ORDER[task.taskType];
        }
      });
      this.isLoading = false;
    });
  }
}
