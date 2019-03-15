import { GroupItem } from 'app/core/models/productivity/group-item.model';

export interface AdvancedGroup {
  color: string;
  groupItems: GroupItem[];
  sectionName: string;
  spentTime: number;
}
