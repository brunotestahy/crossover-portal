import { Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DfGroupToggleItem } from '@devfactory/ngx-df';
import { format } from 'date-fns';
import { finalize } from 'rxjs/operators';

import { Company } from 'app/core/models/company';
import { Team } from 'app/core/models/team';
import { EnforcerService } from 'app/core/services/enforcer/enforcer.service';
import { ReportService } from 'app/core/services/report/report.service';
import { DeepPartial } from 'app/core/type-guards/deep-partial';

@Component({
  selector: 'app-enforcer-reports',
  templateUrl: './enforcer-reports.component.html',
  styleUrls: ['./enforcer-reports.component.scss'],
})
export class EnforcerReportsComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public date = new Date();
  public successMessage = '';
  public error = '';
  public selectedTeam = '';
  public isDownloading = false;
  public teams: DeepPartial<Team>[];

  public form: FormGroup;
  public items: DfGroupToggleItem[] = [
    {
      text: 'Hours Worked Report',
      id: 'HOURS_WORKED',
    },
    {
      text: 'Weekly Disputed Summary Report',
      id: 'DISPUTED_SUMMARY',
    },
    {
      text: 'Weekly Disputed Detail Report',
      id: 'DISPUTED_DETAIL',
    },
  ];
  public selectedReportType = this.items[0];

  constructor(
    private enforcerService: EnforcerService,
    private reportService: ReportService,
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.getTeams();
    this.form = this.formBuilder.group({
      teamId: [''],
      reportType: [this.items[0]],
    });
  }

  public getTeams(): void {
    const projection = 'COLLECTION_0';
    const activeAssignments = true;
    const avatarType = 'ENFORCER';
    const direct = true;
    this.reportService.getTeams(projection, direct, avatarType, activeAssignments)
      .subscribe(teams => {
        this.teams = teams;
        this.teams.sort(
          (teamA, teamB) => {
            const companyA = teamA.company as Company;
            const companyB = teamB.company as Company;
            return (companyA.name as string).localeCompare(companyB.name as string);
          }
        );
      }, () =>
          this.error = 'Error fetching Team list.');
  }

  public onDateChange(date: Date): void {
    this.date = date;
  }

  public generateReport(): void {
    this.successMessage = '';
    this.error = '';
    this.isDownloading = true;
    this.enforcerService.generateReports(
      this.form.value.reportType.id,
      this.form.value.teamId,
      format(this.date, 'YYYY-MM-DD')
    )
      .pipe(finalize(() => this.isDownloading = false))
      .subscribe(
        () =>
          this.successMessage = 'This report will take a couple of minutes for us to generate. We will send it your email on file.'
        , () =>
          this.error = 'Error fetching reports.'
      );

  }
}
