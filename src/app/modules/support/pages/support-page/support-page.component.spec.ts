import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';

import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { DocumentsServiceMock } from '../../../../core/services/documents/documents.service.mock';

import { SupportPageComponent } from './support-page.component';

describe('SupportComponent', () => {
  let component: SupportPageComponent;
  let fixture: ComponentFixture<SupportPageComponent>;
  let documentsService: DocumentsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [ SupportPageComponent ],
        providers: [
            { provide: DocumentsService, useClass: DocumentsServiceMock },
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    documentsService = getTestBed().get(DocumentsService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load the document on ngOnInit', () => {
    spyOn(documentsService, 'getSupportDocument');

    component.ngOnInit();

    expect(documentsService.getSupportDocument).toHaveBeenCalled();
    expect(component.markdown$).toBe(documentsService.getSupportDocument());
  });

});
