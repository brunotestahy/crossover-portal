import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-written-evaluation-submitted',
  templateUrl: './written-evaluation-submitted.component.html',
  styleUrls: ['./written-evaluation-submitted.component.scss'],
})
export class WrittenEvaluationSubmittedComponent implements OnInit {

  @ViewChild('card', {read: ElementRef})
  public card: ElementRef;

  public ngOnInit(): void {
    this.card.nativeElement.scrollIntoView({
      inline: 'start',
      block: 'start',
      behavior: 'smooth',
    });
  }

}
