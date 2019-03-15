import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfInputModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';

import { HeadlineFormComponent } from 'app/shared/components/headline-form/headline-form.component';



describe('HeadlineFormComponent', () => {
  let component: HeadlineFormComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        HeadlineFormComponent,
      ],
      imports: [
        DfInputModule,
        DfValidationMessagesModule.forRoot(),
        LayoutModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(HeadlineFormComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should submit data successfully', async(() => {
    const headline = 'Sample Headline';
    fixture.detectChanges();

    component.form.setValue({ headline });
    component.save
      .pipe(take(1))
      .subscribe(data => expect(data.headline).toBe(headline));
    component.onSubmit();
  }));
});
