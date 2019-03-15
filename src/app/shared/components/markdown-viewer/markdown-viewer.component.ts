import { Component, Inject, Input, OnChanges } from '@angular/core';
import * as showdown from 'showdown';

import { SHOWDOWN_CONVERTER_TOKEN } from '../../../core/tokens/showdown.token';

@Component({
  selector: 'app-markdown-viewer',
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.scss'],
})
export class MarkdownViewerComponent implements OnChanges {

  @Input()
  public markdown: string;

  public html = '';

  constructor(@Inject(SHOWDOWN_CONVERTER_TOKEN) private showdownConverter: showdown.Converter) { }

  public ngOnChanges(): void {
    this.html = this.showdownConverter.makeHtml(this.markdown);
  }

}
