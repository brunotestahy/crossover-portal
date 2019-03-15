import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appScrollRange]',
})
export class ScrollRangeDirective implements OnInit {
  protected lasValueEmitted: boolean;

  @Input() scrollParent: ElementRef;
  @Input() range: number[];
  @Input() margin: number = 20;
  @Output() rangeChange: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    let parentScrollTop: number;
    let inRange: boolean;

    this.scrollParent.nativeElement.addEventListener('scroll', (event: { target: { scrollTop: number } }) => {
      parentScrollTop = event.target.scrollTop;
      inRange = parentScrollTop > this.range[0] - this.margin && parentScrollTop < this.range[1] + this.margin;
      if (this.lasValueEmitted !== inRange) {
        this.rangeChange.emit(inRange);
        this.lasValueEmitted = inRange;
      }
    });
  }
}
