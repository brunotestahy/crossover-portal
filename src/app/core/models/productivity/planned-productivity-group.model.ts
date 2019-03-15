import { DaySlot } from 'app/core/models/productivity/day-slot.model';
import { ProductivityGroupList } from 'app/core/models/productivity/productivity-group-list.model';

export interface PlannedProductivityGroup {
  daySlots: DaySlot[];
  groupedList: ProductivityGroupList[];
  totalTime: number;
}
