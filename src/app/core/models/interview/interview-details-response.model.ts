import { Selection } from 'app/core/models/assignment';
import { Interviewee, InterviewSlot } from 'app/core/models/interview';
import { ManagerBusySlot } from 'app/core/models/manager';

export interface InterviewDetailsResponse {
  id: number;
  status: string;
  createdOn: string;
  updatedOn: string;
  startDateTime?: string;
  endDateTime?: string;
  durationInMinutes: number;
  interviewSlots: InterviewSlot[];
  managerBusySlots: ManagerBusySlot[];
  selectedSlot?: boolean;
  durationInMilliseconds?: number;
  interviewee: Interviewee;
  selection: Selection;
  type: string;
  candidateResponseSent?: boolean;
  intervieweeNotes?: string;
  zoomJoinUrl?: string;
}
