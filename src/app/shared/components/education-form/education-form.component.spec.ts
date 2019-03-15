import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfCoreModule,
  DfDatepickerModule,
  DfInputModule,
  DfMouseUpService,
  DfSelectModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';

import { Education } from 'app/core/models/candidate';
import { EducationFormComponent } from 'app/shared/components/education-form/education-form.component';



describe('EducationFormComponent', () => {
  let component: EducationFormComponent;
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
        EducationFormComponent,
      ],
      imports: [
        DfCoreModule.forRoot(),
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
      fixture = TestBed.createComponent(EducationFormComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should associate an initial value successfully', fakeAsync(() => {
    fixture.detectChanges();

    component.initialValue = education;
    tick();

    expect(component.form.value)
      .toEqual(jasmine.objectContaining({ id: education.id }));
  }));

  it('should submit data successfully', async(() => {
    fixture.detectChanges();

    component.form.patchValue(education);
    component.save
      .pipe(take(1))
      .subscribe(data =>
        expect(data.educations).toContain(jasmine.objectContaining(
          { id: education.id }
        ))
      );
    component.onSubmit();
  }));

  it('should delete data successfully', async(() => {
    const verificationValue = Object.assign({ id: education.id, markedToDelete: true });
    component.remove
      .pipe(take(1))
      .subscribe(({ educations }) =>
        expect(educations)
          .toContain(jasmine.objectContaining(verificationValue))
      );

    component.onDelete(education);
  }));

  it('should manage education dates successfully', () => {
    const entry = new Education(
      1,
      'Sample Schools',
      '2017-01-01',
      '2018-01-01',
      'B.S.'
    );

    expect(entry.startYear).toEqual('2017');
    expect(entry.endYear).toEqual('2018');

    Object.assign(entry, { startDate: null, endDate: null });

    expect(entry.startYear).toEqual('');
    expect(entry.endYear).toEqual('');
  });
});
