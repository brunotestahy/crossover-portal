import { LayoutModule } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfButtonModule,
  DfInputModule,
  DfMouseUpService,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';

import { SummaryFormComponent } from 'app/shared/components/summary-form/summary-form.component';

describe('SummaryFormComponent', () => {
  let component: SummaryFormComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        SummaryFormComponent,
      ],
      imports: [
        DfButtonModule,
        DfInputModule,
        DfValidationMessagesModule.forRoot(),
        LayoutModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        DfMouseUpService,
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(SummaryFormComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should save data successfully', () => {
    const summary = 'Sample Summary';

    component.save
      .pipe(take(1))
      .subscribe(candidate => expect(candidate.summary).toBe(summary));

    fixture.detectChanges();
    component.form.patchValue({ summary });

    component.onSubmit();
  });

  it('should cancel form display successfully', () => {
    component.cancel
      .pipe(take(1))
      .subscribe(data => expect(data).toBe(true));

    component.onCancel();
  });
});
