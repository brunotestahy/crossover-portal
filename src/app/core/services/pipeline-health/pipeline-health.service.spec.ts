import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import * as moment from 'moment';

import { PipelineHealthFilters, PipelineHealthWeekFilters } from 'app/core/models/job-health/index';
import { PipelineHealthService } from 'app/core/services/pipeline-health/pipeline-health.service';
import { environment } from 'environments/environment';

describe('PaymentInfoService', () => {
  let httpMock: HttpTestingController;
  let service: PipelineHealthService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          PipelineHealthService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = getTestBed().get(HttpTestingController);
    service = getTestBed().get(PipelineHealthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getJobHealthDetail', () => {
    it('should delegate call the endpoint for response', () => {
      service.getJobHealthDetail(1).subscribe(res => res);
      const request = httpMock.expectOne(
        environment.apiPath +
        `/hire/jobs/health/1`
      );
      expect(request.request.method).toBe('GET');
      httpMock.verify();
    });
  });

  describe('getJobsHealth', () => {
    it('should delegate call the endpoint for response', () => {
      service.getJobsHealth({
        options: {
          jobType: 'CUSTOM',
          searchQuery: 'someText',
        },
      })
      .subscribe(res => res);
      const request = httpMock.expectOne(
        environment.apiPath +
        `/hire/jobs/health?jobType=CUSTOM&searchQuery=someText`
      );
      expect(request.request.method).toBe('GET');
      httpMock.verify();
    });
  });

  describe('getJobsHealthWeek', () => {
    it('should delegate call the endpoint for response', () => {
      const startOfWeek = moment(new Date('2017-12-20T03:06:01Z'));
      service.getJobsHealthWeek({
        startOfWeek: startOfWeek.toDate(),
        options: {
          jobType: 'CUSTOM',
          searchQuery: 'someText',
        },
      })
      .subscribe(res => res);
      const request = httpMock.expectOne(
        environment.apiPath +
        `/hire/jobs/health/week/${startOfWeek.format('YYYY-MM-DD')}?jobType=CUSTOM&searchQuery=someText`
      );
      expect(request.request.method).toBe('GET');
      httpMock.verify();
    });
  });

  describe('getJobsHealth no searchQuery', () => {
    it('should delegate call the endpoint for response', () => {
      service.getJobsHealth(<PipelineHealthFilters>{
        options: {
          jobType: 'CUSTOM',
        },
      })
      .subscribe(res => res);
      const request = httpMock.expectOne(
        environment.apiPath +
        `/hire/jobs/health?jobType=CUSTOM`
      );
      expect(request.request.method).toBe('GET');
      httpMock.verify();
    });
  });

  describe('getJobsHealthWeek no searchQuery', () => {
    it('should delegate call the endpoint for response', () => {
      const startOfWeek = moment(new Date('2017-12-20T03:06:01Z'));
      service.getJobsHealthWeek(<PipelineHealthWeekFilters>{
        startOfWeek: startOfWeek.toDate(),
        options: {
          jobType: 'CUSTOM',
        },
      })
      .subscribe(res => res);
      const request = httpMock.expectOne(
        environment.apiPath +
        `/hire/jobs/health/week/${startOfWeek.format('YYYY-MM-DD')}?jobType=CUSTOM`
      );
      expect(request.request.method).toBe('GET');
      httpMock.verify();
    });
  });
});
