export class Skill {
  constructor(
    public id: number,
    public name: string
  ) {
  }

  public static from(skill: Partial<Skill>): Skill {
    return new Skill(
      skill.id as typeof Skill.prototype.id,
      skill.name as typeof Skill.prototype.name
    );
  }
}
