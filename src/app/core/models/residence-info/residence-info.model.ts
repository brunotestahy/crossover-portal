import { EntityInfo } from 'app/core/models/residence-info/entity-info.model';
import { PersonalInfo } from 'app/core/models/residence-info/personal-info.model';

export interface ResidenceInfo {
  workingThroughEntity: boolean;
  personalInfo?: PersonalInfo;
  entityInfo?: EntityInfo;
}
