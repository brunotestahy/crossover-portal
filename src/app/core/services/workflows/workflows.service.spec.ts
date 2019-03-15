import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { WorkflowsService } from 'app/core/services/workflows/workflows.service';
import { environment } from 'environments/environment';

describe('WorkflowsService', () => {
  let httpMock: HttpTestingController;
  let service: WorkflowsService;

  beforeEach(
    async(() => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WorkflowsService,
      ],
    }))
  );

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(WorkflowsService);
  });

  it('should be created', () => expect(service).toBeTruthy());

  it('should get servers successfully', () => {
    const responseContent = [Object.assign({id: 321})];
    service.getServers()
      .subscribe(res => expect(res).toEqual(responseContent));

    const request = httpMock.expectOne(
      `${environment.apiPath}/workflows/servers`
    );
    expect(request.request.method).toBe('GET');
    request.flush(responseContent);
    httpMock.verify();
  });

  it('should get workflow goals successfully', () => {
    const teamId = '123';

    const responseContent = Object.assign({id: 321});
    service.getWorkflowGoals(teamId)
      .subscribe(res => expect(res).toEqual(responseContent));

    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/123/workflows/goals`
    );
    expect(request.request.method).toBe('GET');
    request.flush(responseContent);
    httpMock.verify();
  });

  it('should get workflow states successfully', () => {
    const teamId = '123';

    const responseContent = Object.assign({id: 321});
    service.getWorkflowStates(teamId)
      .subscribe(res => expect(res).toEqual(responseContent));

    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/123/workflows/states`
    );
    expect(request.request.method).toBe('GET');
    request.flush(responseContent);
    httpMock.verify();
  });
});
