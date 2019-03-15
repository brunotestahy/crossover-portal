import { Section } from 'app/core/models/productivity/section.model';

export interface PercentageChartRow {
  teamMember: string;
  sections: Partial<Section>[];
}
