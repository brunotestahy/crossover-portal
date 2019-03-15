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

import { Certification } from 'app/core/models/candidate';
import { CertificationFormComponent } from 'app/shared/components/certification-form/certification-form.component';
import { CertificationListComponent } from 'app/shared/components/certification-list/certification-list.component';


describe('CertificationListComponent', () => {
  let component: CertificationListComponent;
  let fixture: ComponentFixture<typeof component>;
  const certification = new Certification(
    1,
    'Sample Cerification',
    '2018-01-01',
    '2018-03-21'
  );

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        CertificationListComponent,
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
      fixture = TestBed.createComponent(CertificationListComponent);
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
      .subscribe(data => expect(data).toBe(certification));
    component.onEdit(certification);
  }));

  it('should accept an entry for saving successfully', async(() => {
    const certifications = [certification];
    component.save
      .pipe(take(1))
      .subscribe(candidate =>
        expect(candidate.certifications).toContain(certification)
      );
    component.onSave({ certifications });
  }));

  it('should cancel data editing successfully', async(() => {
    component.cancel
      .pipe(take(1))
      .subscribe(value => expect(value).toBe(true));
    component.selectedEntry = certification;
    component.onCancel();
    expect(component.selectedEntry).toBeNull();
  }));

  it('should accept a delete request successfully', () => {
    const certifications = [certification];
    component.remove
      .pipe(take(1))
      .subscribe(candidate =>
        expect(candidate.certifications).toContain(certification)
      );
    component.onDelete({ certifications });
  });
});
