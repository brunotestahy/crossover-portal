import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Employment } from 'app/core/models/candidate';

@Component({
  selector: 'app-positions-list',
  templateUrl: './positions-list.component.html',
  styleUrls: ['./positions-list.component.scss'],
})
export class PositionsListComponent {
  public employments: Employment[];

  @Input()
  public set entries(value: Employment[]) {
    this.employments = (value || []).sort(
      (previous, next) =>
        (next.startDate || '').toString().localeCompare(previous.startDate as string)
    );
  }

  @Input()
  public isEditable = true;

  @Input()
  public selectedEntry: Employment;

  @Output()
  public selectedEntryChange = new EventEmitter<Employment>();

  public onSelect(entry: Employment): void {
    this.selectedEntryChange.emit(this.selectedEntry = entry);
  }
}
