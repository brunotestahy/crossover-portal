import { FormatHoursPipe } from './format-hours.pipe';

describe('FormatHoursPipe', () => {
  let pipe: FormatHoursPipe;

  beforeEach(() => {
    pipe = new FormatHoursPipe();
  });

  it('default format', () => {
    expect(pipe.transform(2.5)).toBe('2:30');
  });

  it('For negative numbers', () => {
    expect(pipe.transform(-2.5)).toBe('-2:30');
  });

  it('For 0', () => {
    expect(pipe.transform(0)).toBe('0:00');
  });

  it('For 0 number with format hh:mm', () => {
    expect(pipe.transform(0, 'hh:mm')).toBe('00:00');
  });

  it('hh:mm format', () => {
    expect(pipe.transform(2.5, 'hh:mm')).toBe('02:30');
  });

});
