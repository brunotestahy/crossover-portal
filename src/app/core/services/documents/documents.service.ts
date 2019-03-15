import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const DOCUMENTS_PATH = '/assets/documents/';

@Injectable()
export class DocumentsService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getPrivacyPolicyDocument(): Observable<string> {
    return this.getFile('privacy_policy.md');
  }

  public getSupportDocument(): Observable<string> {
    return this.getFile('support.md');
  }

  public getBestPracticesDocument(): Observable<string> {
    return this.getFile('best_practices.md');
  }

  public getCandidateFAQDocument(): Observable<string> {
    return this.getFile('candidate_faq.md');
  }

  public getManagerFAQDocument(): Observable<string> {
    return this.getFile('manager_faq.md');
  }

  public getCandidateTerms(): Observable<string> {
    return this.getFile('agreement.md');
  }

  private getFile(fileName: string): Observable<string> {
    return this.httpClient.get(`${DOCUMENTS_PATH}${fileName}`, {
      responseType: 'text',
    });
  }

}
