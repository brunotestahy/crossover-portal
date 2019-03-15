import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ApplicationProcessService {

  private currentStepSubmission = new BehaviorSubject<number>(1);
  private moveToStepSubmission = new Subject<number>();

  public currentStepSubmission$ = this.currentStepSubmission.asObservable();
  public moveToStepSubmission$ = this.moveToStepSubmission.asObservable();

  constructor() {}

  public currentStep(step: number): void {
    this.currentStepSubmission.next(step);
  }

  public moveToStep(step: number): void {
    this.moveToStepSubmission.next(step);
  }

}
