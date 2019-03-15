import { AssignmentHistory } from 'app/core/models/assignment/assignment-history.model';
import { Selection } from 'app/core/models/assignment/selection.model';
import { Candidate } from 'app/core/models/candidate/candidate.model';
import { Interviewee } from 'app/core/models/interview/interviewee.model';
import { Manager } from 'app/core/models/manager/manager.model';

export interface Task {
  processType: string;
  taskType: string;
  object?: {
    id: number;
    selection: Selection;
    interviewee?: Interviewee;
    assignmentHistories?: AssignmentHistory[];
    candidate?: Candidate;
    currentAssignmentHistory?: AssignmentHistory;
    trackerRequired?: boolean;
    jobTitle?: string;
    paymentPlatform?: string;
    salaryType?: string;
    weeklyLimit?: number;
    salaryUnit?: string;
    salary?: number;
    status?: string;
    manager?: Manager;
    startDateTime?: string;
    endDateTime?: string;
    durationInMinutes?: number;
    interviewSlots?: string[];
    managerBusySlots?: string[];
    zoomStartUrl?: string;
    zoomJoinUrl?: string;
    ratingResponses?: {
      id: number;
      ratingQuestion: {
        id: number;
        question: string;
        sequence: number;
        optional?: boolean;
      },
      rating: number;
    }[];
    type?: string;
    createdOn?: string;
    updatedOn?: string;
  };
}
