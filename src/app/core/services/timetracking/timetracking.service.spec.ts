import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';

import { WorkDiariesFilters } from 'app/core/models/logbook';
import { TimesheetFilters, TimetrackingService } from 'app/core/services/timetracking/timetracking.service';

describe('TimetrackingService', () => {
  let httpMock: HttpTestingController;
  let service: TimetrackingService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          TimetrackingService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = getTestBed().get(HttpTestingController);
    service = getTestBed().get(TimetrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('[getWorkDiaries] should delegate call the endpoint for response', () => {
    service.getWorkDiaries(<WorkDiariesFilters>{
      assignmentId: 13,
      date: '2018-04-13',
      timeZoneId: 513,
    })
    .subscribe(res => res);
    const request = httpMock.expectOne(
      environment.apiPath +
      `/timetracking/workdiaries?assignmentId=13&date=2018-04-13&timeZoneId=513`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[getWorkDiaries] without timezone id - should delegate call the endpoint for response', () => {
    service.getWorkDiaries(<WorkDiariesFilters>{
      assignmentId: 13,
      date: '2018-04-13',
    })
    .subscribe(res => res);
    const request = httpMock.expectOne(
      environment.apiPath +
      `/timetracking/workdiaries?assignmentId=13&date=2018-04-13`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[getLatestWorkDiaries] should delegate call the endpoint for response', () => {
    const managerId = '1';
    const teamId = '1';
    service.getLatestWorkDiaries({
      fullTeam: 'false',
      managerId,
      teamId,
    })
    .subscribe(res => res);
    const request = httpMock.expectOne(
      environment.apiPath +
      `/timetracking/workdiaries/latest?fullTeam=false&managerId=${managerId}&teamId=${teamId}`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[getTimesheets] should delegate call the endpoint for response', () => {
    service.getTimesheets(<TimesheetFilters>{
      teamId: 1,
      managerId: 1,
      userId: 1,
      date: '2018-01-01',
      isCacheAccess: true,
      period: 'MONTH',
    })
    .subscribe(res => res);
    const request = httpMock.expectOne(
      environment.apiPath +
      `/timetracking/timesheets?teamId=1&managerId=1&userId=1&date=2018-01-01&isCacheAccess=true&period=MONTH`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[getTimesheets] without params - should delegate call the endpoint for response', () => {
    service.getTimesheets(<TimesheetFilters>{}).subscribe(res => res);
    const request = httpMock.expectOne(
      environment.apiPath +
      `/timetracking/timesheets`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[getTimesheets] with cacheAccess - should delegate call the endpoint for response', () => {
    service.getTimesheets(<TimesheetFilters>{
      isCacheAccess: true,
    })
    .subscribe(res => res);
    const request = httpMock.expectOne(
      environment.apiPath +
      `/timetracking/timesheets?isCacheAccess=true`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[deleteTimecards] should delegate call the endpoint for response', () => {
    service.deleteTimecards([1, 2]).subscribe(() => {
    });
    const request = httpMock.expectOne(
      `${environment.apiPath}/timetracking/workdiaries?id=1&id=2`
    );
    expect(request.request.method).toBe('DELETE');
  });

  it('[addManualTimeCard] should delegate call the endpoint for response', () => {
    service.addManualTimeCard({
      assignmentId: 13,
      approved: false,
      createDate: '',
      endTime: '',
      endTimeSel: '',
      memo: '',
      startTime: '',
      startTimeSel: '',
      timeZoneId: 1,
    })
    .subscribe(res => res);
    const request = httpMock.expectOne(`${environment.apiPath}/timetracking/workdiaries?assignmentId=13`);
    expect(request.request.method).toBe('POST');
    httpMock.verify();
  });

  it('[addWorkDiaryAction] should delegate call the endpoint for response', () => {
    const workdiaryFilters = {
      action: 'SET_MEETING_TIME',
      assignmentId: 13,
      comment: '',
      timecards: [],
    };
    service.addWorkdiaryAction(workdiaryFilters).subscribe(() => {});
    const request = httpMock.expectOne(`${environment.apiPath}/timetracking/workdiaries` +
      `?action=${workdiaryFilters.action}&assignmentId=${workdiaryFilters.assignmentId}`);
    expect(request.request.method).toBe('PUT');
    httpMock.verify();
  });

  it('[getTeamsTimesheet] should delegate call the endpoint for response', () => {
    service.getTeamsTimesheet({
      managerId: 1,
      teamId: 1,
      period: 'period',
      date: 'date',
      fullTeam: true,
    }).subscribe(res => res);
    const request = httpMock.expectOne(
      environment.apiPath +
      `/v2/timetracking/timesheets/assignment?directOnly=false&managerId=1&teamId=1&period=period&date=date&fullTeam=true`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });
});
