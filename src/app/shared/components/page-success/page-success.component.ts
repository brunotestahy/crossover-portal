import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnChanges } from '@angular/core';

import { PageAlertComponent } from '../page-alert/page-alert.component';

@Component({
  selector: 'app-page-success',
  templateUrl: './page-success.component.html',
  styleUrls: ['./page-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSuccessComponent extends PageAlertComponent implements AfterViewInit, OnChanges {

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

}
