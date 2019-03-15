export const Danger = {
  threshold: (value: number, maxValue: number) => (value / maxValue) < 0.3,
  cssClass: 'danger',
};

export const Warning = {
  threshold: (value: number, maxValue: number) => (value / maxValue) < 0.7,
  cssClass: 'warning',
};

export const Success = {
  threshold: (_value: number, _maxValue: number) => true,
  cssClass: 'success',
};
