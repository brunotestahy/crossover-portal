import { Skill } from './skill.model';

export class CandidateSkill {
  constructor(
    public id: number,
    public skill: Skill,
    public proficiency: number,
    public markedToDelete?: boolean
  ) {
  }

  public static from(candidateSkill: Partial<CandidateSkill>): CandidateSkill {
    return new CandidateSkill(
      candidateSkill.id as typeof CandidateSkill.prototype.id,
      candidateSkill.skill as typeof CandidateSkill.prototype.skill,
      candidateSkill.proficiency as typeof CandidateSkill.prototype.proficiency
    );
  }

  public static fromArray(skills: Partial<CandidateSkill>[] | undefined): CandidateSkill[] {
    return (skills || []).map(CandidateSkill.from);
  }

  public static manageEntries(entries: CandidateSkill[], updates: CandidateSkill[]): CandidateSkill[] {
    const uniqueSkillIds = [] as number[];
    const markedToDelete = (updates || [])
      .filter(item => item.markedToDelete)
      .map(item => item.id);
    const nonDeletedEntries = (entries || []);
    const nonDeletedUpdates = (updates || [])
      .filter(item => markedToDelete.indexOf(item.id) === -1);
    return nonDeletedEntries
      .filter(
        entry => nonDeletedUpdates
          .findIndex(update => update.id === entry.id) === -1
      )
      .filter(item => markedToDelete.indexOf(item.id) === -1)
      .concat(nonDeletedUpdates)
      .filter(item => {
        if (uniqueSkillIds.indexOf(item.skill.id) !== -1) {
          return false;
        }
        uniqueSkillIds.push(item.skill.id);
        return true;
      })
      .map((update, id) => ({ ...update, id }));
  }
}
