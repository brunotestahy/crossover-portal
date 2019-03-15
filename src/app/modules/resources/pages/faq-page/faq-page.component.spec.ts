import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT_TOKEN } from 'app/core/tokens/document.token';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { DocumentsService } from 'app/core/services/documents/documents.service';
import { FaqPageComponent } from 'app/modules/resources/pages/faq-page/faq-page.component';

class DocumentsServiceMock implements Partial<DocumentsService> {

  public getManagerFAQDocument(): Observable<string> {
    return of('');
  }

  public getCandidateFAQDocument(): Observable<string> {
    return of('');
  }
}

class DocumentMock implements Partial<Document> {

  public querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E> {
    if (selectors === 'app-markdown-viewer div > ul > li') {
      return <NodeListOf<E>> {
        'length': 1,
        'item': (_index: number) => (<Element> document.createElement('div')),
      };
    } else {
      return <NodeListOf<E>> {
        'length': 1,
        'item': (_index: number) => (<Element> document.createElement('div')),
      };
    }
  }
}

describe('FaqPageComponent/Unknown', () => {
  let component: FaqPageComponent;
  let fixture: ComponentFixture<FaqPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        schemas: [ NO_ERRORS_SCHEMA ],
        declarations: [ FaqPageComponent ],
        providers: [
          { provide: ActivatedRoute, useValue: { params: of({ type: '' }) }},
          { provide: DocumentsService, useClass: DocumentsServiceMock },
          { provide: DOCUMENT_TOKEN, useValue: new DocumentMock() },
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load the manager document on ngOnInit', () => {
    const EXPECTED_MARKDOWN = '';

    component.ngOnInit();

    component.markdown$.subscribe(res => {
      expect(res).toBe(EXPECTED_MARKDOWN);
    });
  });

});

describe('ResourcesFaqComponent/Manager', () => {
  let component: FaqPageComponent;
  let fixture: ComponentFixture<FaqPageComponent>;
  let documentsService: DocumentsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        schemas: [ NO_ERRORS_SCHEMA ],
        declarations: [ FaqPageComponent ],
        providers: [
          { provide: ActivatedRoute, useValue: { params: of({ type: 'manager' }) }},
          { provide: DocumentsService, useClass: DocumentsServiceMock },
          { provide: DOCUMENT_TOKEN, useValue: new DocumentMock() },
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    documentsService = getTestBed().get(DocumentsService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load the manager document on ngOnInit', () => {
    const EXPECTED_MARKDOWN = 'sample-manager';
    spyOn(documentsService, 'getManagerFAQDocument').and
      .returnValue(of(EXPECTED_MARKDOWN));

    component.ngOnInit();

    component.markdown$.subscribe(res => {
      expect(res).toBe(EXPECTED_MARKDOWN);
    });
  });

});

describe('ResourcesFaqComponent/Candidate', () => {
  let component: FaqPageComponent;
  let fixture: ComponentFixture<FaqPageComponent>;
  let documentsService: DocumentsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        schemas: [ NO_ERRORS_SCHEMA ],
        declarations: [ FaqPageComponent ],
        providers: [
          { provide: ActivatedRoute, useValue: { params: of({ type: 'candidate' }) }},
          { provide: DocumentsService, useClass: DocumentsServiceMock },
          { provide: DOCUMENT_TOKEN, useValue: new DocumentMock() },
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    documentsService = getTestBed().get(DocumentsService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load the manager document on ngOnInit', () => {
    const EXPECTED_MARKDOWN = 'sample-candidate';
    spyOn(documentsService, 'getCandidateFAQDocument').and
      .returnValue(of(EXPECTED_MARKDOWN));

    component.ngOnInit();

    component.markdown$.subscribe(res => {
      expect(res).toBe(EXPECTED_MARKDOWN);
    });
  });

});
