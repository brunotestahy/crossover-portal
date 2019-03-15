import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';

import { JobSourcingForm, JobSourcingResponse } from 'app/core/models/job-sourcing';

const API = {
    getJobsSourcing: `${environment.apiPath}/hire/jobs/sourcing`,
    putjobsSourcing: `${environment.apiPath}/hire/jobs/%(id)s/sourcing`,
};

@Injectable()
export class PipelineSourcingService {
    constructor(private httpClient: HttpClient) { }

    public getJobsSourcing(): Observable<JobSourcingResponse> {
        return this.httpClient.get<JobSourcingResponse>(API.getJobsSourcing);
    }

    public updateJobSourcing(id: number, data: JobSourcingForm): Observable<string> {
        return this.httpClient.put<string>(
            sprintf(API.putjobsSourcing, { id }), data
        );
    }
}
