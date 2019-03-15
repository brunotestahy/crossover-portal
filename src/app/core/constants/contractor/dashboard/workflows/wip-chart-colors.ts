import { COLORS } from 'app/core/constants/colors';

export const Regular = {
  threshold: (_value: number , goal: number) => !goal,
  chartColor: COLORS.blue,
};

export const Missing = {
  threshold: (value: number , goal: number) => {
    const percent = value * 100 / goal;
    return percent >= 90 && percent <= 110;
  },
  chartColor: '',
};

export const Warning = {
  threshold: (value: number , goal: number) => {
    const percent = value * 100 / goal;
    return percent >= 80 && percent <= 120;
  },
  chartColor: COLORS.yellow,
};

export const Error = {
  threshold: (_value: number , _goal: number) => true,
  chartColor: COLORS.red,
};
