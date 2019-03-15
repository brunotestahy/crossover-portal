import { DfSidebarItemNodes } from '@devfactory/ngx-df';

export const APPLICATION_MENU_ITEM: DfSidebarItemNodes = {
  label: 'Application',
  link: '/candidate/application-process',
  icon: 'fa fa-fw fa-file-text-o',
};
export const APPLICATION_MENU_ITEM_CANCELLABLE: DfSidebarItemNodes = {
  label: 'Application',
  link: '/candidate/application-process',
  icon: 'fa fa-fw fa-file-text-o',
  nodes: [
    {
      label: 'Cancel Application',
      link: '/candidate/application-process/cancel',
    },
  ],
};
export const PROFILE_MENU_ITEM: DfSidebarItemNodes = {
  label: 'Profile',
  link: '/profile/user-profile',
  icon: 'fa fa-fw fa-briefcase',
};
export const SUPPORT_MENU_ITEM: DfSidebarItemNodes = {
  label: 'Support',
  link: '/support',
  icon: 'fa fa-fw fa-envelope-o',
};
export const RESOURCES_MENU_ITEM: DfSidebarItemNodes = {
  label: 'Resources',
  link: '/resources',
  icon: 'fa fa-fw fa-book',
};
export const PRIVACY_POLICY_MENU_ITEM: DfSidebarItemNodes = {
  label: 'Privacy Policy',
  link: '/documents/privacy-policy',
  icon: 'fa fa-fw fa-eye',
};
export const AVAILABLE_JOBS_MENU_ITEM: DfSidebarItemNodes = {
  label: 'Available Jobs',
  link: '/marketplace/available-jobs',
  icon: 'fa fa-fw fa-certificate',
};
export const SETTINGS_MENU_ITEM: DfSidebarItemNodes = {
  label: 'Settings',
  link: '/settings',
  icon: 'fa fa-fw fa-cog',
  nodes: [
    {
      label: 'Account Info',
      link: '/settings/account-info',
    },
    {
      label: 'Location Info',
      link: '/settings/location-info',
    },
    {
      label: 'Password',
      link: '/settings/password',
    },
    {
      label: 'Security Question',
      link: '/settings/security-question',
    },
    {
      label: 'Privacy',
      link: '/settings/privacy',
    },
  ],
};
export const CONTRACTOR_MENU_ITEM: DfSidebarItemNodes = {
  label: 'Apps',
  link: '/contractor',
  icon: 'fa fa-fw fa-user',
  nodes: [
    // This entry is temporary; the dashboard redirection logic should be implemented on ticket AWORK-36738
    {
      label: 'Team Dashboard',
      link: '/contractor/dashboard',
      auxInfo: {
        identifier: 'ALL',
      },
    },
    {
      label: 'My Dashboard',
      link: '/contractor/my-dashboard',
      nodes: [
        {
          label: 'Summary',
          link: '/contractor/my-dashboard/summary',
        },
        {
          label: 'Activity',
          link: '/contractor/my-dashboard/activity',
        },
        {
          label: 'Logbook',
          link: '/contractor/my-dashboard/logbook',
        },
        {
          label: 'Metric',
          link: '/contractor/my-dashboard/metric',
        },
      ],
      auxInfo: {
        identifier: 'MY_DASHBOARD',
      },
    },
    {
      label: 'Activities',
      link: '/contractor/team-activities',
      auxInfo: {
        identifier: 'ACTIVITIES',
      },
    },
    {
      label: 'Assignments',
      link: '/contractor/assignments',
      auxInfo: {
        identifier: 'ALL',
      },
    },
    {
      label: 'Organization',
      link: '/contractor/team-organization',
      auxInfo: {
        identifier: 'ORGANIZATION',
      },
    },
    {
      label: 'Check-in Chats',
      link: '/contractor/check-in-chats',
      auxInfo: {
        identifier: 'CHECKIN_CHATS',
      },
    },
    {
      label: 'Earnings',
      link: '/contractor/earnings',
      auxInfo: {
        identifier: 'ALL',
      },
    },
    {
      label: 'Hire',
      link: '/contractor/team-hire',
      auxInfo: {
        identifier: 'HIRE',
      },
    },
    {
      label: 'Metrics',
      link: '/contractor/team-metrics',
      auxInfo: {
        identifier: 'METRICS',
      },
    },
    {
      label: 'Rank and Review',
      link: '/contractor/rank-and-review',
      auxInfo: {
        identifier: 'RANK_AND_REVIEW',
      },
    },
    {
      label: 'Team History',
      link: '/contractor/team-history',
      auxInfo: {
        identifier: 'TEAM_HISTORY',
      },
    },
    {
      label: 'Team Summary',
      link: '/contractor/team-summary',
      auxInfo: {
        identifier: 'TEAM_SUMMARY',
      },
    },
    {
      label: 'Team Settings',
      link: '/contractor/team-settings',
      auxInfo: {
        identifier: 'TEAM_SETTINGS',
      },
    },
    {
      label: 'Timesheet',
      link: '/contractor/timesheet',
      auxInfo: {
        identifier: 'TIMESHEET',
      },
    },
    {
      label: 'Timezones',
      link: '/contractor/timezones',
      auxInfo: {
        identifier: 'TIMEZONES',
      },
    },
    {
      label: 'Reports',
      link: '/contractor/reports',
      auxInfo: {
        identifier: 'REPORTS',
      },
    },
  ],
};
export const REPORTS_ADMIN_MENU_ITEM: DfSidebarItemNodes = {
  label: 'Reports',
  link: '/report',
  icon: 'fa fa-fw fa-file',
  nodes: [
    {
      label: 'Team Performance',
      link: '/report/team-performance',
    },
    {
      label: 'Upcoming Interviews',
      link: '/report/upcoming-interviews',
    },
    {
      label: 'Pending Interviews Offers',
      link: '/report/pending-interviews',
    },
  ],
};
export const REPORTS_MANAGER_MENU_ITEM: DfSidebarItemNodes = {
  label: 'Reports',
  link: '/report',
  icon: 'fa fa-fw fa-file',
  nodes: [
    {
      label: 'Team Performance',
      link: '/report/team-performance',
    },
  ],
};
export const ENFORCER_MENU_ITEM: DfSidebarItemNodes = {
  label: 'Enforcer',
  link: '/enforcer',
  icon: 'fa fa-fw fa-file',
  nodes: [
    {
      label: 'Reports',
      link: '/enforcer/reports',
    },
    {
      label: 'Payments',
      link: '/enforcer/payments',
    },
  ],
};
