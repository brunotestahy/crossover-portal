import { Interviewee } from 'app/core/models/interview';
import { InterviewReport } from 'app/core/models/interview-report/interview-report.model';
import { Manager } from 'app/core/models/manager/manager.model';
import { MarketplaceMember } from 'app/core/models/marketplace-member/marketplace-member.model';

export interface InterviewReportWithSelection extends InterviewReport {
  createdOn: string;
  interviewee: Interviewee;
  selection: {
    manager: Manager;
    marketplaceMember: MarketplaceMember;
  };
}
