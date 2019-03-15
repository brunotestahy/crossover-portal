import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';

import { ReportsService } from 'app/core/services/reports/reports.service';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          ReportsService
        ],
      });
    })
  );

  beforeEach(() => {
    service = getTestBed().get(ReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('[getActivitiesDescription] should get activities description', () =>
    expect(service.getActivitiesDescription()).toBeDefined()
  );

  it('[downloadIndividualReport] should get individual report', () =>
    expect(service.downloadIndividualReport('MEETING', '2018-01-07')).toBeDefined()
  );

  it('[downloadTeamReport] should get individual report', () => {
    expect(service.downloadTeamReport('MEETING', '2018-01-07', [1, 2])).toBeDefined();
  });

  it('[downloadLoggedHoursReport] should get individual report', () => {
    expect(service.downloadLoggedHoursReport('2018-01-07', [1, 2])).toBeDefined();
  });

});
