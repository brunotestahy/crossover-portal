import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { maxBy, minBy, reduce } from 'ramda';
import { finalize, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import {
  CampaignStatistic,
  JobSourcingDetailsResponse,
} from 'app/core/models/job-sourcing';
import { HireService } from 'app/core/services/hire/hire.service';


@Component({
  selector: 'app-pipeline-sourcing-details',
  templateUrl: './pipeline-sourcing-details.component.html',
  styleUrls: ['./pipeline-sourcing-details.component.scss'],
})
export class PipelineSourcingDetailsComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public isResponsive: boolean;
  public error = '';
  public isLoading = false;
  public destroy$ = new Subject();

  public sourcingDetails: JobSourcingDetailsResponse;

  public totalCandidates: number | null = null;
  public totalCandidatesLastDay: number | null = null;
  public totalCandidatesLast7Days: number | null = null;
  public averageScore: number | null = null;
  public averageScoreLastDay: number | null = null;
  public averageScoreLast7Days: number | null = null;

  // totals
  public gridTotal = 0;
  public gridTotalDay = 0;
  public gridTotalWeek = 0;
  public gridAverage = 0;
  public gridAverageDay = 0;
  public gridAverageWeek = 0;

  public campaignMostApplicants: CampaignStatistic | null = null;
  public campaignLeastApplicants: CampaignStatistic | null = null;
  public campaignBestScore: CampaignStatistic | null = null;
  public campaignLowestScore: CampaignStatistic | null = null;

  constructor(
    private hireService: HireService,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.params
      .pipe(
        finalize(() => this.isLoading = false),
        switchMap(params => this.hireService.getJobSourcingDetails(params.id))
      )
      .subscribe(
        sourcing => {
          this.sourcingDetails = sourcing;
          // reset calculations
          this.gridTotal = 0;
          this.gridTotalDay = 0;
          this.gridTotalWeek = 0;
          this.gridAverage = 0;
          this.gridAverageDay = 0;
          this.gridAverageWeek = 0;
          /* istanbul ignore else */
          if (sourcing.campaignsStatistics.length > 0) {
            this.campaignBestScore = reduce(
              maxBy<CampaignStatistic>(campaign => campaign.avgScore),
              sourcing.campaignsStatistics[0],
              sourcing.campaignsStatistics
            );
            this.campaignLowestScore = reduce(
              minBy<CampaignStatistic>(campaign => campaign.avgScore),
              sourcing.campaignsStatistics[0],
              sourcing.campaignsStatistics
            );
            this.campaignMostApplicants = reduce(
              maxBy<CampaignStatistic>(campaign => campaign.total),
              sourcing.campaignsStatistics[0],
              sourcing.campaignsStatistics
            );
            this.campaignLeastApplicants = reduce(
              minBy<CampaignStatistic>(campaign => campaign.total),
              sourcing.campaignsStatistics[0],
              sourcing.campaignsStatistics
            );
            // single loop to get all computed data
            this.sourcingDetails.campaignsStatistics.forEach(campaign => {
              this.gridTotal += campaign.total;
              this.gridTotalDay += campaign.total1;
              this.gridTotalWeek += campaign.total7;
              this.gridAverage += campaign.avgScore;
              this.gridAverageDay += campaign.avgScore1;
              this.gridAverageWeek += campaign.avgScore7;
            });
            this.gridAverage /= sourcing.campaignsStatistics.length;
            this.gridAverageDay /= sourcing.campaignsStatistics.length;
            this.gridAverageWeek /= sourcing.campaignsStatistics.length;
          }
        },
        () => this.error = 'Error loading pipeline sourcing details.'
      );
  }

}
