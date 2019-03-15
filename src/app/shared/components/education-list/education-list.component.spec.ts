import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfDatepickerModule,
  DfInputModule,
  DfMouseUpService,
  DfSelectModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';

import { Education } from 'app/core/models/candidate';
import { EducationFormComponent } from 'app/shared/components/education-form/education-form.component';
import { EducationListComponent } from 'app/shared/components/education-list/education-list.component';

describe('EducationListComponent', () => {
  let component: EducationListComponent;
  let fixture: ComponentFixture<typeof component>;
  const education = new Education(
    1,
    'Sample School',
    '2016-01-01',
    '2018-01-01',
    'B.S.'
  );

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        EducationListComponent,
        EducationFormComponent,
      ],
      imports: [
        DfDatepickerModule,
        DfInputModule,
        DfSelectModule,
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
      fixture = TestBed.createComponent(EducationListComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should accept an entry for editing successfully', async(() => {
    component.edit
      .pipe(take(1))
      .subscribe(data => expect(data).toBe(education));
    component.onEdit(education);
  }));

  it('should accept an entry for saving successfully', async(() => {
    const educations = [education];
    component.save
      .pipe(take(1))
      .subscribe(candidate =>
        expect(candidate.educations).toContain(education)
      );
    component.onSave({ educations });
  }));

  it('should cancel data editing successfully', async(() => {
    component.cancel
      .pipe(take(1))
      .subscribe(value => expect(value).toBe(true));
    component.selectedEntry = education;
    component.onCancel();
    expect(component.selectedEntry).toBeNull();
  }));

  it('should accept a delete request successfully', () => {
    const educations = [education];
    component.remove
      .pipe(take(1))
      .subscribe(candidate =>
        expect(candidate.educations).toContain(education)
      );
    component.onDelete({ educations });
  });
});
