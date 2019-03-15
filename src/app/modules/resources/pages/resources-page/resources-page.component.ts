import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DocumentsService } from 'app/core/services/documents/documents.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-resources-page',
  templateUrl: './resources-page.component.html',
  styleUrls: ['./resources-page.component.scss'],
})
export class ResourcesPageComponent implements OnInit, OnDestroy {

  public markdown$: Observable<string>;

  public isManager = false;

  public destroy$ = new Subject();

  constructor(
    private documentsService: DocumentsService,
    private identityService: IdentityService
  ) { }

  public ngOnInit(): void {
    this.markdown$ = this.documentsService.getBestPracticesDocument();
    this.identityService.currentUserIsManager()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(isManager => {
        this.isManager = isManager;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
