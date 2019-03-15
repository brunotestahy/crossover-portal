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

import { NameFormComponent } from 'app/shared/components/name-form/name-form.component';

describe('NameFormComponent', () => {
  let component: NameFormComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        NameFormComponent,
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
      fixture = TestBed.createComponent(NameFormComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should submit data successfully', async(() => {
    const firstName = 'Cross';
    const lastName = 'Over';
    const initialValue = Object.assign({ firstName, lastName });
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
