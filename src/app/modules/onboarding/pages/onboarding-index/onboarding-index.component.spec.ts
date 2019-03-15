import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { PaymentSetupSteps } from 'app/core/constants/onboarding-process';
import { NotificationService } from 'app/core/services/notification/notification.service';
import { OnboardingIndexComponent } from 'app/modules/onboarding/pages/onboarding-index/onboarding-index.component';


describe('OnboardingIndexComponent', () => {
  let component: OnboardingIndexComponent;
  let fixture: ComponentFixture<OnboardingIndexComponent>;

  let notificationService: NotificationService;
  let router: Router;
  let route: ActivatedRoute;

  const MOCK_ASSIGNMENT_ID = 29156;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingIndexComponent],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: NotificationService, useFactory: () => mock(NotificationService) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingIndexComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.get(NotificationService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);

    route.snapshot.params = { id: MOCK_ASSIGNMENT_ID};
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should get the dependencies', () => {
    expect(notificationService).toBeTruthy();
  });

  it('should navigate to onboarding Welcome', () => {
    spyOn(notificationService, 'getTasks').and.returnValue(of([{
      processType: 'MarketplaceMemberSelection:84:26907512',
      taskType: 'candidateProvidesTrackerPassword',
      object: {
        id: MOCK_ASSIGNMENT_ID,
      },
    }]));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/welcome');
  });

  it('should navigate to onboarding Setup Payment', () => {
    spyOn(notificationService, 'getTasks').and.returnValue(of([{
      processType: 'MarketplaceMemberSelection:84:26907512',
      taskType: PaymentSetupSteps.Payoneer,
      object: {
        id: MOCK_ASSIGNMENT_ID,
      },
    }]));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/setup-payment');
  });

  it('should navigate to onboarding Background Check', () => {
    spyOn(notificationService, 'getTasks').and.returnValue(of([{
      processType: 'MarketplaceMemberSelection:84:26907512',
      taskType: 'candidateStartsBackgroundCheck',
      object: {
        id: MOCK_ASSIGNMENT_ID,
      },
    }]));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/background-check');
  });

  it('should navigate to onboarding Finishing Up', () => {
    spyOn(notificationService, 'getTasks').and.returnValue(of([]));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/finishing-up');
  });
});
