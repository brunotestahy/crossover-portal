import { AllowedFlowType } from 'app/core/models/application';

export interface ApplicationFlowStep {
  id: string;
  name: string;
  title: string;
  order: number;
  clazz: string;
  description: string;
  allowedFlowTypes: AllowedFlowType[];
  state: {
    names: string[]
  };
}
