import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { DfModalService, DfModalSize } from '@devfactory/ngx-df';
import { format } from 'date-fns';

import { Assignment } from 'app/core/models/assignment/index';
import { CurrentUserDetail } from 'app/core/models/identity/current-user-detail.model';
import { TimeUtilsService } from 'app/shared/services/timeutils/time-utils.service';

@Component({
  selector: 'app-picture-card',
  templateUrl: './picture-card.component.html',
  styleUrls: ['./picture-card.component.scss'],
})
export class PictureCardComponent {

  public viewSkype = false;
  public viewSalary = false;
  public isProfile = false;

  @Input()
  public userDetail: CurrentUserDetail | null = null;

  @Input()
  public assignment: Assignment | null = null;

  @ViewChild('endContractModal')
  public endContractModal: TemplateRef<{}>;

  @Input()
  public managerControl = false;

  constructor(
    private timeUtilsService: TimeUtilsService,
    private modalService: DfModalService
  ) { }

  public showSalary(): void {
    this.viewSalary = true;
  }

  public hideSalary(): void {
    this.viewSalary = false;
  }

  public getUserTimezone(offset: number): Date {
    return this.timeUtilsService.getUtc(undefined, offset);
  }

  public isFeatureEnabled(feature: string): boolean {
    if (this.assignment) {
      return !(this.assignment.disabledFeatures && this.assignment.disabledFeatures.length > 0
        && this.assignment.disabledFeatures.indexOf(feature) > -1);
    }
    return false;
  }

  public toggleSkypeOptions(): void {
    this.viewSkype = !this.viewSkype;
  }

  public showEndContractModal(): void {
    if (this.assignment && !this.assignment.scheduledTerminationDate) {
      this.modalService.open(this.endContractModal, {
        size: DfModalSize.Large,
      });
    }
  }

  public getTooltipText(lastDay: Date): string {
    return `This contractor is scheduled to terminate on ${format(lastDay, 'MMM D, YYYY')}`;
  }

  public onEndContract(date: string): void {
    if (this.assignment) {
      this.assignment.scheduledTerminationDate = date;
    }
  }
}
