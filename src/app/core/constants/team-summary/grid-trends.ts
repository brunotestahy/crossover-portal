import { COLORS } from 'app/core/constants/colors';

export const Danger = {
  threshold: (value: number, maxValue: number) => (value / maxValue) < 0.3,
  cssClass: 'danger',
  barColor: COLORS.red,
};

export const Warning = {
  threshold: (value: number, maxValue: number) => (value / maxValue) < 0.7,
  cssClass: 'warning',
  barColor: COLORS.yellow,
};

export const Success = {
  threshold: (_value: number, _maxValue: number) => true,
  cssClass: 'success',
  barColor: COLORS.green,
};
