import { PaymentSetupSteps } from 'app/core/constants/onboarding-process';

  export const NOTIFICATION_TEMPLATE = [
    {
      taskType: 'candidateAcceptsDeclinesInterview',
      message:
        'Congratulations! You have been invited for an interview with %NAME% ' +
        'for position %POSITION%, ' +
        'please follow <a href="%URL%">this link</a> to proceed.',
      url: 'interview/%ID%/view',
    },
    {
      taskType: 'leaderTeamInterview_INITIAL',
      message:
        'Congratulations! You have been invited for an interview with %NAME% ' +
        'to discuss hiring %TEAM% team, ' +
        'please follow <a href="%URL%">this link</a> to proceed.',
      url: 'teaminterview/%ID%/view',
    },
    {
      taskType: 'hmTeamInterview_CANDIDATE_ACCEPTED',
      message:
        'You have an upcoming interview on %DATE% with %NAME% ' +
        'to discuess hiriing %TEAM% team. Click on this <a href="%URL%">this link</a>' +
        ' to proceed when it is time to start the interview.',
      url: 'teaminterview/%ID%/video-conference',
    },
    {
      taskType: 'candidateAttendsInterview',
      message:
        'You have an upcoming interview on %DATE% with %NAME% ' +
        'for position %POSITION%. Click on this <a href="%URL%">this link</a>' +
        ' to proceed when it is time to start the interview.',
      url: 'interview/%ID%/video-conference',
    },
    {
      taskType: 'leaderTeamInterview_CANDIDATE_ACCEPTED',
      message:
        'You have an upcoming interview on %DATE% with %NAME% ' +
        'to discuess hiring %TEAM% team. Click on this <a href="%URL%">this link</a>' +
        ' to proceed when it is time to start the interview.',
      url: 'teaminterview/%ID%/video-conference',
    },
    {
      taskType: 'candidateWasRescheduled',
      message:
        'The hiring manager %NAME%' +
        'has asked for a postponement of the interview for position %POSITION%.' +
        ' Please click on <a href="%URL%">this link</a>' +
        ' to rechedule your interview',
      url: 'interview/%ID%/video-conference',
    },
    {
      taskType: 'candidateAcceptsDeclinesOffer',
      message:
        'Congratulations! You have received an offer, please ' +
        'follow <a href="%URL%">this link</a> to proceed.',
      url: 'contract/%ID%/view',
    },
    {
      taskType: 'candidateProvidesTrackerPassword',
      message:
        'Congratulations! You have accepted an offer, please ' +
        'follow <a href="%URL%">this link</a> to setup your ' +
        'WorkSmart account.',
      url: 'candidate/onboarding-process/%ID%/welcome',
    },
    {
      taskType: PaymentSetupSteps.Payoneer,
      message:
        'Please follow <a href="%URL%">this link</a> to setup ' +
        'your Payoneer account.',
      url: 'candidate/onboarding-process/%ID%/setup-payment',
    },
    {
      taskType: 'candidateAcceptsAgreements',
      message:
        'Please follow <a href="%URL%">this link</a> to accept ' +
        'team agreement and start working.',
      url: 'contract/%ID%/agree',
    },
    {
      taskType: 'managerConductsInterview',
      message:
        'You have an upcoming interview on %DATE% with %NAME% ' +
        'for position %POSITION%. Click on this <a href="%URL%">this link</a>' +
        ' to proceed when it is time to start the interview.',
      url: 'interview/%ID%/video-conference',
    },
    {
      taskType: 'managerDecidesOnSelection',
      message:
        'Please follow <a href="%URL%">this link</a> to make ' +
        'a decision about %NAME%.',
      url: 'interview/%ID%/view',
    },
    {
      taskType: 'managerApprovesPayment',
      message:
        'Please follow <a href="%URL%">this link</a> to approve ' +
        'the invoice for the assignemnt.',
      url: 'assignments/%ID%/setup-payment',
    },
    {
      taskType: 'managerSelectsTeam',
      message:
        'Please follow <a href="%URL%">this link</a> to setup the ' +
        'team for %NAME%.',
      url: 'manager/candidates',
    },
    {
      taskType: 'candidateStartsHackerRank',
      message:
        'Please follow <a href="%URL%">this link</a> to start ' +
        'your technical screen.',
      url: 'candidate/application/contact-data/%ID%',
    },
    {
      taskType: 'techTrialUpdatesStatus1',
      message:
        'Please follow <a href="%URL%">this link</a> to start ' +
        'your technical screen.',
      url: 'candidate/application/contact-data/%ID%',
    },
    {
      taskType: 'candidateCompletesProfile',
      message:
        'Please follow <a href="%URL%">this link</a> to create ' +
        'your profile.',
      url: 'candidate/application/complete-profile/%ID%',
    },
    {
      taskType: 'candidateStartsAssignment',
      message:
        'Please follow <a href="%URL%">this link</a> to start ' +
        'your project evaluation.',
      url: 'candidate/application/second-test/%ID%',
    },
    {
      taskType: 'candidateEndsAssignment',
      message:
        'Please follow <a href="%URL%">this link</a> to submit ' +
        'your project evaluation.',
      url: 'candidate/application/second-test/%ID%',
    },
    {
      taskType: 'candidateProvidesContactInformation1',
      message:
        'Please follow <a href="%URL%">this link</a> to update ' +
        'your contact data.',
      url: 'candidate/application/contact-data/%ID%',
    },
    {
      taskType: 'candidateProvidesContactInformation2',
      message:
        'Please follow <a href="%URL%">this link</a> to update ' +
        'your contact data.',
      url: 'candidate/application/contact-data/%ID%',
    },
  ];
