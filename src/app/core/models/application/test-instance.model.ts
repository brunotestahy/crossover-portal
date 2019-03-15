import { UserAvatar } from 'app/core/models/current-user';

export interface TestInstance {
  id: number;
  test: UserAvatar;
  username?: string;
  password?: string;
  url?: string;
}
