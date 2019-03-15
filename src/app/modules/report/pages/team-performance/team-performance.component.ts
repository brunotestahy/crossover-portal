import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DfToasterService } from '@devfactory/ngx-df';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { finalize } from 'rxjs/operators';

import { Company, CompanyResponse } from 'app/core/models/company';
import { Team } from 'app/core/models/team/team.model';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ReportService } from 'app/core/services/report/report.service';
import { DeepPartial } from 'app/core/type-guards/deep-partial';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-team-performance',
  templateUrl: './team-performance.component.html',
  styleUrls: ['./team-performance.component.scss'],
})
export class TeamPerformanceComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public error: string;
  public info: string;
  public companies: Company[];
  public teams: DeepPartial<Team>[];
  public isLoading = false;
  public isAdmin = false;
  public isManager = false;
  public isDownloading = false;
  public form: FormGroup = new FormGroup({
    company: new FormControl(),
    period: new FormControl(),
  });
  public peroid = [
    {
      value: 'WEEK',
      label: 'Weekly',
    },
    {
      value: 'MONTH',
      label: 'Monthly',
    },
    {
      value: 'QUARTER',
      label: 'Quarterly',
    },
  ];
  public selectedGranularity = this.peroid[0].value;

  constructor(
    private reportService: ReportService,
    private identityService: IdentityService,
    private toaster: DfToasterService
  ) { }

  public ngOnInit(): void {
    combineLatest(
      this.identityService.currentUserIsManager(),
      this.identityService.currentUserIsAdmin()
    ).subscribe(([isManager, isAdmin]) => {
      this.isAdmin = isAdmin;
      this.isManager = isManager;
      if (isAdmin) {
        const pageNumber = 0;
        this.getAllCompanies(pageNumber);
      } else if (isManager) {
        this.getTeams();
      }
    });
  }

  public downloadCsv(): void {
    this.isDownloading = true;
    const option = this.form.value.company.name
      ? this.form.value.company.name
      : this.form.value.company;
    const pastWeeks = 52;
    const period = this.form.value.period;
    this.error = '';
    if (this.isAdmin) {
      const companyId = this.form.value.company.id;
      const params = {
        option,
        pastWeeks: pastWeeks.toString(),
        period,
        ...companyId && { companyId },
      };
      this.reportService
        .getCompanyPerformanceReportFile(params)
        .pipe(finalize(() => this.isDownloading = false))
        .subscribe(
          () => this.toaster.popSuccess('You will be emailed a CSV file shortly.'),
          (error) => {
            if (isApiError(error)) {
              this.error = error.error.text;
            } else {
              this.error = 'Error downloading CSV';
            }
          });
    } else if (this.isManager) {
      const teamId = this.form.value.company.id;
      const params = {
        option,
        pastWeeks: pastWeeks.toString(),
        period,
        ...teamId && { teamId },
      };
      this.reportService
        .getTeamPerformanceReportFile(params)
        .pipe(finalize(() => this.isDownloading = false))
        .subscribe(
          () => this.toaster.popSuccess('You will be emailed a CSV file shortly.'),
          (error) => {
            if (isApiError(error)) {
              this.error = error.error.text;
            } else {
              this.error = 'Error downloading CSV';
            }
          });
    }
  }

  public periodChange(option: string): void {
    this.error = '';
    this.info = '';
    this.selectedGranularity = option;
    /* istanbul ignore else */
    if (['MONTH', 'QUARTER'].indexOf(option) !== -1) {
      this.info = 'Note: For Month/Quarter granularities, the report will display the weekly average, not totals.';
    }
  }

  private getAllCompanies(pageNumber: number): void {
    this.isLoading = true;
    this.companies = [];
    this.reportService.getCompanies(pageNumber)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: CompanyResponse) => {
        this.companies = this.companies.concat(data.content);
        pageNumber++;
        for (pageNumber; pageNumber < data.totalPages - 1; pageNumber++) {
          this.reportService.getCompanies(pageNumber).subscribe(
            (res: CompanyResponse) => {
              this.companies = this.companies.concat(res.content);
            }, (error) => {
              if (isApiError(error)) {
                this.error = error.error.text;
              } else {
                this.error = 'Error fetching country list';
              }
            }
          );
        }
        this.companies.sort((a, b) => (a.name ? a.name : '').localeCompare((b.name ? b.name : '')));
      }, (error) => {
        if (isApiError(error)) {
          this.error = error.error.text;
        } else {
          this.error = 'Error fetching country list';
        }
      });
  }

  private getTeams(): void {
    this.isLoading = true;
    const direct = false;
    const projection = 'COLLECTION_0';
    this.reportService.getTeams(projection, direct)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(teams => {
        this.teams = teams.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      }, (error) => {
        if (isApiError(error)) {
          this.error = error.error.text;
        } else {
          this.error = 'Error fetching team list';
        }
      });
  }
}
