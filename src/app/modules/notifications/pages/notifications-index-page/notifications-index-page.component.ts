import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { map, tap } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

import { ReadableTask } from 'app/core/models/task';
import { NotificationService } from 'app/core/services/notification/notification.service';

@Component({
  selector: 'app-notifications-index-page',
  templateUrl: './notifications-index-page.component.html',
  styleUrls: ['./notifications-index-page.component.scss'],
})
export class NotificationsIndexPageComponent implements OnInit, OnDestroy {
  public list: ReadableTask[] = [];

  public destroy$ = new Subject();

  public isLoading = true;

  constructor(private notificationService: NotificationService) { }

  public ngOnInit(): void {
    this.notificationService.getReadableTaskList()
      .pipe(
        takeUntil(this.destroy$),
        map((list: ReadableTask[]) => {
          return list.slice().sort((a, b) => {
            if (a.updated > b.updated) {
              return -1;
            }
            if (a.updated < b.updated) {
              return 1;
            }
            return 0;
          });
        }),
        tap(() => this.isLoading = false)
      ).subscribe((list: ReadableTask[]) => {
        this.list = list;
      });
  }

  public filterUpdated(): ReadableTask[] {
    return this.list.filter(x => x.updated);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
