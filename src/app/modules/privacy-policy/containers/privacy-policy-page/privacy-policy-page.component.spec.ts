import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';

import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { DocumentsServiceMock } from '../../../../core/services/documents/documents.service.mock';

import { PrivacyPolicyPageComponent } from './privacy-policy-page.component';

describe('PrivacyPolicyComponent', () => {
  let component: PrivacyPolicyPageComponent;
  let fixture: ComponentFixture<PrivacyPolicyPageComponent>;
  let documentsService: DocumentsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        schemas: [ NO_ERRORS_SCHEMA ],
        declarations: [ PrivacyPolicyPageComponent ],
        providers: [
            { provide: DocumentsService, useClass: DocumentsServiceMock },
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    documentsService = getTestBed().get(DocumentsService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load the document on ngOnInit', () => {
    spyOn(documentsService, 'getPrivacyPolicyDocument');

    component.ngOnInit();

    expect(documentsService.getPrivacyPolicyDocument).toHaveBeenCalled();
    expect(component.markdown$).toBe(documentsService.getPrivacyPolicyDocument());
  });

});
