import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { JobSourcingResponse } from 'app/core/models/job-sourcing';
import { PipelineSourcingService } from 'app/core/services/pipeline-sourcing/pipeline-sourcing.service';
import { environment } from 'environments/environment';

describe('PipelineSourcingService', () => {
  let httpMock: HttpTestingController;
  let service: PipelineSourcingService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          PipelineSourcingService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(PipelineSourcingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getJobsSourcing', () => {
    it('should delegate call the endpoint for response', () => {
      const SAMPLE_RESPONSE = {};
      service.getJobsSourcing()
        .subscribe(response => expect(response).toEqual(<JobSourcingResponse>SAMPLE_RESPONSE));
      const request = httpMock.expectOne(
        environment.apiPath +
        `/hire/jobs/sourcing`
      );
      expect(request.request.method).toBe('GET');
      request.flush(SAMPLE_RESPONSE);
      httpMock.verify();
    });
  });

  describe('updateJobSourcing', () => {
    it('should delegate call the endpoint for response', () => {
      const SAMPLE_RESPONSE = '';
      const id = 1;
      const data = {
        jbpEnabled: true,
        jbpInstructions: 'test',
        outboundEnabled: true,
        outboundInstructions: 'test',
        priority: 1,
        sourcingInstructions: 'test',
      };
      service.updateJobSourcing(id, data)
        .subscribe(response => expect(response).toEqual(<string>SAMPLE_RESPONSE));
      const request = httpMock.expectOne(
        environment.apiPath +
        `/hire/jobs/1/sourcing`
      );
      expect(request.request.method).toBe('PUT');
      request.flush(SAMPLE_RESPONSE);
      httpMock.verify();
    });
  });
});
