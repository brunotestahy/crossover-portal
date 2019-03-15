import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfModalService } from '@devfactory/ngx-df';
import { mock } from 'ts-mockito';

import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { HireComponent } from 'app/modules/contractor/pages/hire/hire.component';
import { DataFetchingService } from 'app/modules/contractor/pages/hire/services/data-fetching.service';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

describe('HireComponent', () => {
  let component: HireComponent;
  let fixture: ComponentFixture<typeof component>;
  let dataFetchingService: DataFetchingService;
  let teamSelectorStrategyService: TeamSelectorStrategyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HireComponent,
      ],
      providers: [
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: DataFetchingService, useFactory: () => mock(DataFetchingService) },
        { provide: TeamSelectorStrategyService, useFactory: () => mock(TeamSelectorStrategyService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HireComponent);
    component = fixture.componentInstance;
    dataFetchingService = TestBed.get(DataFetchingService);
    teamSelectorStrategyService = TestBed.get(TeamSelectorStrategyService);
  });

  it('should be created', () => {
    teamSelectorStrategyService.strategy = Object.assign({
      next: () => true
    });
    expect(component).toBeTruthy();
    component.ngOnDestroy();
  });

  it('should fetch data successfully when initialised', () => {
    spyOn(dataFetchingService, 'load');
    teamSelectorStrategyService.strategy = Object.assign({
      next: () => true
    });
    fixture.detectChanges();

    expect(dataFetchingService.load).toHaveBeenCalledWith(component);
  });
});
