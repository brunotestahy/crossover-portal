import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DocumentsService } from '../../../../core/services/documents/documents.service';

@Component({
  selector: 'app-privacy-policy-page',
  templateUrl: './privacy-policy-page.component.html',
  styleUrls: ['./privacy-policy-page.component.scss'],
})
export class PrivacyPolicyPageComponent implements OnInit {

  public markdown$: Observable<string>;

  constructor(private documentsService: DocumentsService) { }

  public ngOnInit(): void {
    this.markdown$ = this.documentsService.getPrivacyPolicyDocument();
  }

}
