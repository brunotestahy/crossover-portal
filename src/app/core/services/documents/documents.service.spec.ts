import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';

import { DocumentsService } from './documents.service';

describe('DocumentsService', () => {
  let httpMock: HttpTestingController;
  let service: DocumentsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentsService],
    });
  }));

  beforeEach(() => {
    httpMock = getTestBed().get(HttpTestingController);
    service = getTestBed().get(DocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve the privacy_policy.md content on getPrivacyPolicyDocument()', () => {
    const SAMPLE_RESPONSE = 'Sample Privacy Policy';
    service.getPrivacyPolicyDocument().subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBe(SAMPLE_RESPONSE);
    });

    const request = httpMock.expectOne('/assets/documents/privacy_policy.md');
    request.flush(SAMPLE_RESPONSE);
  });

  it('should retrieve the support.md content on getSupportDocument()', () => {
    const SAMPLE_RESPONSE = 'Sample Support';
    service.getSupportDocument().subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBe(SAMPLE_RESPONSE);
    });

    const request = httpMock.expectOne('/assets/documents/support.md');
    request.flush(SAMPLE_RESPONSE);
  });

  it('should retrieve the best_practices.md content on getBestPracticesDocument()', () => {
    const SAMPLE_RESPONSE = 'Sample Best Practices';
    service.getBestPracticesDocument().subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBe(SAMPLE_RESPONSE);
    });

    const request = httpMock.expectOne('/assets/documents/best_practices.md');
    request.flush(SAMPLE_RESPONSE);
  });

  it('should retrieve the candidate_faq.md content on getCandidateFAQDocument()', () => {
    const SAMPLE_RESPONSE = 'Sample Best Practices';
    service.getCandidateFAQDocument().subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBe(SAMPLE_RESPONSE);
    });

    const request = httpMock.expectOne('/assets/documents/candidate_faq.md');
    request.flush(SAMPLE_RESPONSE);
  });

  it('should retrieve the manager_faq.md content on getManagerFAQDocument()', () => {
    const SAMPLE_RESPONSE = 'Sample Best Practices';
    service.getManagerFAQDocument().subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBe(SAMPLE_RESPONSE);
    });

    const request = httpMock.expectOne('/assets/documents/manager_faq.md');
    request.flush(SAMPLE_RESPONSE);
  });

});
