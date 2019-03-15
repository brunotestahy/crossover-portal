import { CheckInStatus } from 'app/core/models/productivity/check-in-status.model';

export const CHECKIN_STATUSES: CheckInStatus[] = [{
  order: 1,
  key: 'ON_TRACK',
  name: 'On Track',
  color: '#66BB6A',
  description: 'Individual is on track to hit metric goal.',
}, {
  order: 2,
  key: 'WRONG_THING',
  name: 'Wrong Thing',
  color: '#EF5350',
  description: `Individual is working, but working on something
  that doesn\'t effect the metric. Manager can correct immediately by specifying clearly what to work on instead.`,
}, {
  order: 3,
  key: 'WRONG_PROCESS',
  name: 'Wrong Process',
  color: '#FF9800',
  description: `Individual is working with the wrong process.
  Examples: using software incorrectly, not marking the right fields,
  not using automated systems, not escalating when blocked. Manager can correct immediately by explaining the correct process to follow.`,
}, {
  order: 4,
  key: 'NEEDS_ACTION',
  name: 'Needs Action',
  color: '#9575CD',
  description: `Individual stuck needing action or decision from another team or person.
  Manager can correct immediately by making an assumption or default decision to get work progressing, and then follow up with appropriate
  person to verify or countermand the decision.`,
}, {
  order: 5,
  key: 'TOO_HARD',
  name: 'Too Hard',
  color: '#FDD835',
  description: `Individual can\'t think of a way to proceed, or has tried ways to proceed but they haven\'t yielded results.
  Manager can correct immediately by brainstorming and applying management expertise and identifying next steps.`,
}, {
  order: 6,
  key: 'WORK_NOT_DEFINED',
  name: 'Work Not Defined',
  color: '#BA68C8',
  description: `Individual cannot work 8 hours per day because management has not defined the work to be done.
  Manager can define enough work immediately so that individual can work.`,
}, {
  order: 7,
  key: 'NOT_WORKING',
  name: 'Not Working',
  color: '#CDD3D5',
  description: 'Individual is not currently working.',
}, {
  order: 8,
  key: 'NOT_DONE',
  name: 'Not Done',
  color: '#90A4AE',
  description: 'Manager did not complete check-in-chat.',
}];
