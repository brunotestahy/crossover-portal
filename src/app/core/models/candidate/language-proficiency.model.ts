export class LanguageProficiency {
  public static entries = [
    new LanguageProficiency(0, 'Basic'),
    new LanguageProficiency(1, 'Conversational'),
    new LanguageProficiency(2, 'Fluent'),
    new LanguageProficiency(3, 'Native'),
  ];

  constructor(
    public id: number,
    public name: string
  ) {
  }

  public static fromId(proficiencyId: number): LanguageProficiency {
    return LanguageProficiency.entries
      .find(entry => entry.id === proficiencyId) as LanguageProficiency;
  }
}
