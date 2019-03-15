import { EnumToStringPipe } from './enum-to-string.pipe';

describe('EnumToStringPipe', () => {
  let pipe: EnumToStringPipe;

  beforeEach(() => {
    pipe = new EnumToStringPipe();
  });

  it('dontChangeInputCase string', () => {
    expect(pipe.transform('ACTIVE', false, false, true)).toBe('ACTIVE');
  });

  it('dontCapitalize string', () => {
    expect(pipe.transform('ACTIVE', true, false)).toBe('active');
  });

  it('capitalizeFirst string', () => {
    expect(pipe.transform('ACTIVE', false, true)).toBe('Active');
  });

});
