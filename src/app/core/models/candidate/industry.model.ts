export class Industry {
  constructor(
    public id: number,
    public name: string
  ) {
  }

  public static from(industry: Partial<Industry> | undefined): Industry | undefined {
    if (industry) {
      return new Industry(
        industry.id as typeof Industry.prototype.id,
        industry.name as typeof Industry.prototype.name
      );
    }
    return;
  }

  public static findById(list: Industry[] | undefined, id: number): Industry | undefined {
    return (list || []).find(industry => industry.id === id);
  }
}
