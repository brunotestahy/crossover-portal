import { Question } from 'app/core/models/hire/question.model';

export class UserAvatar {
  constructor(
    public id: number,
    public type: string,
    public questions?: Question[]
  ) {
  }

  public static from(userAvatar: Partial<UserAvatar>): UserAvatar {
    return new UserAvatar(
      userAvatar.id as typeof UserAvatar.prototype.id,
      userAvatar.type as typeof UserAvatar.prototype.type
    );
  }

  public static fromArray(avatars: Partial<UserAvatar>[] | undefined): UserAvatar[] {
    return (avatars || []).map(UserAvatar.from);
  }
}
