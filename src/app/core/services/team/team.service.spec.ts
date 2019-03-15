import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { TeamService } from 'app/core/services/team/team.service';
import { environment } from 'environments/environment';

describe('TeamService', () => {
  let httpMock: HttpTestingController;
  let teamService: TeamService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          TeamService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    teamService = TestBed.get(TeamService);
  });

  it('should be created', () => expect(teamService).toBeTruthy());

  it('[store] should delegate call the endpoint for response', () => {
    const avatarType = 'SAMPLE_APP_TYPE';
    const requestContent = Object.assign({});
    const responseContent = Object.assign({});
    teamService.store(requestContent, avatarType)
      .pipe(take(1))
      .subscribe(res => expect(res).toEqual(responseContent));

    const request = httpMock.expectOne(
      `${environment.apiPath}/teams?avatarType=${avatarType}`
    );
    expect(request.request.method).toBe('POST');
    request.flush(responseContent);
    httpMock.verify();
  });

  it('[demand] should delegate call the endpoint for response', () => {
    const teamId = 10;
    const job = Object.assign({});
    const responseContent = Object.assign({});
    teamService.demand(teamId, job)
      .pipe(take(1))
      .subscribe(res => expect(res).toEqual(responseContent));

    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/${teamId}/demands`
    );
    expect(request.request.method).toBe('POST');
    request.flush(responseContent);
    httpMock.verify();
  });

  it('should get team statistics successfully', () => {
   const teamId = '123';
   const managerId = '234';

   const responseContent = Object.assign({overdueIssuesCount: 321});
   teamService.getTeamStatistics(teamId, managerId)
     .subscribe(res => expect(res).toEqual(responseContent));

   const request = httpMock.expectOne(
     `${environment.apiPath}/teams/123/workflows/statistics?managerId=234`
   );
   expect(request.request.method).toBe('GET');
   request.flush(responseContent);
   httpMock.verify();
 });
});
