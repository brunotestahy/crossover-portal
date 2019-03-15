import { Assignment } from 'app/core/models/assignment/assignment.model';

export interface TeamMember {
  id: number;
  fullName: string | undefined;
  assignment: Assignment;
}
