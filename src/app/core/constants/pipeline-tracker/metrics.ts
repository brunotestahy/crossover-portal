import { Metric } from 'app/core/models/hire';

export const basicMetrics: Metric[] = [
  {
    name: 'Current Status',
    enum: 'currentStatus',
    description: '# of candidates on each stage right now.',
  },
  {
    name: 'Total',
    enum: 'total',
    description:
      '# of candidates that reach each stage since the pipeline opened.',
  },
  {
    name: 'New (last 7 days)',
    enum: 'newInLast7Days',
    description: '# of candidates that reach each stage in last 7 days.',
  },
];

export const extendedMetrics: Metric[] = [
  {
    name: 'Conversion Rate (7 days)',
    enum: 'conversionIn7Days',
    description:
      '% of people who passed to the next stage in less than 7 days.',
    suffix: '%',
  },
  {
    name: 'Conversion Rate (14 days)',
    enum: 'conversionIn14Days',
    description:
      '% of people who passed to the next stage in less than 14 days',
    suffix: '%',
  },
  {
    name: 'Time Spent',
    enum: 'medianConversionTime',
    description: 'Median time spent on each stage',
    suffix: ' hr',
  },
];
