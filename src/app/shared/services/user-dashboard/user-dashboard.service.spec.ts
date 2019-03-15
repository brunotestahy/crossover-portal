
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';

import { TeamDashboard } from 'app/core/models/time-tracking/team-dashboard.model';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';
import { environment } from 'environments/environment';

describe('UserDashboardService', () => {
  let httpMock: HttpTestingController;
  let service: UserDashboardService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          UserDashboardService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = getTestBed().get(HttpTestingController);
    service = getTestBed().get(UserDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get team list successfully', () => {
    const managerId = 1;
    const teamId = 2;
    const sample_response = {} as TeamDashboard;
    service.getTeamDashboard(false, managerId, teamId).subscribe(res => {
      expect(res).toBeDefined();
      expect(res).toBe(sample_response);
    });
    const request = httpMock.expectOne(
      `${environment.apiPath}/internal/teams/dashboard?directOnly=false&managerId=${managerId}&teamId=${teamId}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(sample_response);
    httpMock.verify();
  });
});
