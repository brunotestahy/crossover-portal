import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as momentTz from 'moment-timezone';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Job } from 'app/core/models/hire';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Interviewee } from 'app/core/models/interview';
import { ReadableTask, Task } from 'app/core/models/task';
import { Team } from 'app/core/models/team';
import { Timezone } from 'app/core/models/timezone';
import { NOTIFICATION_TEMPLATE } from 'app/core/services/notification/notification-template';
import { environment } from 'environments/environment';

const URLs = {
  currentUserTasks: environment.apiPath + '/identity/users/current/tasks',
};

@Injectable()
export class NotificationService {
  private currentTasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  private activeTask: BehaviorSubject<Task | null> = new BehaviorSubject<Task | null>(null);

  public templates = NOTIFICATION_TEMPLATE;

  constructor(private http: HttpClient) {
  }

  public getCurrentTasksValue(): Task[] {
    return this.currentTasks.getValue();
  }

  public getCurrentTasks(): Observable<Task[]> {
    return this.currentTasks.asObservable();
  }

  public setActiveTask(task: Task | null): void {
    this.activeTask.next(task || null);
  }

  public getActiveTaskValue(): Task | null {
    return this.activeTask.getValue();
  }

  public getActiveTask(): Observable<Task | null> {
    return this.activeTask.asObservable();
  }

  public getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(URLs.currentUserTasks).pipe(
      tap((tasks: Task[]) => this.currentTasks.next(tasks))
    );
  }

  /*
   * Get Notification array from task list
   * it parse whole task objet and map it to
   * respective notification and return notification array
  */
  public getReadableTaskList(): Observable<ReadableTask[]> {
    return this.getTasks().pipe(
      map(tasks => {
        return tasks.map(task => {
          let template = this.templates.find(
            t => t.taskType === task.taskType
          );
          if (!template) {
            template = {
              taskType: '',
              message: '',
              url: '',
            };
          }
          const notification = {} as ReadableTask;
          let url = template.url;
          const object = task.object;
          let txt = template.message;
          if (object && object.id) {
            if (
              task.taskType === 'candidateAttendsInterview' ||
              task.taskType === 'candidateWasRescheduled' ||
              task.taskType === 'candidateAcceptsDeclinesInterview'
            ) {
              txt = template.message
                .replace(
                  /%DATE%/,
                  this.getUserLocalTime(
                    Object.assign(object.selection.marketplaceMember.application.candidate),
                    object.startDateTime as string
                  )
                )
                .replace(/%NAME%/, object.selection.manager.printableName as string)
                .replace(
                  /%POSITION%/,
                  (object.selection.marketplaceMember.application.job as Job).title
                );
            } else if (task.taskType === 'leaderTeamInterview_INITIAL') {
              txt = template.message
                .replace(/%NAME%/, object.selection.manager.printableName as string)
                .replace(/%TEAM%/, (object.selection.team as Team).name as string);
            } else if (task.taskType === 'hmTeamInterview_CANDIDATE_ACCEPTED') {
              txt = template.message
                .replace(
                  /%DATE%/,
                  this.getUserLocalTime(
                    Object.assign(object.selection.manager),
                    object.startDateTime as string
                  )
                )
                .replace(/%NAME%/, (object.interviewee as Interviewee).printableName)
                .replace(/%TEAM%/, (object.selection.team as Team).name as string);
            } else if (
              task.taskType === 'leaderTeamInterview_CANDIDATE_ACCEPTED'
            ) {
              txt = template.message
                .replace(
                  /%DATE%/,
                  this.getUserLocalTime(
                    Object.assign(object.interviewee as {}),
                    object.startDateTime as string
                  )
                )
                .replace(/%NAME%/, object.selection.manager.printableName as string)
                .replace(/%TEAM%/, (object.selection.team as Team).name as string);
            } else if (task.taskType === 'managerConductsInterview') {
              txt = template.message
                .replace(
                  /%DATE%/,
                  this.getUserLocalTime(
                    Object.assign(object.selection.manager),
                    object.startDateTime as string
                  )
                )
                .replace(
                  /%NAME%/,
                  object.selection.marketplaceMember.application.candidate.printableName as string
                )
                .replace(
                  /%POSITION%/,
                  (object.selection.marketplaceMember.application.job as Job).title
                );
            } else if (
              task.taskType === 'managerDecidesOnSelection' ||
              task.taskType === 'managerSelectsTeam'
            ) {
              txt = template.message.replace(
                /%NAME%/,
                object.selection.marketplaceMember.application.candidate.printableName as string
              );
            }
            url = template.url.replace(/%ID%/, object.id.toString());
            notification.updated = object.updatedOn as string;
          }
          const message = txt.replace(/%URL%/, url);
          notification.message = message;
          return notification;
        });
      })
    );
  }

  public getUserLocalTime(user: CurrentUserDetail, startDateTime: string): string {
    const timeZone = user.location.timeZone as Timezone;
    return momentTz(startDateTime).tz(timeZone.name).format('MMM DD, YYYY hh:mm a');
  }
}
