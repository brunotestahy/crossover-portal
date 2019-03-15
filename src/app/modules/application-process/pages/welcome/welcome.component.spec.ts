import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { APPLICATION_FLOW_STEPS } from 'app/core/constants/application-process/application-flow-steps';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { WelcomeComponent } from 'app/modules/application-process/pages/welcome/welcome.component';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let candidateService: CandidateService;

  class CandidateServiceMock {

    public getCurrentApplication(): Observable<{}> {
      return of({});
    }

    public getSteps(): Observable<{}> {
      return of({});
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeComponent ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: CandidateService, useClass: CandidateServiceMock },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.get(CandidateService);
  });

  it('should initialize data', fakeAsync(() => {
    const application = {
      id: 1,
      applicationFlow: {
        id: 5,
      },
      job: {
        id: 2,
      },
    };
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(
      Observable.of(application)
    );
    spyOn(candidateService, 'getSteps').and.returnValue(
      Observable.of(APPLICATION_FLOW_STEPS)
    );
    fixture.detectChanges();
    expect(component.isLoading).toBeFalsy();
    expect(component.currentStep).toEqual(1);
  }));
});
