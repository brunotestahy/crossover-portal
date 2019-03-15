import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DfButtonModule,
  DfCheckboxModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { DocumentsService } from 'app/core/services/documents/documents.service';
import { CandidateTermsComponent } from 'app/modules/candidate-terms/pages/candidate-terms/candidate-terms.component';

describe('CandidateTermsComponent', () => {
  let component: CandidateTermsComponent;
  let fixture: ComponentFixture<CandidateTermsComponent>;

  let documentService: DocumentsService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CandidateTermsComponent,
      ],
      imports: [
        DfButtonModule,
        DfCheckboxModule,
        DfValidationMessagesModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: DocumentsService, useFactory: () => mock(DocumentsService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateTermsComponent);
    component = fixture.componentInstance;

    documentService = TestBed.get(DocumentsService);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the terms text successfully when the screen is loaded', () => {
    const termsMock = 'text';
    spyOn(documentService, 'getCandidateTerms').and.returnValue(of(termsMock).pipe(take(1)));

    fixture.detectChanges();

    component.markdown$.subscribe((result: string) => expect(result).toBe(termsMock));
  });

  it('should navigate to the location screen when the terms are accepted', () => {
    const termsMock = 'text';
    spyOn(documentService, 'getCandidateTerms').and.returnValue(of(termsMock).pipe(take(1)));
    fixture.detectChanges();

    component.form.patchValue({ accept: true });
    spyOn(router, 'navigate');

    component.accept();

    expect(router.navigate).toHaveBeenCalledWith(['/signup/location']);
  });

  it('should not navigate to the location screen when the terms are not accepted', () => {
    const termsMock = 'text';
    spyOn(documentService, 'getCandidateTerms').and.returnValue(of(termsMock).pipe(take(1)));
    spyOn(router, 'navigate');

    fixture.detectChanges();

    component.accept();

    expect(router.navigate).not.toHaveBeenCalledWith();
  });
});
