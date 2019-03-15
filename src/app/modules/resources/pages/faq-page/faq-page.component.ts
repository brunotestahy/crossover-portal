import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators/switchMap';
import { Observable } from 'rxjs/Observable';

import { DocumentsService } from 'app/core/services/documents/documents.service';
import { DOCUMENT_TOKEN } from 'app/core/tokens/document.token';

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss'],
})
export class FaqPageComponent implements OnInit {

  public markdown$: Observable<string | null>;

  constructor(private activatedRoute: ActivatedRoute,
    private documentsService: DocumentsService,
    @Inject(DOCUMENT_TOKEN) private document: Document
  ) { }

  public ngOnInit(): void {
    this.markdown$ = this.activatedRoute.params
      .pipe(
        switchMap(p => {
          const type: string = p.type;
          if (type === 'candidate') {
            return this.documentsService.getCandidateFAQDocument();
          }
          if (type === 'manager') {
            return this.documentsService.getManagerFAQDocument();
          }
          return of('');
        }),
        tap(() => {
          setTimeout(() => {
            const elements = this.document.querySelectorAll('app-markdown-viewer div > ul > li');
            for (let i = 0; i < elements.length; i++) {
              const element = elements.item(i);
              const arrow = document.createElement('i');
              arrow.setAttribute('class', 'fa fa-angle-right');
              element.appendChild(arrow);
            }

            const targets = this.document.querySelectorAll(
              'app-markdown-viewer div > ul > li,' +
              'app-markdown-viewer div > ul > li > p'
            );

            for (let i = 0; i < targets.length; i++) {
              const target = targets.item(i) as HTMLParagraphElement;
              target.addEventListener('click', function(this: HTMLElement, event: MouseEvent): void {
                const eventTarget = Object.assign(event.target) as HTMLElement;
                if (eventTarget !== this) {
                  return;
                }
                let targetElement: Element;
                if (eventTarget.localName === 'p') {
                  targetElement = eventTarget.offsetParent;
                } else {
                  targetElement = this;
                }
                targetElement.classList.toggle('expanded');
              });
            }
          });
        })
      );
  }

}
