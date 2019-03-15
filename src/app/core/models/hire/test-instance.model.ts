import { Application } from 'app/core/models/application/application.model';
import { Test } from 'app/core/models/hire/test.model';

export interface TestInstance {
  id: number;
  application: Application;
  test: Test;
}
