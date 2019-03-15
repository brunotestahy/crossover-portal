import { COLORS } from 'app/core/constants/colors';

export const Regular = {
  threshold: (leadTime: number, _overdueIssues: number , _totalIssues: number) => !leadTime,
  chartColor: COLORS.blue,
};

export const Missing = {
  threshold: (_leadTime: number, overdueIssues: number , totalIssues: number) =>
    overdueIssues === 0 || overdueIssues * 100 / totalIssues === 0,
  chartColor: '',
};

export const Warning = {
  threshold: (_leadTime: number, overdueIssues: number , totalIssues: number) =>
    overdueIssues * 100 / totalIssues < 20,
  chartColor: COLORS.yellow,
};

export const Error = {
  threshold: (_leadTime: number, _overdueIssues: number , _totalIssues: number) => true,
  chartColor: COLORS.red,
};
