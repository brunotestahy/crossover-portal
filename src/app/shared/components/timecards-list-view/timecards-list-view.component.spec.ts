import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfGrid } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { instance, mock } from 'ts-mockito';

import { TimecardsListViewComponent } from 'app/shared/components/timecards-list-view/timecards-list-view.component';

describe('TimecardsListViewComponent', () => {
  let component: TimecardsListViewComponent;
  let fixture: ComponentFixture<TimecardsListViewComponent>;

  let breakpointObserver: BreakpointObserver;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimecardsListViewComponent,
      ],
      providers: [
        { provide: BreakpointObserver, useFactory: () => mock(BreakpointObserver) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimecardsListViewComponent);
    component = fixture.componentInstance;

    breakpointObserver = TestBed.get(BreakpointObserver);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the list rows properly when the page is loaded', () => {
    expect(component.workDiaryRows).toBeUndefined();

    component.workDiaries = Object.assign([{
      date: '2018-01-01T00:00:00',
      id: 13,
      screenshot: { url: 'http' },
    }]);

    expect(component.workDiaryRows).toBeDefined();
  });

  it('should observe the responsiveness and expand all rows in the list when the component is loaded', () => {
    const matches = { matches: true };
    component.workDiaryRows = Object.assign([{ id: 1 }, { id: 2 }]);
    component.mainGrid = instance(mock(DfGrid));
    spyOn(breakpointObserver, 'observe').and.returnValue(of(matches).pipe(take(1)));
    spyOn(component.mainGrid, 'isRowExpanded').and.returnValue(false);
    spyOn(component.mainGrid, 'toggleRow').and.returnValue('');

    fixture.detectChanges();

    expect(component.isResponsive).toBe(matches.matches);
    expect(component.mainGrid.toggleRow).toHaveBeenCalledTimes(component.workDiaryRows.length);
  });

  it('should not expand all rows in the list when the component is loaded and the rows are already expanded', () => {
    const matches = { matches: true };
    component.workDiaryRows = Object.assign([{ id: 1 }, { id: 2 }]);
    component.isExpanded = true;
    component.mainGrid = instance(mock(DfGrid));
    spyOn(breakpointObserver, 'observe').and.returnValue(of(matches).pipe(take(1)));
    spyOn(component.mainGrid, 'toggleRow').and.returnValue('');

    fixture.detectChanges();

    expect(component.isResponsive).toBe(matches.matches);
    expect(component.mainGrid.toggleRow).not.toHaveBeenCalledWith();
  });

  it('should not expand all rows when they are already expanded and the component is reloaded', () => {
    const changes: SimpleChanges = Object.assign({ isExpanded: { firstChange: false } });
    component.workDiaryRows = Object.assign([{ id: 1 }, { id: 2 }]);
    component.mainGrid = instance(mock(DfGrid));
    spyOn(component.mainGrid, 'isRowExpanded').and.returnValue(true);
    spyOn(component.mainGrid, 'toggleRow').and.returnValue('');

    component.ngOnChanges(changes);

    expect(component.mainGrid.toggleRow).not.toHaveBeenCalledWith();
  });

  it('should collapse all rows when the component is reloaded ', () => {
    const changes: SimpleChanges = Object.assign({ isExpanded: { firstChange: false } });
    component.isExpanded = true;
    component.workDiaryRows = Object.assign([{ id: 1 }, { id: 2 }]);
    component.mainGrid = instance(mock(DfGrid));
    spyOn(component.mainGrid, 'isRowExpanded').and.returnValue(true);
    spyOn(component.mainGrid, 'toggleRow').and.returnValue('');

    component.ngOnChanges(changes);

    expect(component.mainGrid.toggleRow).toHaveBeenCalledTimes(component.workDiaryRows.length);
  });

  it('should not collapse all rows when they are already collapsed and the component is reloaded', () => {
    const changes: SimpleChanges = Object.assign({ isExpanded: { firstChange: false } });
    component.isExpanded = true;
    component.workDiaryRows = Object.assign([{ id: 1 }, { id: 2 }]);
    component.mainGrid = instance(mock(DfGrid));
    spyOn(component.mainGrid, 'isRowExpanded').and.returnValue(false);
    spyOn(component.mainGrid, 'toggleRow').and.returnValue('');

    component.ngOnChanges(changes);

    expect(component.mainGrid.toggleRow).not.toHaveBeenCalledWith();
  });

  it('should do nothing when the page is reloaded without changes', () => {
    const changes: SimpleChanges = Object.assign({ isExpanded: { firstChange: true } });
    component.isExpanded = true;
    component.mainGrid = instance(mock(DfGrid));
    spyOn(component.mainGrid, 'toggleRow').and.returnValue('');

    component.ngOnChanges(changes);

    expect(component.mainGrid.toggleRow).not.toHaveBeenCalledWith();
  });

  it('should emit an event to open the time card details when the activity level bar is clicked', () => {
    const timeCard = Object.assign({ id: 13 });
    spyOn(component.openDetails, 'emit').and.returnValue('');

    component.openTimecardDetails(timeCard);

    expect(component.openDetails.emit).toHaveBeenCalledWith(timeCard);
  });

  it('should emit an event to select the row when the time card is checked', () => {
    const rows = Object.assign([{ id: 13 }]);
    spyOn(component.rowSelect, 'emit').and.returnValue('');

    component.selectionChange(rows);

    expect(component.rowSelect.emit).toHaveBeenCalledWith(rows);
  });
});
