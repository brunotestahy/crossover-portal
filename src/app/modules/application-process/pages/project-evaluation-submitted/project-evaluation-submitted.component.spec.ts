import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfCardModule } from '@devfactory/ngx-df';

import { ProjectEvaluationSubmittedComponent } from './project-evaluation-submitted.component';

describe('ProjectEvaluationSubmittedComponent', () => {
  let component: ProjectEvaluationSubmittedComponent;
  let fixture: ComponentFixture<ProjectEvaluationSubmittedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectEvaluationSubmittedComponent,
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
    fixture = TestBed.createComponent(ProjectEvaluationSubmittedComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
