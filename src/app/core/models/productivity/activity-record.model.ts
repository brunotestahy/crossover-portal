import { Section } from 'app/core/models/productivity/section.model';

export interface ActivityRecord {
  name?: string;
  plan?: string;
  teamAverage?: string | number;
  teamMembers: { [key: string]: string | Section[] };
}
