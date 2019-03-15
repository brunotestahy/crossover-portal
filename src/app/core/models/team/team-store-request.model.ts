import { CurrentUserDetail } from 'app/core/models/identity';

export interface TeamStoreRequest {
  name: string;
  teamOwner: CurrentUserDetail;
}
