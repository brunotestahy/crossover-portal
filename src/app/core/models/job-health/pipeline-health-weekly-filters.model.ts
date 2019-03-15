import { PipelineHealthFiltersOptions } from './pipeline-health-filters-options.model';

export interface PipelineHealthWeekFilters {
  startOfWeek: Date;
  options: PipelineHealthFiltersOptions;
}
