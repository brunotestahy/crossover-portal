import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnChanges } from '@angular/core';

import { PageAlertComponent } from '../page-alert/page-alert.component';

@Component({
  selector: 'app-page-info',
  templateUrl: './page-info.component.html',
  styleUrls: ['./page-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageInfoComponent extends PageAlertComponent implements AfterViewInit, OnChanges {

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

}
