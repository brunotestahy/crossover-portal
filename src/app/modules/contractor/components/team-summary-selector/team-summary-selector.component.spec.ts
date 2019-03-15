import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { mock } from 'ts-mockito';

import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import {
  TeamSummarySelectorComponent,
} from 'app/modules/contractor/components/team-summary-selector/team-summary-selector.component';

describe('TeamSummarySelectorComponent', () => {
  let component: TeamSummarySelectorComponent;
  let fixture: ComponentFixture<typeof component>;
  let productivityService: ProductivityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TeamSummarySelectorComponent,
      ],
      providers: [
        { provide: ProductivityService, useFactory: () => mock(ProductivityService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSummarySelectorComponent);
    component = fixture.componentInstance;
    productivityService = TestBed.get(ProductivityService);
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-06-21T05:45:00'));
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be initialized successfully', () => {
    const data = [{
      productivitySummary: {
        id: 1,
        teamName: 'Test',
      },
    }];
    spyOn(productivityService, 'getOverallPerformers').and.returnValue(of(data));
    component.summaries = [];

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('');
    expect(component.summaries).toBe(Object.assign(data));
  });

  it('should set an error message when the manager has no reporting teams', () => {
    const data = [] as string[];
    spyOn(productivityService, 'getOverallPerformers').and.returnValue(of(data));
    component.summaries = [];

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Sorry, you have no teams reporting to you.');
  });

  it('should set an error message when an error occurs during summaries retrieval', () => {
    const data = [] as string[];
    spyOn(productivityService, 'getOverallPerformers').and.returnValue(_throw(data));
    component.summaries = [];

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('An unknown error happened while retrieving teams summary data.');
  });

  it('should trigger an event when a team is selected', () => {
    const teamId = 1;
    component.teamSelect.subscribe((id: typeof teamId) => expect(id).toBe(teamId));
    component.onTeamSelect(teamId);
  });
});
