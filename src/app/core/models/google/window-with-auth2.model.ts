import { Auth2 } from 'app/core/models/google/auth-2.model';

export interface WindowWithAuth2 extends Window {
  auth2: Auth2;
}
