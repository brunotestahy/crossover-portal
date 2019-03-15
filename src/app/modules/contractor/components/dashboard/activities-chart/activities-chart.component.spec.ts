import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as _ from 'lodash';
import { of } from 'rxjs/observable/of';

import { TeamAverage } from 'app/core/models/team';
import { TEAM_AVERAGE_MOCK } from 'app/core/services/mocks/dashboard.mock';
import { ActivitiesChartComponent } from 'app/modules/contractor/components/dashboard/activities-chart/activities-chart.component';

describe('ActivitiesChartComponent', () => {
  let component: ActivitiesChartComponent;
  let fixture: ComponentFixture<ActivitiesChartComponent>;

  let router: Router;

  let teamAverage: TeamAverage;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActivitiesChartComponent,
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ type: '' }) }},
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesChartComponent);
    component = fixture.componentInstance;

    router = TestBed.get(Router);

    teamAverage = Object.assign(TEAM_AVERAGE_MOCK);
    teamAverage.activitiAvg = {
      ...teamAverage.activitiAvg,
      overWeekPlannedActs: [{
        id: 0,
        activity: { id: 4, name: 'Office', timeUsed: 0, color: '#00bcd4' },
        actTimeLong: 100,
      }, {
        id: 0,
        activity: { id: 12, name: 'Email', timeUsed: 0, color: '#BDFA73' },
        actTimeLong: 100,
      }, {
        id: 0,
        activity: { id: 3431, name: 'Meeting', timeUsed: 0, color: '#516E23' },
        actTimeLong: 300,
      }, {
        id: 0,
        activity: { id: 1507, name: 'Development', timeUsed: 0, color: '#2196f3' },
        actTimeLong: 1900,
      }],
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load all the chart information when the activities are loaded in the first time', () => {
    const simpleChanges = Object.assign({
      activityAverage: {
        previousValue: null,
      },
    });
    component.activityAverage = teamAverage;
    spyOn(component.metricAverage, 'emit').and.returnValue('');
    spyOn(component.metricDescription, 'emit').and.returnValue('');
    spyOn(component.metricTarget, 'emit').and.returnValue('');

    component.ngOnChanges(simpleChanges);

    expect(component.plannedSections).toBeDefined();
    expect(component.metricTarget.emit).toHaveBeenCalled();
    expect(component.metricAverage.emit).toHaveBeenCalled();
    expect(component.metricDescription.emit).toHaveBeenCalled();
    expect(component.sections).toBeDefined();
  });

  it('should load all the chart information when the activities are updated', () => {
    const simpleChanges = Object.assign({
      activityAverage: {
        currentValue: { teamId: 13 },
        previousValue: { teamId: 11 },
      },
    });
    const newTeamAverage = _.cloneDeep(teamAverage);
    newTeamAverage.activitiAvg = {
      ...newTeamAverage.activitiAvg,
      overWeekPlannedActs: [],
    };
    component.managerMode = true;
    component.activityAverage = newTeamAverage;
    spyOn(component.metricAverage, 'emit').and.returnValue('');
    spyOn(component.metricDescription, 'emit').and.returnValue('');
    spyOn(component.metricTarget, 'emit').and.returnValue('');

    component.ngOnChanges(simpleChanges);

    expect(component.plannedSections).toBeDefined();
    expect(component.metricTarget.emit).toHaveBeenCalled();
    expect(component.metricAverage.emit).toHaveBeenCalled();
    expect(component.metricDescription.emit).toHaveBeenCalled();
    expect(component.sections).toBeDefined();
  });

  it('should load all the chart information when the activities are updated with empty metrics', () => {
    const simpleChanges = Object.assign({
      activityAverage: {
        currentValue: { teamId: 13 },
        previousValue: { teamId: 11 },
      },
    });
    const newTeamAverage = _.cloneDeep(teamAverage);
    newTeamAverage.activitiAvg = {
      ...newTeamAverage.activitiAvg,
      overWeekPlannedActs: [],
      intensityScoreAvg: undefined,
      focusScoreAvg: undefined,
      alignmentScoreAvg: undefined,
    };
    newTeamAverage.metricAvg = {
      metricName: undefined,
      metricTarget: undefined,
      weeksMetric: undefined,
    };
    newTeamAverage.activitiAvg.groupsSummaryAvg = undefined;
    component.managerMode = true;
    component.activityAverage = newTeamAverage;
    spyOn(component.metricAverage, 'emit').and.returnValue('');
    spyOn(component.metricDescription, 'emit').and.returnValue('');
    spyOn(component.metricTarget, 'emit').and.returnValue('');

    component.ngOnChanges(simpleChanges);

    expect(component.plannedSections).toBeDefined();
    expect(component.metricTarget.emit).toHaveBeenCalled();
    expect(component.metricAverage.emit).toHaveBeenCalled();
    expect(component.metricDescription.emit).toHaveBeenCalled();
    expect(component.sections).toBeDefined();
  });

  it('should not load the metrics information when the activities are updated with empty metrics', () => {
    const simpleChanges = Object.assign({
      activityAverage: {
        currentValue: { teamId: 13 },
        previousValue: { teamId: 11 },
      },
    });
    const newTeamAverage = _.cloneDeep(teamAverage);
    newTeamAverage.activitiAvg = {
      ...newTeamAverage.activitiAvg,
      overWeekPlannedActs: [],
    };
    newTeamAverage.metricAvg = undefined;
    component.managerMode = true;
    component.activityAverage = newTeamAverage;
    spyOn(component.metricAverage, 'emit').and.returnValue('');
    spyOn(component.metricDescription, 'emit').and.returnValue('');
    spyOn(component.metricTarget, 'emit').and.returnValue('');

    component.ngOnChanges(simpleChanges);

    expect(component.plannedSections).toBeDefined();
    expect(component.metricTarget.emit).not.toHaveBeenCalled();
    expect(component.metricAverage.emit).not.toHaveBeenCalled();
    expect(component.metricDescription.emit).not.toHaveBeenCalled();
    expect(component.sections).toBeDefined();
  });

  it('should not load the sections when the activities are updated without activities average', () => {
    const simpleChanges = Object.assign({
      activityAverage: {
        currentValue: { teamId: 13 },
        previousValue: { teamId: 11 },
      },
    });
    const newTeamAverage = _.cloneDeep(teamAverage);
    newTeamAverage.activitiAvg = undefined;
    newTeamAverage.metricAvg = undefined;
    component.managerMode = true;
    component.activityAverage = newTeamAverage;
    spyOn(component.metricAverage, 'emit').and.returnValue('');
    spyOn(component.metricDescription, 'emit').and.returnValue('');
    spyOn(component.metricTarget, 'emit').and.returnValue('');

    component.ngOnChanges(simpleChanges);

    expect(component.plannedSections.length).toBe(0);
    expect(component.metricTarget.emit).not.toHaveBeenCalled();
    expect(component.metricAverage.emit).not.toHaveBeenCalled();
    expect(component.metricDescription.emit).not.toHaveBeenCalled();
    expect(component.sections.length).toBe(0);
  });

  it('should not load the chart data when the activities are not defined', () => {
    const simpleChanges = Object.assign({
      activityAverage: {
        currentValue: { teamId: 13 },
        previousValue: { teamId: 11 },
      },
    });

    component.ngOnChanges(simpleChanges);

    expect(component.plannedSections.length).toBe(0);
    expect(component.activityAverage).toBeUndefined();
    expect(component.sections.length).toBe(0);
  });

  it('should not update the chart data when the teamId has not changed', () => {
    const simpleChanges = Object.assign({
      activityAverage: {
        currentValue: { teamId: 13 },
        previousValue: { teamId: 13 },
      },
    });

    component.ngOnChanges(simpleChanges);

    expect(component.plannedSections.length).toBe(0);
    expect(component.activityAverage).toBeUndefined();
    expect(component.sections.length).toBe(0);
  });

  it('should not update the chart data when the activity Average has not changed', () => {
    const simpleChanges = Object.assign({
      metricAverage: {},
    });

    component.ngOnChanges(simpleChanges);

    expect(component.plannedSections.length).toBe(0);
    expect(component.activityAverage).toBeUndefined();
    expect(component.sections.length).toBe(0);
  });

  it('should retrieve the success class when the performance is greater than 70%', () => {
    expect(component.getScoreClass(8, 10)).toBe('success');
  });

  it('should navigate to the Team Activities screen when the Activities Chart is clicked as a manager', () => {
    component.managerMode = true;
    spyOn(router, 'navigate').and.returnValue('');

    component.navigateToTeamActivities();

    expect(router.navigate).toHaveBeenCalledWith(['/contractor/team-activities']);
  });

  it('should not navigate to the Team Activities screen when the Activities Chart is clicked as a contractor', () => {
    component.managerMode = false;
    spyOn(router, 'navigate').and.returnValue('');

    component.navigateToTeamActivities();

    expect(router.navigate).not.toHaveBeenCalledWith();
  });
});
