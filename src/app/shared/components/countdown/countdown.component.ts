import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import * as difference_in_days from 'date-fns/difference_in_days';
import * as parse from 'date-fns/parse';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'df-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit, OnDestroy {
  public static readonly INTERVAL = 60000;

  private timerId: number;

  private startTimeDate: Date;
  private endTimeDate: Date;
  private diff: Date;

  @HostBinding('class')
  public readonly classes = 'df-countdown';

  public diffDays: number;
  public diffHours: number;
  public diffMinutes: number;

  public isIE: Boolean = false;

  @Input()
  public start: number | string | Date;
  @Input()
  public end: number | string | Date;

  constructor() {
    this.isIE = navigator.appName.toLocaleLowerCase().search('microsoft') > -1;
  }

  public ngOnInit(): void {
    if (this.end) {
      this.endTimeDate = parse(this.end);
    } else {
      throw new Error('[end] input required!');
    }

    this.calculate();
    this.startTimer();
  }

  public ngOnDestroy(): void {
    window.clearInterval(this.timerId);
  }

  private calculate(): void {
    this.startTimeDate = this.start
      ? parse(this.start)
      : new Date();
    this.diff = new Date(this.endTimeDate.getTime() - this.startTimeDate.getTime());

    this.calculateDays();
    this.calculateHours();
    this.calculateMinutes();
  }

  private calculateDays(): void {
    this.diffDays = Math.abs(difference_in_days(this.startTimeDate, this.endTimeDate));
  }

  private calculateHours(): void {
    this.diffHours = this.diff.getUTCHours();
  }

  private calculateMinutes(): void {
    this.diffMinutes = this.diff.getMinutes();
  }

  private startTimer(): void {
    this.timerId = window.setInterval(() => {
      this.calculate();
    }, CountdownComponent.INTERVAL);
  }

}
