import { Agreement } from 'app/core/models/agreement/agreement.model';
import { Assignment } from 'app/core/models/assignment/assignment.model';
import { Candidate } from 'app/core/models/candidate/candidate.model';
import { Company } from 'app/core/models/company/company.model';
import { Manager } from 'app/core/models/manager/manager.model';
import { MetricSetup } from 'app/core/models/metric/metric-setup.model';
import { TeamAverage } from 'app/core/models/team/team-average.model';
import { TeamCategory } from 'app/core/models/team/team-category.model';
import { TeamDemand } from 'app/core/models/team/team-demand.model';
import { TeamTemplate } from 'app/core/models/team/team-template.model';
import { Team } from 'app/core/models/team/team.model';
import { WorkflowJiraProject } from 'app/core/models/workflow/workflow-jira-project.model';
import { WorkflowStateMapping } from 'app/core/models/workflow/workflow-state-mapping.model';

export interface Team {
  activeAssignments?: Array<Assignment>;
  agreements?: Array<Agreement>;
  company?: Company | Array<Company>;
  createdOn?: string;
  deleted?: boolean;
  demands?: Array<TeamDemand>;
  dfcteamId?: number;
  id: number;
  members?: Partial<Candidate>[];
  marketplaceStatus?: string;
  metricsSetups?: Array<MetricSetup>;
  name?: string;
  productivtyAvg?: TeamAverage;
  reportingManagers?: Array<Manager>;
  teamCategory?: TeamCategory;
  teamOwner?: Manager;
  teamTemplate?: TeamTemplate;
  updatedOn?: string;
  watchers?: Array<Manager>;
  weeklyCost?: number;
  workflowJiraProject?: WorkflowJiraProject;
  workflowStateMapping?: WorkflowStateMapping | WorkflowStateMapping[];
  metricSetups?: { name: string }[];
}
