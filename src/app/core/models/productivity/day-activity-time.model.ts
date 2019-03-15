import { TimeSlot } from 'app/core/models/productivity/time-slot.model';

export interface DayActivityTime {
  contractorTimeSlots: TimeSlot[];
  managerTimeSlots: TimeSlot[];
}
