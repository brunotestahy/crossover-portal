import { OfflineAccessResponse } from 'app/core/models/google/offline-access-response.model';

export interface Auth2 {
  grantOfflineAccess(prompt: { prompt: string }): Promise<OfflineAccessResponse>;
}
