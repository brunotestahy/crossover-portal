import { async, getTestBed, TestBed } from '@angular/core/testing';

import { Applicant, JobDetails, ResumeRubricWeight } from 'app/core/models/hire';
import { APPLICANTS_RESPONSE } from 'app/core/services/mocks/applicants.mock';
import { EndorsementService } from 'app/modules/account-manager/shared/endorsement.service';

describe('EndorsementService', () => {
  let service: EndorsementService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [
          EndorsementService,
        ],
      });
    }),
  );

  beforeEach(() => {
    service = getTestBed().get(EndorsementService);
  });

  it('should get the rubrics when the endorsement screen is initialized', () => {
    const data = Object.assign({
      tests: [
        {
          test: {
            resumeRubrics: [{
              resumeRubric: {
                id: 1,
                type: 'PRE_DEFINED',
              },
            }],
            type: 'RESUME_RUBRIC',
          },
        }, {
          test: {
            resumeRubrics: [{
              resumeRubric: {
                id: 2,
                type: 'PRE_DEFINED',
              },
            }],
            type: 'RESUME_RUBRIC',
          },
        }, {
          test: {
            resumeRubrics: [{
              resumeRubric: {
                id: 3,
                type: 'CUSTOM',
              },
            }],
            type: 'FIVEQ_ANSWER',
          },
        },
      ],
    }) as JobDetails;
    expect(service.getRubrics(data).length).toBe(1);
    expect(service.rubrics).toBeDefined();
  });

  it('should create data models with no rubrics', () => {
    const data = Object.assign(APPLICANTS_RESPONSE.content.slice(0, 1), {}) as Applicant[];
    service.createDataModels(data);
    expect(service.appScores).toBeDefined();
  });

  it('should create data models with rubrics', () => {
    service.rubrics = Object.assign([{
      id: 1,
    }], {}) as ResumeRubricWeight[];
    const data = Object.assign(APPLICANTS_RESPONSE.content.slice(0, 1), {}) as Applicant[];
    service.createDataModels(data);
    expect(service.appScores).toBeDefined();
  });

  it('should create Rubric data models when the applicant is loaded', () => {
    service.appScores = {
      '1': 2,
    };
    service.rubrics = Object.assign([{
      id: 1,
      test: { id: 1 },
    }], {}) as ResumeRubricWeight[];
    const newApplicant = Object.assign({
      id: 1,
      tests: {
        rubrics: {
          resumeRubricScores: [
            { resumeRubric: { id: 1 }, score: 5 },
            { resumeRubric: { id: 2 }, score: 10 },
          ],
        },
      },
      testScores: [
        {
          test: {
            type: 'RESUME_RUBRIC',
          },
        },
      ],
    }) as Applicant;
    service.createRubricsDataModels(newApplicant);
    expect(service.appScores).toBeDefined();
  });
});
