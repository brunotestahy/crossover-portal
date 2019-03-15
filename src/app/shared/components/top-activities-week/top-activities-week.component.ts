import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { DfBarChartItem, DfChartAlignment, DfChartMargins } from '@devfactory/ngx-df';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { RESPONSIVE_BREAKPOINT } from 'app/core/constants/breakpoint';
import { AdvancedGroup } from 'app/core/models/productivity/advanced-group.model';
import { GroupItem } from 'app/core/models/productivity/group-item.model';
import { ProductivityGroup } from 'app/core/models/productivity/productivity-group.model';

type ItemData = DfBarChartItem & { categoryName: string, color: string };

@Component({
  selector: 'app-top-activities-week',
  templateUrl: './top-activities-week.component.html',
  styleUrls: ['./top-activities-week.component.scss'],
})
export class TopActivitiesWeekComponent implements OnChanges, OnDestroy {
  private destroy$ = new Subject();
  private readonly MINUTES_PER_HOUR = 60;

  @Input()
  public productivityGroups: ProductivityGroup[];
  @Input()
  public isLoading: boolean;

  public chartData: Array<ItemData> = [];

  public data: Array<ItemData>;

  public isResponsive: boolean;

  public margins: DfChartMargins = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 20,
  };

  public colors: string[] = [];

  public horizontalAlignment = DfChartAlignment.Horizontal;

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  public tickFormatter = (value: number) => value + 'h';


  public ngOnChanges(): void {
    /* istanbul ignore else */
    if (this.productivityGroups) {
      this.data = this.setupData();

    this.breakpointObserver.observe(RESPONSIVE_BREAKPOINT)
      .pipe(takeUntil(this.destroy$))
      .subscribe(responsive => {
        if (responsive.matches) {
          this.margins = {
            top: 20,
            right: 20,
            bottom: 60,
            left: 5,
          };
          this.chartData = this.data.map(item => {
            return {
              ...item,
              categoryName: `${item.xKey} (${item.categoryName})`,
            };
          });
        } else {
          this.margins = {
            top: 20,
            right: 20,
            bottom: 60,
            left: 170,
          };
          this.chartData = this.data.map(item => {
            return {
              ...item,
              categoryName: item.categoryName,
            };
          });
        }
      });
      this.colors = this.data.map(d => d.color);
    }
  }

  public setupData(): ItemData[] {
    const groupItems: GroupItem[] = [];
    const advancedGroups = ([] as AdvancedGroup[]).concat(...this.productivityGroups[0].grouping.advancedGroups);
    advancedGroups.forEach(group => {
      group.groupItems.forEach(item => {
        item.sectionName = group.sectionName;
      });
      groupItems.push(...group.groupItems);
    });
    groupItems.sort((a, b) => b.spentTime - a.spentTime);
    const topSixItems = groupItems.slice(0, 6);
    return topSixItems.map(item => {
      return {
        xKey: item.applicationName,
        yKey: item.spentTime / this.MINUTES_PER_HOUR,
        categoryName: item.sectionName,
        color: item.categoryColor,
      };
    });
  }

  public barLabel(item: ItemData): string {
    return item.categoryName;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
