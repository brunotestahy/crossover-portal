import { TestBed } from '@angular/core/testing';

import { OnlineStatusService } from 'app/core/services/timetracking/online-status.service';

describe('OnlineStatusService', () => {
  let service: OnlineStatusService;

  beforeEach(
    () => TestBed.configureTestingModule({
      imports: [],
      providers: [
        OnlineStatusService,
      ],
    })
    .compileComponents()
    .then(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2018-06-07T03:24:00'));
      service = TestBed.get(OnlineStatusService);
    })
  );

  afterEach(() => jasmine.clock().uninstall());

  it('should retrieve the first matching work diary successfully', () => {
    const candidateId = 1;
    const workDiary = Object.assign({ candidateId });
    const assignmentBySelection = Object.assign({
      selection: {
        marketplaceMember: {
          application: {
            candidate: { id: candidateId },
          },
        },
      },
    });
    const assignmentByCandidateId = Object.assign({ candidate: { id: candidateId } });

    const resultBySelection = service.getWorkDiary(assignmentBySelection, [workDiary]);
    const resultByCandidateId = service.getWorkDiary(assignmentByCandidateId, [workDiary]);

    expect(resultBySelection).toBe(workDiary);
    expect(resultByCandidateId).toBe(workDiary);
  });

  it('should get offline class when the last offline time was more than 1 hour 9 minutes ago', () => {
    const date = new Date('2018-06-07T02:10:00');
    const workDiary = Object.assign({ date });

    const result = service.getWorkDiaryOnlineStatusClass(workDiary);

    expect(result).toBe('offline');
  });

  it('should get online text when the last online time was less than 30 minutes ago', () => {
    const date = new Date('2018-06-07T03:10:00');
    const workDiary = Object.assign({ date });

    const result = service.getWorkDiaryOnlineStatusText(workDiary);

    expect(result).toBe('Online');
  });

  it('should get idle text when the last online time was less than 1 hour 9 minutes ago', () => {
    const date = new Date('2018-06-07T02:20:00');
    const workDiary = Object.assign({ date });

    const result = service.getWorkDiaryOnlineStatusText(workDiary);

    expect(result).toBe('Last online: <1 hour ago');
  });

  it('should get offline text when the last online time was over 1 hour 9 minutes ago', () => {
    const date = new Date('2018-06-07T01:24:00');
    const workDiary = Object.assign({ date });

    const result = service.getWorkDiaryOnlineStatusText(workDiary);

    expect(result).toBe('Last online: 2 hour(s) ago');
  });

  it('should get offline text when the last online time was over 1 day ago', () => {
    const date = new Date('2018-06-06T01:24:00');
    const workDiary = Object.assign({ date });

    const result = service.getWorkDiaryOnlineStatusText(workDiary);

    expect(result).toBe('Last online: 1 day(s) ago');
  });
});
