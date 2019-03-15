import { ResidenceInfo } from 'app/core/models/residence-info';

export interface AccountInfoFormData {
  accountInfo: {
    firstName: string;
    lastName: string;
  };
  residenceInfo: ResidenceInfo;
}
