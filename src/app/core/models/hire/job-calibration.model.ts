import { AccountManager } from 'app/core/models/account-manager/account-manager.model';

export interface JobCalibration {
    id: number;
    descriptionApprovalRequestedBy?: AccountManager;
    testApprovalRequestedBy?: AccountManager;
    testApprovalStatus?: string;
    activatedOn?: number;
}
