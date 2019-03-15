import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { MyLogbookPageComponent } from 'app/modules/my-dashboard/pages/my-logbook-page/my-logbook-page.component';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

describe('MyLogbookPageComponent', () => {
  let component: MyLogbookPageComponent;
  let fixture: ComponentFixture<MyLogbookPageComponent>;

  let dashboardService: UserDashboardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyLogbookPageComponent,
      ],
      providers: [
        { provide: UserDashboardService, useFactory: () => mock(UserDashboardService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLogbookPageComponent);
    component = fixture.componentInstance;

    dashboardService = TestBed.get(UserDashboardService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch initial date in the dashboard successfully', () => {
    spyOn(dashboardService, 'getDateStream').and.returnValue(of('Date'));
    fixture.detectChanges();
    expect(component.date$).toBeDefined();
  });

});
