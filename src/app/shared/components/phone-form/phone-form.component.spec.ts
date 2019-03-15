import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfButtonModule,
  DfInputModule,
  DfMouseUpService,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';

import { PhoneFormComponent } from 'app/shared/components/phone-form/phone-form.component';

describe('PhoneFormComponent', () => {
  let component: PhoneFormComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        PhoneFormComponent,
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
      fixture = TestBed.createComponent(PhoneFormComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should submit data successfully', async(() => {
    const phone = '1234567890';
    const initialValue = Object.assign({ location: { phone } });
    component.initialValue = initialValue;

    component.ngOnInit();

    component.save
      .pipe(take(1))
      .subscribe(data =>
          expect(data).toEqual(jasmine.objectContaining(initialValue))
      );
    component.onSubmit();
  }));
});
