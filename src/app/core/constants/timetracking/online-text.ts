import {
  offlineTimeMinutes,
  onlineTimeMinutes,
} from 'app/core/constants/timetracking/online-status';

export const OnlineText = [
  {
    condition: (time: number) => time <= onlineTimeMinutes,
    content: (_time: number) => 'Online',
  },
  {
    condition: (time: number) => time < offlineTimeMinutes,
    content: (_time: number) => 'Last online: <1 hour ago',
  },
  {
    condition: (_time: number) => true,
    content: (time: number) => {
      const offlineHoursAmount = time / 60;
      if (offlineHoursAmount > 24) {
        return `Last online: ${Math.floor(offlineHoursAmount / 24).toFixed(0)} day(s) ago`;
      }
      return `Last online: ${offlineHoursAmount.toFixed(0)} hour(s) ago`;
    },
  },
];
