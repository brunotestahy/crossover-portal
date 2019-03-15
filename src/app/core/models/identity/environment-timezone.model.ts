import { sprintf } from 'sprintf-js';

export class EnvironmentTimezone {
  constructor(
    public timezoneOffset: number
  ) {
  }

  public get humanReadable(): string {
    const minutesPerHour = 60;
    const symbol = this.timezoneOffset < 0 ? '+' : '-';
    const unsignedOffset = Math.abs(this.timezoneOffset);

    const minutes = unsignedOffset % minutesPerHour;
    const hours = (unsignedOffset - minutes) / minutesPerHour;

    return `${symbol}${this.padNumber(hours)}:${this.padNumber(minutes)}`;
  }

  private padNumber(input: number): string {
    return sprintf('%02d', input);
  }
}
