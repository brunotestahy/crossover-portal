import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfCardModule } from '@devfactory/ngx-df';

import { ProjectEvaluationWelcomeComponent } from './project-evaluation-welcome.component';

describe('ProjectEvaluationWelcomeComponent', () => {
  let component: ProjectEvaluationWelcomeComponent;
  let fixture: ComponentFixture<ProjectEvaluationWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectEvaluationWelcomeComponent,
      ],
      imports: [
        DfCardModule,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEvaluationWelcomeComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
