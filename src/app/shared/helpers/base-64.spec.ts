import { Base64 } from './base-64';

describe('Base64', () => {

  it('should convert a string successfully when window provides atob() method', () => {
    const expectedValue = 'expected value';
    const targetWindow = {atob: () => expectedValue} as Partial<Window>;
    expect(Base64.atob(targetWindow, 'Test')).toEqual(expectedValue);
  });

  it('should fail when converting a string that contains invalid characters', () => {
    const targetValue = 'ínválid válue';
    const targetWindow = {} as Partial<Window>;
    expect(() => Base64.atob(targetWindow, targetValue))
      .toThrow(jasmine.any(TypeError));
  });

  it('should convert a string successfully when window does not provide atob() method', () => {
    const base64Value = 'dGVzdA==';
    const originalValue = 'test';
    const targetWindow = {} as Partial<Window>;
    expect(Base64.atob(targetWindow, base64Value)).toBe(originalValue);
  });
});
