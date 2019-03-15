import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrittenEvaluationSubmittedComponent } from './written-evaluation-submitted.component';

describe('WrittenEvaluationSubmittedComponent', () => {
  let component: WrittenEvaluationSubmittedComponent;
  let fixture: ComponentFixture<WrittenEvaluationSubmittedComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          WrittenEvaluationSubmittedComponent,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WrittenEvaluationSubmittedComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll into view when initialized', () => {
    spyOn(component.card.nativeElement, 'scrollIntoView');

    component.ngOnInit();

    expect(component.card.nativeElement.scrollIntoView).toHaveBeenCalledWith({
      inline: 'start',
      block: 'start',
      behavior: 'smooth',
    });
  });
});


