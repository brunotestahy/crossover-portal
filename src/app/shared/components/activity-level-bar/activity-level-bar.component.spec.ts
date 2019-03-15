import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDiaryWithFlags } from 'app/core/models/logbook';
import { ActivityLevelBarComponent } from 'app/shared/components/activity-level-bar/activity-level-bar.component';

describe('ActivityLevelBarComponent', () => {
  let component: ActivityLevelBarComponent;
  let fixture: ComponentFixture<ActivityLevelBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActivityLevelBarComponent,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLevelBarComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    const workDiary = {} as WorkDiaryWithFlags;
    workDiary.isMeeting = true;
    workDiary.intensityScore = 90;

    component.workDiary = workDiary;

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('[hasLowActivity] should return true when the provided diary has score lower than or equal 10', () => {
    const workDiary = {} as WorkDiaryWithFlags;
    workDiary.intensityScore = 9;

    expect(component.hasLowActivity(workDiary)).toBe(true);
  });

  it('[hasLowActivity] should return false when the provided diary has score greater than 10', () => {
    const workDiary = {} as WorkDiaryWithFlags;
    workDiary.intensityScore = 85;

    expect(component.hasLowActivity(workDiary)).toBe(false);
  });

  it('[hasNormalActivity] should return true when the provided diary has score greater than 10', () => {
    const workDiary = {} as WorkDiaryWithFlags;
    workDiary.intensityScore = 90;

    expect(component.hasNormalActivity(workDiary)).toBe(true);
  });

  it('[hasNormalActivity] should return false when the provided diary has score lower than or equal 10', () => {
    const workDiary = {} as WorkDiaryWithFlags;
    workDiary.intensityScore = 5;

    expect(component.hasNormalActivity(workDiary)).toBe(false);
  });

  it('[isMeetingTime] should return true when the provided diary is a meeting diary', () => {
    const workDiary = {} as WorkDiaryWithFlags;
    workDiary.isMeeting = true;

    expect(component.isMeetingTime(workDiary)).toBe(true);
  });

  it('[isMeetingTime] should return false when the provided diary is not a meeting diary', () => {
    const workDiary = {} as WorkDiaryWithFlags;
    workDiary.isMeeting = false;

    expect(component.isMeetingTime(workDiary)).toBe(false);
  });

  it('[getIntensityScore] should return 100% when a meeting card is displayed', () => {
    const workDiary = {} as WorkDiaryWithFlags;
    workDiary.isMeeting = true;

    expect(component.getIntensityScore(workDiary)).toBe('100%');
  });

  it('[getIntensityScore] should return the intensity score when a normal card is displayed', () => {
    const workDiary = {} as WorkDiaryWithFlags;
    workDiary.isMeeting = false;
    workDiary.intensityScore = 60;

    expect(component.getIntensityScore(workDiary)).toBe('60%');
  });
});
