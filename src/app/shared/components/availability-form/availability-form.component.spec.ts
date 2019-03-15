import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfCoreModule,
  DfMouseUpService,
  DfSelectModule,
} from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';
import { sprintf } from 'sprintf-js';

import { AvailabilityFormComponent } from 'app/shared/components/availability-form/availability-form.component';
import { EnumToStringPipe } from 'app/shared/pipes/enum-to-string.pipe';



describe('AvailabilityFormComponent', () => {
  let component: AvailabilityFormComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        AvailabilityFormComponent,
        EnumToStringPipe,
      ],
      imports: [
        DfCoreModule.forRoot(),
        DfSelectModule,
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
      fixture = TestBed.createComponent(AvailabilityFormComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should access an initial value association successfully', () => {
    fixture.detectChanges();

    const availability = 'SAMPLE_VALUE';
    component.initialValue = { availability };

    expect(component.form.value)
      .toEqual(jasmine.objectContaining({ availability }));
  });

  it('should transform an option successfully', () => {
    const format = 'Sample Value %s';
    const value = '001';
    component.displayFormat = format;

    const data = component.optionsTransform(value);

    expect(data).toBe(sprintf(format, value));
  });

  it('should submit data successfully', async(() => {
    const availability = 'SAMPLE_VALUE';
    const verificationValue = Object.assign({ availability });
    fixture.detectChanges();

    component.form.setValue(verificationValue);
    component.save
      .pipe(take(1))
      .subscribe(data =>
        expect(data).toEqual(jasmine.objectContaining(verificationValue))
      );
    component.onSubmit();
  }));
});
