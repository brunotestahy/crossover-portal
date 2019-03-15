import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { JobApplication } from 'app/core/models/application';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-technical-screen',
  templateUrl: './technical-screen.component.html',
  styleUrls: ['./technical-screen.component.scss'],
})
export class TechnicalScreenComponent implements OnInit {

  public username: string | undefined;
  public password: string | undefined;
  public url: string | undefined;
  public form: FormGroup;

  constructor(private service: CandidateService) {
  }

  public ngOnInit(): void {
    this.initForm();
    this.service.getCurrentApplication()
      .subscribe((application: JobApplication) => {
        const test = application.testInstances.filter(ti => ti.test.type === 'HACKER_RANK')[0];
        this.username = test.username;
        this.password = test.password;
        this.url = test.url;

        this.form.controls.username.setValue(this.username);
        this.form.controls.password.setValue(this.password);
      });
  }

  public goToTest(): void {
    window.open(
      this.url,
      '_blank'
    );
  }

  private initForm(): void {
    this.form = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
    });
  }
}
