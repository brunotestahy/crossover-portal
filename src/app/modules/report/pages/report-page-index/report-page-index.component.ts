import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-report-page-index',
    templateUrl: './report-page-index.component.html',
    styleUrls: ['./report-page-index.component.scss'],
})
export class ReportPageIndexComponent {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';
}
