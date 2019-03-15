import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { format } from 'date-fns';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { mock } from 'ts-mockito';

import { IdentityService } from 'app/core/services/identity/identity.service';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { RankAndReviewComponent } from 'app/modules/contractor/pages/rank-and-review/rank-and-review.component';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

describe('RankAndReviewComponent', () => {
  let component: RankAndReviewComponent;
  let fixture: ComponentFixture<typeof component>;
  let domSanitizer: DomSanitizer;
  let identityService: IdentityService;
  let productivityService: ProductivityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RankAndReviewComponent,
      ],
      providers: [
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: ProductivityService, useFactory: () => mock(ProductivityService) },
        { provide: DomSanitizer, useValue: {
            sanitize: (_context: {}, value: string) => value,
        }},
        FormBuilder,
        TeamSelectorStrategyService,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-06-01T07:21:00'));
    fixture = TestBed.createComponent(RankAndReviewComponent);
    component = fixture.componentInstance;
    domSanitizer = TestBed.get(DomSanitizer);
    identityService = TestBed.get(IdentityService);
    productivityService = TestBed.get(ProductivityService);
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should be created', () => expect(component).toBeTruthy());

  it('should initialize review data successfully when the current user is not a manager', () => {
    spyOn(component, 'getFormattedAnswer').and.callFake((value: string) => value);
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      assignment: {
        manager: { id: 1 },
        team: { id: 1 },
      },
    }));
    spyOn(identityService, 'hasAvatarType').and.returnValue(false);
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: 1,
      },
      managerId: 1,
    }));
    spyOn(productivityService, 'getPerformers').and.returnValue(of({
      mappedActivities: [
        {
          assignment: {
            team: { id: 1 },
          },
          metricStats: 1,
          activityMetrics: 2,
          recordedHours: 3,
          intensityScores: 4,
          focusScores: 5,
          metricsChange: 0.5,
        },
        {
          assignment: {
            team: { id: 1 },
          },
          metricStats: 1,
          activityMetrics: 2,
          recordedHours: 3,
          intensityScores: 4,
          focusScores: 5,
          metricsChange: 0.5,
        },
      ],
    }));
    spyOn(productivityService, 'getReviews').and.returnValue(of({
      reviewDetails: [],
    }));

    fixture.detectChanges();
  });

  it('should initialize review data successfully when the current user is a manager', () => {
    spyOn(component, 'getFormattedAnswer').and.callFake((value: string) => value);
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      managerAvatar: { id: 1 },
      assignment: {
        team: { id: 1 },
      },
    }));
    spyOn(identityService, 'hasAvatarType').and.returnValue(true);
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: 1,
      },
      managerId: 1,
    }));
    spyOn(productivityService, 'getPerformers').and.returnValue(of({
      mappedActivities: [
        {
          assignment: {
            team: {id: 1},
          },
          metricStats: 1,
          activityMetrics: 2,
          recordedHours: 3,
          intensityScores: 4,
          focusScores: 5,
          metricsChange: 0.5,
        },
        {
          assignment: {
            team: {id: 1},
          },
          metricStats: 1,
          activityMetrics: 2,
          recordedHours: 3,
          intensityScores: 4,
          focusScores: 5,
          metricsChange: 0.5,
        },
      ],
    }));
    spyOn(productivityService, 'getReviews').and.returnValue(of({
      reviewDetails: [],
    }));

    fixture.detectChanges();
  });

  it('should set an error message when no reviews are available for the week', () => {
    spyOn(component, 'getFormattedAnswer').and.callFake((value: string) => value);
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      assignment: {
        manager: { id: 1 },
        team: { id: 1 },
      },
    }));
    spyOn(identityService, 'hasAvatarType').and.returnValue(false);
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: 1,
      },
      managerId: 1,
    }));
    spyOn(productivityService, 'getPerformers').and.returnValue(of(
      {
        assignment: {
          team: { id: 1 },
        },
        metricStats: 1,
        activityMetrics: 2,
        recordedHours: 3,
        intensityScores: 4,
        focusScores: 5,
        metricsChange: 0.5,
        mappedActivities: [],
      }
    ));
    spyOn(productivityService, 'getReviews').and.returnValue(of(null));

    fixture.detectChanges();

    expect(component.errorMessage).toBe('No reviews are available for this week.');
  });

  it('should set an error message when an unknown error happens during data retrieval', () => {
    spyOn(component, 'getFormattedAnswer').and.callFake((value: string) => value);
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      managerAvatar: { id: 1 },
    }));
    spyOn(identityService, 'hasAvatarType').and.returnValue(true);
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: 1,
      },
      managerId: 1,
    }));
    spyOn(productivityService, 'getPerformers').and.returnValue(ErrorObservable.create({}));
    spyOn(productivityService, 'getReviews').and.returnValue(of({
      reviewDetails: [],
    }));

    fixture.detectChanges();

    expect(component.errorMessage).toBe('An unknown error happened while retrieving review data.');
  });

  it('should initialize the editor successfully when an initialization object is provided', () => {
    const initObject = Object.assign({
      active: false,
      initialize: jasmine.createSpy('initialize'),
    });
    const tempValue = 'Temp Value';
    component.form = Object.assign({ get: () => tempValue });

    component.initializeFroalaEditor(0, initObject);

    expect(component.editors[0]).toBe(initObject);
    expect(initObject.initialize).toHaveBeenCalledWith();
  });

  it('should initialize the editor successfully when no initialization object is provided', () => {
    const initObject = Object.assign({
      active: false,
      initialize: jasmine.createSpy('initialize'),
    });
    component.editors = [initObject];
    const tempValue = 'Temp Value';
    component.form = Object.assign({ get: () => tempValue });

    component.initializeFroalaEditor(0);

    expect(initObject.active).toBe(true);
  });

  it('should save editor data successfully', () => {
    const editor = Object.assign({
      destroy: jasmine.createSpy('destroy'),
      initialize: jasmine.createSpy('initialize'),
      active: true,
    });
    component.editors = [editor];
    component.form = Object.assign({
      value: {
        performers: [{ answer: true }],
      },
    });
    spyOn(productivityService, 'saveReview').and.returnValue(of({}));
    component.saveFroalaEditor(0);

    expect(component.errorMessage).toBe('');
    expect(component.editors[0].active).toBe(false);
  });

  it('should set an error message when an error occurs during editor data storage', () => {
    const editor = Object.assign({
      destroy: jasmine.createSpy('destroy'),
      initialize: jasmine.createSpy('initialize'),
      active: true,
    });
    component.editors = [editor];
    component.form = Object.assign({
      value: {
        performers: [{ answer: true }],
      },
    });
    spyOn(productivityService, 'saveReview').and.returnValue(_throw({}));
    component.saveFroalaEditor(0);

    expect(component.errorMessage).toBe('An error occurred while storing your review.');
  });

  it('should cancel the editor display successfully', () => {
    const editor = Object.assign({
      destroy: jasmine.createSpy('destroy'),
      initialize: jasmine.createSpy('initialize'),
      active: true,
    });
    component.editors = [editor];
    component.form = Object.assign({
      get: () => ({
        reset: jasmine.createSpy('reset'),
        setValue: jasmine.createSpy('setValue'),
      })
    });
    component.cancelFroalaEditor(0);

    expect(component.editors[0].active).toBe(false);
  });

  it('should initialize review data successfully when the week is changed', () => {
    spyOn(component, 'getReviews');
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      managerAvatar: { id: 1 },
    }));
    spyOn(identityService, 'hasAvatarType').and.returnValue(true);
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: 1,
      },
      managerId: 1,
    }));
    fixture.detectChanges();

    component.form.controls['date'].setValue(new Date());
    expect(component.getReviews).toHaveBeenCalledTimes(2);
  });

  it('should navigate to the previous week successfully', () => {
    spyOn(component, 'getReviews');
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      managerAvatar: { id: 1 },
    }));
    spyOn(identityService, 'hasAvatarType').and.returnValue(true);
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: 1,
      },
      managerId: 1,
    }));
    fixture.detectChanges();
    component.previousWeek();

    expect(format(component.form.controls['date'].value, 'YYYY-MM-DD')).toEqual('2018-05-21');
    expect(component.getReviews).toHaveBeenCalledTimes(2);
  });

  it('should fetch the previous week successfully', () => {
    spyOn(component, 'getReviews');
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      managerAvatar: { id: 1 },
    }));
    spyOn(identityService, 'hasAvatarType').and.returnValue(true);
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: 1,
      },
      managerId: 1,
    }));
    fixture.detectChanges();
    component.fetchLastWeek();

    expect(format(component.form.controls['date'].value, 'YYYY-MM-DD')).toEqual('2018-05-21');
    expect(component.getReviews).toHaveBeenCalledTimes(2);
  });

  it('should navigate to the next week successfully', () => {
    spyOn(component, 'getReviews');
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      managerAvatar: { id: 1 },
    }));
    spyOn(identityService, 'hasAvatarType').and.returnValue(true);
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: 1,
      },
      managerId: 1,
    }));
    fixture.detectChanges();
    component.nextWeek();

    expect(format(component.form.controls['date'].value, 'YYYY-MM-DD')).toEqual('2018-06-04');
    expect(component.getReviews).toHaveBeenCalledTimes(2);
  });

  it('should fetch this week successfully', () => {
    spyOn(component, 'getReviews');
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      managerAvatar: { id: 1 },
    }));
    spyOn(identityService, 'hasAvatarType').and.returnValue(true);
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: 1,
      },
      managerId: 1,
    }));
    fixture.detectChanges();
    component.fetchThisWeek();

    expect(format(component.form.controls['date'].value, 'YYYY-MM-DD')).toEqual('2018-05-28');
    expect(component.getReviews).toHaveBeenCalledTimes(2);
  });

  it('should retrieve true when two dates belong to the same ISO week', () => {
    spyOn(component, 'getReviews');
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      managerAvatar: { id: 1 },
    }));
    spyOn(identityService, 'hasAvatarType').and.returnValue(true);
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: 1,
      managerId: 1,
    }));
    const compareDate = new Date('2018-05-31T07:21:00');

    fixture.detectChanges();
    const matches = component.currentDateMatches(compareDate);

    expect(matches).toBe(true);
  });

  it('should get the formatted week name successfully', () => {
    const targetDate = new Date();
    const result = component.getFormattedWeekDays(targetDate);

    expect(result).toBe('May 28 - Jun 03, 2018');
  });

  it('should escape a safe HTML answer successfully', () => {
    domSanitizer.bypassSecurityTrustHtml = jasmine.createSpy().and.returnValue(null);
    const answer = 'Sample Answer';

    component.getFormattedAnswer(answer);

    expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(answer);
  });

  it('should retrieve the plus symbol when a positive number is provided', () => {
    const symbol = component.getNumberSymbol(10);

    expect(symbol).toBe('+');
  });

  it('should retrieve the no symbol when a non-positive number is provided', () => {
    const symbol = component.getNumberSymbol(0);

    expect(symbol).toBe('');
  });

  it('should retrieve a formatted message when an inactive assignment is provided', () => {
    const item = {active: false, effectiveDateEnd: '2018-06-01T14:33'};
    const message = component.getInactiveMessage(item);

    expect(message).toBe('This person left the team on June, 1 2018');
  });

  it('should retrieve an undefined value when an active assignment is provided', () => {
    const item = {active: true, effectiveDateEnd: '2018-06-01T14:33'};
    const message = component.getInactiveMessage(item);

    expect(message).toBeUndefined();
  });

  it('should retrieve the success indicator color when the metric value is greater or equal to 80% of its target', () => {
    const value = 80;
    const maxValue = 100;
    const className = component.getScoreClass(value, maxValue);

    expect(className).toBe('success');
  });
});
