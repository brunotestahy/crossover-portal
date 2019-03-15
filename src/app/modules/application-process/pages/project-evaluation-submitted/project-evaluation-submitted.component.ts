import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-evaluation-submitted',
  templateUrl: './project-evaluation-submitted.component.html',
  styleUrls: ['./project-evaluation-submitted.component.scss'],
})
export class ProjectEvaluationSubmittedComponent implements OnInit {
  public ngOnInit(): void {
    const body = document.querySelector('.application-process__body') as HTMLBodyElement;
    body.scrollTop = 0;
  }
}
