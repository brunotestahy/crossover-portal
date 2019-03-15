import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DocumentsService } from '../../../../core/services/documents/documents.service';

@Component({
  selector: 'app-support-page',
  templateUrl: './support-page.component.html',
  styleUrls: ['./support-page.component.scss'],
})
export class SupportPageComponent implements OnInit {

  public markdown$: Observable<string>;

  constructor(private documentsService: DocumentsService) { }

  public ngOnInit(): void {
    this.markdown$ = this.documentsService.getSupportDocument();
  }

}
