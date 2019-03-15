export const CONTRACTOR_BUTTONS = [
  {
    displayText: 'My Dashboard',
    class: 'app-icon__dashboard',
    link: '/contractor/my-dashboard/summary',
  },
  {
    displayText: 'Check-in Chats',
    class: 'app-icon__check-in-chats',
    link: '/contractor/check-in-chats',
  },
  {
    displayText: 'Timezones',
    class: 'app-icon__timezones',
    link: '/contractor/timezones',
  },
  {
    displayText: 'Rank & Review',
    class: 'app-icon__rand-and-review',
    link: '/contractor/rank-and-review',
  },
  {
    displayText: 'Learn',
    class: 'app-icon__learn',
    externalUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc2KRh6GizJ5tdkil8xsAVAS3vq-bQEP5bc4D8EkjAZFdR7PA/viewform?c=0&w=1',
  },
  {
    displayText: 'World',
    class: 'app-icon__world',
    link: '/world',
  },
  {
    displayText: 'Community',
    class: 'app-icon__community',
    externalUrl: 'https://www.facebook.com/groups/219726845099754',
  },
  {
    displayText: 'WorkSmart',
    class: 'app-icon__worksmart',
    worksmartUrl: 'https://worksmart-%(env)s.crossover.com/#/login?otp=%(contractorId)s:%(date)s:%(token)s',
  },
];
