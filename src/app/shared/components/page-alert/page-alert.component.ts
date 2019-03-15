import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-page-alert',
  templateUrl: './page-alert.component.html',
  styleUrls: ['./page-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageAlertComponent implements AfterViewInit, OnChanges {

  @Input()
  public text: string;

  constructor(protected elementRef: ElementRef) { }

  public ngOnChanges(): void {
    this.scrollTo();
  }

  public ngAfterViewInit(): void {
    this.scrollTo();
  }

  private scrollTo(): void {
    this.elementRef.nativeElement.scrollIntoView({behavior: 'smooth'});
  }

}
