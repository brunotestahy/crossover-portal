import { GenericAvatar } from 'app/core/models/avatar/generic-avatar.model';

export interface ApplicationNote {
  content: string;
  createdOn?: string;
  id?: number;
  sender?: GenericAvatar;
  type: string;
}
