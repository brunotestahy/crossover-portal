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

import { SkypeFormComponent } from 'app/shared/components/skype-form/skype-form.component';

describe('SkypeFormComponent', () => {
  let component: SkypeFormComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        SkypeFormComponent,
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
      fixture = TestBed.createComponent(SkypeFormComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should save data successfully', () => {
    const skypeId = 'my.skype.id';

    component.save
      .pipe(take(1))
      .subscribe(candidate => expect(candidate.skypeId).toBe(skypeId));

    fixture.detectChanges();
    component.form.patchValue({ skypeId });

    component.onSubmit();
  });
});
