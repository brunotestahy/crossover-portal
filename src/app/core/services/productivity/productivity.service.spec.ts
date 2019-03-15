import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { CheckIn } from 'app/core/models/productivity/check-in.model';
import { ProductivityFilters } from 'app/core/models/productivity/productivity-filters.model';
import { ActivityInfoMapService } from 'app/core/services/productivity/activity-info-map.service';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { TopBottomPerformerCalculatorService } from 'app/core/services/productivity/top-bottom-performer-calculator.service';
import { environment } from 'environments/environment';

describe('ProductivityService', () => {
  let httpMock: HttpTestingController;
  let service: ProductivityService;
  let activityInfoMapService: ActivityInfoMapService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          ActivityInfoMapService,
          ProductivityService,
          TopBottomPerformerCalculatorService,
        ],
      });
    }
  ));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(ProductivityService);
    activityInfoMapService = TestBed.get(ActivityInfoMapService);
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-06-20T05:45:00'));
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProductivityGroups', () => {
    it('should delegate call the endpoint for response', () => {
      service.getProductivityGroups(<ProductivityFilters>{
        assignmentId: '1',
        date: '2018-01-01',
        weekly: 'true',
      })
      .subscribe(res => res);
      const request = httpMock.expectOne(
        environment.apiPath +
        `/tracker/activity/groups?assignmentId=1&date=2018-01-01&weekly=true`
      );
      expect(request.request.method).toBe('GET');
      httpMock.verify();
    });
  });

  it('[getDailyPlanned] should delegate call the endpoint for response', () => {
    const groups = 'groups';
    const assignmentId = 11;
    const teamId = 13;
    service.getDailyPlanned(assignmentId.toString(), groups, teamId.toString())
      .subscribe(() => {});

    const request = httpMock.expectOne(
      environment.apiPath +
      `/productivity/activities/daily-planned?assignmentId=${assignmentId}&groups=${groups}&refresh=false&teamId=${teamId}`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[getReviews] should delegate call the endpoint for response', () => {
    const avatarType = 'CANDIDATE';
    const managerId = '1';
    const teamId = '1';
    const date = '2018-06-02';

    service.getReviews(avatarType, managerId, teamId, date).subscribe(() => true);

    const request = httpMock.expectOne(
      environment.apiPath +
      `/productivity/reviews?avatarType=${avatarType}&teamId=${teamId}&managerId=${managerId}&date=${date}`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[getReviews] should delegate call the endpoint for response (with cache preventing option)', () => {
    const avatarType = 'CANDIDATE';
    const managerId = '1';
    const teamId = '1';
    const date = '2018-06-02';
    const preventCache = new Date().getTime();

    service.getReviews(avatarType, managerId, teamId, date, true).subscribe(() => true);

    const request = httpMock.expectOne(
      environment.apiPath +
      `/productivity/reviews?avatarType=${avatarType}` +
      `&teamId=${teamId}&managerId=${managerId}&date=${date}&preventCache=${preventCache}`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[getPerformers] should retrieve processed assignments', () => {
    const managerId = '1';
    const teamId = '1';
    const date = '2018-06-02';
    const weeksCount = '9';
    const response = Object.assign({
      assignments: [{}, {}],
    });

    spyOn(activityInfoMapService, 'map');
    service.getPerformers(managerId, teamId, date, weeksCount)
      .subscribe(() => expect(activityInfoMapService.map).toHaveBeenCalledTimes(2));

    const request = httpMock.expectOne(
      environment.apiPath +
      `/teams/${teamId}/productivity/summary?managerId=${managerId}&weeksCount=${weeksCount}&date=${date}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    httpMock.verify();
  });

  it('[getProductivityAverage] should retrieve the productivity average', () => {
    const avatarType = 'CANDIDATE';
    const managerId = '1';
    const teamId = '1';
    const date = '2018-06-02';
    const weeksCount = '4';
    const response = Object.assign({
      assignments: [{}, {}],
    });

    service.getProductivityAverage(avatarType, managerId, teamId, date, weeksCount)
      .subscribe(() => true);

    const request = httpMock.expectOne(
      environment.apiPath +
      `/teams/${teamId}/productivity/average?avatarType=${avatarType}&managerId=${managerId}&weeksCount=${weeksCount}&date=${date}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    httpMock.verify();
  });

  it('[getActivities] should delegate call the endpoint for response', () => {
    const managerId = '1';
    const teamId = '2';
    service.getActivities(managerId, teamId).subscribe(() => {});

    const request = httpMock.expectOne(
      `${environment.apiPath}/productivity/activities?managerId=${managerId}&teamId=${teamId}`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[getDailyActivity] should delegate call the endpoint for response', () => {
    const date = '2018-01-01';
    const managerId = '11';
    const assignmentId = '1';
    const teamId = '2';
    const response = Object.assign({});

    service.getDailyActivity(
      date,
      'groups',
      managerId,
      assignmentId,
      teamId
    )
    .subscribe(
      data => expect(data).toBe(response)
    );

    const request = httpMock.expectOne(
      `${environment.apiPath}/tracker/activity/groups?` +
      `date=${date}&assignmentId=${assignmentId}&groups=groups&managerId=${managerId}&teamId=${teamId}&fullTeam=false&refresh=false`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    httpMock.verify();
  });

  it('[getWeeklyActivity] should delegate call the endpoint for response', () => {
    const date = '2018-01-01';
    const managerId = '11';
    const assignmentId = '1';
    const teamId = '2';

    service.getWeeklyActivity(
      date,
      'groups',
      managerId,
      assignmentId,
      teamId
    )
    .subscribe(() => true);

    const request = httpMock.expectOne(
      `${environment.apiPath}/tracker/activity/groups?` +
      `date=${date}&assignmentId=${assignmentId}&groups=groups&managerId=${managerId}` +
      `&teamId=${teamId}&weekly=true&fullTeam=false&refresh=false`
    );

    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('should get manager check-ins', () => {
    const response = [] as CheckIn[];
    service.getManagerCheckIns('start', 'end', 1, 1).subscribe(res => {
      expect(res).toBeDefined();
    });
    const request = httpMock.expectOne(
      `${environment.apiPath}/productivity/managers/checkins?from=start&to=end&managerId=1&teamId=1`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    httpMock.verify();
  });

  it('should get summary', () => {
    const response = [] as CheckIn[];
    service.getSummary(1, '1', 1).subscribe(res => {
      expect(res).toBeDefined();
    });
    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/1/productivity/summary?weeksCount=1&managerId=1`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    httpMock.verify();
  });

  it('should get block streaks', () => {
    const response = [] as CheckIn[];
    service.getBlocksStreaks('1', 1).subscribe(res => {
      expect(res).toBeDefined();
    });
    const request = httpMock.expectOne(
      `${environment.apiPath}/productivity/checkins/blocks-streak?teamId=1&managerId=1`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    httpMock.verify();
  });
});
