import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Task } from 'app/core/models/task';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';

@Component({
  selector: 'app-background-check',
  templateUrl: './background-check.component.html',
  styleUrls: ['./background-check.component.scss'],
})
export class BackgroundCheckComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex align-items-center flex-grow';

  public form: FormGroup;
  public error: string | null;
  public isPending = false;
  public task: Task;

  constructor(
    private assignmentService: AssignmentService,
    private identityService: IdentityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.form = new FormGroup({
      code: new FormControl(null, Validators.required),
    });

    this.identityService.getCurrentUserTasks().subscribe(tasks => {
      if (tasks.length > 0) {
        this.task = tasks[0];
      }
    });
  }

  public onSubmit(): void {
    if (this.form.valid && !this.isPending) {
      this.isPending = true;
      this.error = null;
      const object = this.task.object as { id: number };
      this.assignmentService.candidateProvideBackgroundCode(
        object.id.toString(),
        this.form.controls.code.value)
        .pipe(
          finalize(() => this.isPending = false)
        )
        .subscribe(
          () => this.router.navigate(['..', 'finishing-up'], {relativeTo: this.activatedRoute}),
          err => this.error = err.error.text
        );
    }
  }

}
