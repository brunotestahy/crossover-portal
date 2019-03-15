import { isDefined } from 'app/core/type-guards/is-defined';

describe('isDefined', () => {
  it('should return true if value is not null or undefined', () => {
    const value = 'a';
    expect(isDefined(value)).toBe(true);
  });

  it('should return false if value is null', () => {
    const value = null;
    expect(isDefined(value)).toBe(false);
  });

  it('should return false if value is undefined', () => {
    const value = undefined;
    expect(isDefined(value)).toBe(false);
  });
});
