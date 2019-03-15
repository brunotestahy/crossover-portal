import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfButtonModule,
  DfCardModule,
  DfCheckboxModule,
  DfCoreModule,
  DfDatepickerModule,
  DfInputModule,
  DfMouseUpService,
  DfSelectModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';

import { Employment } from 'app/core/models/candidate';
import { COUNTRIES_MOCK_DATA } from 'app/core/services/mocks/countries.mock';
import { PositionsFormComponent } from 'app/shared/components/positions-form/positions-form.component';

describe('PositionsFormComponent', () => {
  let component: PositionsFormComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        PositionsFormComponent,
      ],
      imports: [
        DfButtonModule,
        DfCoreModule.forRoot(),
        DfCardModule,
        DfCheckboxModule,
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
      fixture = TestBed.createComponent(PositionsFormComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should initialize values successfully', () => {
    const initialValue = new Employment(
      1,
      'Company 1',
      'London',
      COUNTRIES_MOCK_DATA[0],
      'Sample Title',
      'Sample Role',
      '2017-01-01',
      '2018-01-01',
      false,
      'Sample Employment Entry'
    );
    component.countries = COUNTRIES_MOCK_DATA;
    fixture.detectChanges();

    component.initialValue = initialValue;

    expect(component.form.value.id).toBe(initialValue.id);
  });

  it('should submit data successfully', async(() => {
    const initialValue = new Employment(
      1,
      'Company 1',
      'London',
      COUNTRIES_MOCK_DATA[0],
      'Sample Title',
      'Sample Role',
      '2017-01-01',
      '2018-01-01',
      false,
      'Sample Employment Entry'
    );
    component.initialValue = initialValue;

    component.ngOnInit();

    component.save
      .pipe(take(1))
      .subscribe(data =>
        expect((data.employments as Employment[])[0].id).toEqual(initialValue.id));
    component.onSubmit();
  }));

  it('should delete data successfully', async(() => {
      const initialValue = new Employment(
        1,
        'Company 1',
        'London',
        COUNTRIES_MOCK_DATA[0],
        'Sample Title',
        'Sample Role',
        '2017-01-01',
        '2018-01-01',
        false,
        'Sample Employment Entry'
      );
      const verificationValue = Object.assign({ id: initialValue.id, markedToDelete: true });

      component.remove
        .pipe(take(1))
        .subscribe(data => expect((data.employments as Partial<Employment>[])[0]).toEqual(
          jasmine.objectContaining(verificationValue)
        ));

      component.onDelete(initialValue);
  }));

  it('should grab the formatted date instances from an employment successfully', () => {
    const employment = Object.assign(
      new Employment(
        1,
        'Company 1',
        'London',
        COUNTRIES_MOCK_DATA[0],
        'Sample Title',
        'Sample Role',
        '',
        '',
        false,
        'Sample Employment Entry'
      )
    , { startDate: null, endDate: null }) as Employment;

    expect(employment.formattedStartDate).toBe('');
    expect(employment.formattedEndDate).toBe('');

    employment.startDate = '2017-01-01';
    expect(employment.formattedStartDate).toBe('Jan 2017');

    employment.endDate = '2018-01-01';
    expect(employment.formattedEndDate).toBe('Jan 2018');

    employment.current = true;
    expect(employment.formattedEndDate).toBe('Current');
  });
});
