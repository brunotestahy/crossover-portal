import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { take } from 'rxjs/operators';

import { Employment } from 'app/core/models/candidate';
import { COUNTRIES_MOCK_DATA } from 'app/core/services/mocks/countries.mock';
import { PositionsListComponent } from 'app/shared/components/positions-list/positions-list.component';

describe('PositionsListComponent', () => {
  let component: PositionsListComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        PositionsListComponent,
      ],
      imports: [
        LayoutModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(PositionsListComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should associate entries successfully', () => {
    delete component.entries;

    const entries = [
      Object.assign(
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
        ),
        { startDate: null, endDate: null }
      ) as Employment,
      Object.assign(
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
        ),
        { startDate: null, endDate: null }
      ) as Employment,
    ];

    component.entries = entries;
    expect(component.employments).toEqual(jasmine.arrayContaining(entries));
  });

  it('should allow employment selection successfully', async(() => {
    const selectedEntry = Object.assign(
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
      ),
      { startDate: null, endDate: null }
    ) as Employment;

    component.selectedEntryChange
      .pipe(take(1))
      .subscribe(data => {
        expect(data).toBe(selectedEntry);
        expect(component.selectedEntry).toBe(selectedEntry);
      });

    component.onSelect(selectedEntry);
  }));
});
