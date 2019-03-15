import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CandidateService } from '../../../../core/services/candidate/candidate.service';

@Component({
  selector: 'app-written-evaluation-welcome',
  templateUrl: './written-evaluation-welcome.component.html',
  styleUrls: ['./written-evaluation-welcome.component.scss'],
})
export class WrittenEvaluationWelcomeComponent implements OnInit {
  public constructor(private candidateService: CandidateService,
                     private router: Router,
                     private route: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.candidateService.getCurrentApplication()
      .subscribe((application) => {
        const testReached = !!application.testInstances
          .map(value => value.test)
          .map(value => value.type)
          .filter((v: string) => v === 'FIVEQ')
          .length;

        if (testReached) {
          this.router.navigate(['../written-evaluation-assignment'],
            {relativeTo: this.route});
        }
      });
  }
}
