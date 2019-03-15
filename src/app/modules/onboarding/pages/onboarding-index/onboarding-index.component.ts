import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StepDefinition } from 'app/core/models/assignment';
import { Task } from 'app/core/models/task';
import { NotificationService } from 'app/core/services/notification/notification.service';

import {
  ONBOARDING_PROCESS_STEP_DEF,
} from 'app/core/constants/onboarding-process';

@Component({
  selector: 'app-onboarding-index',
  templateUrl: './onboarding-index.component.html',
  styleUrls: ['./onboarding-index.component.scss'],
})
export class OnboardingIndexComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex align-items-center flex-grow';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
  }

  public ngOnInit(): void {
    const assignmentId = this.route.snapshot.params['id'];

    this.notificationService.getTasks()
      .subscribe(tasks => {
        const task = tasks.find(
            v => v.object !== undefined && (v.object.id.toString() === assignmentId.toString())) as Task;
        this.notificationService.setActiveTask(task);
        this.goToStep(task);
      });
  }

  private goToStep(task: Task | null): void {
    if (!task) {
      this.router.navigate(['finishing-up'], { relativeTo: this.route });
      return;
    }

    if (task.taskType === ONBOARDING_PROCESS_STEP_DEF[0].names[0]) {
      this.router.navigate(['welcome'], { relativeTo: this.route });
      return;
    }

    const currentStepDefinition: StepDefinition | undefined = ONBOARDING_PROCESS_STEP_DEF.find(t => {
      return t.names.indexOf(task.taskType) > -1;
    });

    if (currentStepDefinition) {
      const currentState = currentStepDefinition.state || '';
      this.router.navigate([currentState], { relativeTo: this.route });
    }
  }
}
