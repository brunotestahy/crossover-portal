import { Language } from './language.model';

export class CandidateLanguage {
  constructor(
    public id: number,
    public language: Language,
    public proficiency: number,
    public markedToDelete?: boolean
  ) {
  }

  public static from(candidateLanguage: Partial<CandidateLanguage>): CandidateLanguage {
    return new CandidateLanguage(
      candidateLanguage.id as typeof CandidateLanguage.prototype.id,
      candidateLanguage.language as typeof CandidateLanguage.prototype.language,
      candidateLanguage.proficiency as typeof CandidateLanguage.prototype.proficiency
    );
  }

  public static fromArray(languages: Partial<CandidateLanguage>[] | undefined): CandidateLanguage[] {
    return (languages || []).map(CandidateLanguage.from);
  }

  public static manageEntries(entries: CandidateLanguage[], updates: CandidateLanguage[]): CandidateLanguage[] {
    const markedToDelete = (updates || [])
      .filter(item => item.markedToDelete);
    const nonDeletedEntries = (entries || []).filter(entry =>
      markedToDelete.find(item => item.id === entry.id) === undefined
    );
    const nonDeletedUpdates = (updates || [])
      .filter(update =>
        markedToDelete.find(item => item.id === update.id) === undefined
      );
    return nonDeletedEntries
      .filter(
        entry => nonDeletedUpdates
          .findIndex(update => update.id === entry.id) === -1
      )
      .concat(nonDeletedUpdates)
      .map((update, id) => CandidateLanguage.from(<Partial<CandidateLanguage>>{ ...update, id }));
  }
}
