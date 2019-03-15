import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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

import { Certification } from 'app/core/models/candidate';
import { CertificationFormComponent } from 'app/shared/components/certification-form/certification-form.component';

describe('CertificationFormComponent', () => {
  let component: CertificationFormComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        CertificationFormComponent,
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
      fixture = TestBed.createComponent(CertificationFormComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should associate an initial value successfully', fakeAsync(() => {
    fixture.detectChanges();

    const entry = {
      id: 9,
      name: 'SAMPLE_NAME',
      startDateTime: '2018-03-21',
      endDateTime: '2018-03-21',
    };
    component.initialValue = entry;
    tick();

    expect(component.form.value)
      .toEqual(jasmine.objectContaining({
        ...entry,
        startDateTime: jasmine.any(Date),
        endDateTime: jasmine.any(Date),
      }));
  }));

  it('should submit data successfully', async(() => {
    fixture.detectChanges();

    const entries = [{
      id: 9,
      name: 'SAMPLE_NAME',
      startDateTime: '2018-03-21',
      endDateTime: '2018-03-21',
    }];
    component.form.setValue(entries[0]);
    component.save
      .pipe(take(1))
      .subscribe(({ certifications }) =>
        expect(certifications).toContain(entries[0])
      );

    component.onSubmit();
  }));

  it('should delete data successfully', async(() => {
    const entry = Object.assign({ id: 1, markedToDelete: true }) as Certification;
    component.remove
      .pipe(take(1))
      .subscribe(({ certifications }) => expect(certifications).toContain(entry));

    component.onDelete(entry);
  }));

  it('should manage certification dates successfully', () => {
    const certification = new Certification(
      1,
      'Sample Certification',
      new Date('2017-01-01T00:00:00Z'),
      new Date('2018-01-01T00:00:00Z'),
      true
    );
    const certificationWithoutDates = Object.assign(
      new Certification(
        1,
        'Sample Certification',
        '',
        '',
        true
      ),
      {
        startDate: null,
        endDate: null,
      }
    ) as Certification;

    expect(certification.startAsDate).toEqual(jasmine.any(Date));
    expect(certification.endAsDate).toEqual(jasmine.any(Date));

    delete certification.startDateTime;
    delete certification.endDateTime;

    expect(certification.startAsDate).toBe('');
    expect(certification.endAsDate).toBe('');

    expect(certificationWithoutDates.startAsDate).toBe('');
    expect(certificationWithoutDates.endAsDate).toBe('');
  });
});
