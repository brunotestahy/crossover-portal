import { GroupItem } from 'app/core/models/productivity/group-item.model';

export interface Section {
  sectionName?: string;
  spentTime: number;
  percentageRounded?: number;
  groupItems: GroupItem[];
  color: string;
  percentage: number;
}
