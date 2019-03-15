import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CurrentUserDetail } from 'app/core/models/identity';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

@Component({
  selector: 'app-my-logbook-page',
  templateUrl: './my-logbook-page.component.html',
  styleUrls: ['./my-logbook-page.component.scss'],
})
export class MyLogbookPageComponent implements OnInit {
  public date$: Observable<Date>;

  @Input()
  public userDetail: CurrentUserDetail | null = null;

  @Input()
  public assignmentId: number | null = null;

  @Input()
  public managerControl = false;

  constructor(
    private dashboardService: UserDashboardService
  ) { }

  public ngOnInit(): void {
    this.date$ = this.dashboardService.getDateStream();
  }
}
