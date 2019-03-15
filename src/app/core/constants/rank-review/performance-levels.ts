export const Danger = {
  threshold: (value: number, maxValue: number) => (value / maxValue) < 0.5,
  cssClass: 'danger',
};

export const Warning = {
  threshold: (value: number, maxValue: number) => (value / maxValue) < 0.8,
  cssClass: 'warning',
};

export const Success = {
  threshold: (_value: number, _maxValue: number) => true,
  cssClass: 'success',
};
