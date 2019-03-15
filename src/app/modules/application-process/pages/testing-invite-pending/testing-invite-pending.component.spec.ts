import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock } from 'ts-mockito';

import { ApplicationProcessService } from '../../shared/application-process.service';

import { TestingInvitePendingComponent } from './testing-invite-pending.component';

describe('TestingInvitePendingComponent', () => {
  let component: TestingInvitePendingComponent;
  let fixture: ComponentFixture<TestingInvitePendingComponent>;
  let applicationProcessService: ApplicationProcessService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TestingInvitePendingComponent],
      providers: [
        {provide: ApplicationProcessService, useFactory: () => mock(ApplicationProcessService)},
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingInvitePendingComponent);
    component = fixture.componentInstance;
    applicationProcessService = TestBed.get(ApplicationProcessService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit]', () => {
    spyOn(applicationProcessService, 'currentStep');
    component.ngOnInit();
    expect(applicationProcessService.currentStep).toHaveBeenCalledWith(0);
  });
});
