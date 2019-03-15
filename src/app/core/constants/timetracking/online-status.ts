export const onlineTimeMinutes = 29;
export const offlineTimeMinutes = 69;

export const OnlineStatus = [
  {
    condition: (time: number) => time <= onlineTimeMinutes,
    cssClass: 'online',
  },
  {
    condition: (time: number) => time < offlineTimeMinutes,
    cssClass: 'no-activity',
  },
  {
    condition: (_time: number) => true,
    cssClass: 'offline',
  },
];
