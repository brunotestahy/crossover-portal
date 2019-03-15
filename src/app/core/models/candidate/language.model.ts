export class Language {
  constructor(
    public id: number,
    public name: string
  ) {
  }

  public static from(language: Partial<Language> | undefined): Language | undefined {
    if (language) {
      return new Language(
        language.id as typeof Language.prototype.id,
        language.name as typeof Language.prototype.name
      );
    }
    return;
  }

  public static findById(list: Language[] | undefined, id: number): Language | undefined {
    return (list || []).find(language => language.id === id);
  }
}
