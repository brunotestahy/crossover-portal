import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DfLoadingSpinnerService } from '@devfactory/ngx-df';

import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { NotificationService } from 'app/core/services/notification/notification.service';

@Component({
  selector: 'app-setup-tracker',
  templateUrl: './setup-tracker.component.html',
  styleUrls: ['./setup-tracker.component.scss'],
})
export class SetupTrackerComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'flex-grow d-block';

  public form: FormGroup;

  public error: string | null;

  public isPending = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loader: DfLoadingSpinnerService,
    private assignmentsService: AssignmentService,
    private notificationService: NotificationService
  ) {
  }

  public ngOnInit(): void {
    this.form = new FormGroup({
      password: new FormControl(null, Validators.required),
    });
  }

  public onSubmit(): void {
    if (this.form.valid && !this.isPending) {
      this.isPending = true;
      this.error = null;
      const task = this.notificationService.getActiveTaskValue();
      /* istanbul ignore else */
      if (task) {
        this.loader.showLoader({});
        const object = task.object as { id: number };
        this.assignmentsService
          .provideUserPassword(object.id, this.form.value.password)
          .subscribe(
            () => {
              this.loader.hide();
              this.isPending = false;
              this.router.navigate(['../setup-residence'], { relativeTo: this.activatedRoute });
            },
            error => {
              this.loader.hide();
              this.isPending = false;
              this.error = error.error.text;
            });
      }
    }
  }
}
