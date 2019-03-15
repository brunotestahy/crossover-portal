export const REPORTS_ACTIVITIES_MOCK = {
  meetings: {
    title: 'Meetings',
    hint: 'WorkSmart analyzes your calendar to let you know how you spend your time on meetings.',
    insight: `
    <p>
      WorkSmart analyzes your calendar to let you know how you spend your time on meetings. Calendar events are considered meetings
      if they have at least 2 participants, and the event was not declined by the user.
    </p>
    <p> WorkSmart contains a sensor to track activity from the following calendar application(s): </p>
    <p> - Outlook (2010, 2013 and 2016) </p>
    <p> Support for other applications will be coming in the future. </p>
    <h4>What is included in the report?</h4>
    <h5 class="mt-2">
      <u>Work Time</u>
    </h5>
    <p>
      Total time worked. Includes the time tracked on the pc, meetings, and calls (if available).
    </p>
    <h5>
      <u>Time in Meetings</u>
    </h5>
    <p>
        Total time spent on meetings. This includes the time spent on applications categorized as 'Meeting', plus the time spent
        on calendar events from the calendar applications supported by the WorkSmart sensor. Whenever there's an overlap between
        a calendar event and a Meeting application being used, WorkSmart makes sure minutes are not counted twice.
    </p>
    <h5>
      <u>Time in Meetings %</u>
    </h5>
    <p>
      Percentage of time spent in Meetings vs Work Time.
    </p>
    <h5>
      <u>Same Company</u>
    </h5>
    <p>
      Percentage of time spent in meetings with people from the same company as you, based on the email address of the participants.
    </p>
    <h5>
      <u>Outside the Company</u>
    </h5>
    <p>
      Percentage of time spent in meetings with at least one person from outside the company, based on the email address of the participants.
    </p>
    <h5>
      <u>In the morning</u>
    </h5>
    <p>
      Percentage of time spent in meetings that started before 12:00pm.
    </p>
    <h5>
      <u>In the afternoon</u>
    </h5>
    <p>
      Percentage of time spent in meetings that started after 12:00pm.
    </p>`,
  },
  email: {
    title: 'Email',
    hint: 'WorkSmart analyzes your email applications to let you know how you spend your time on email.',
    insight: `
    <p> WorkSmart analyzes your email applications to let you know how you spend your time on email. </p>
    <p> WorkSmart contains a sensor to track activity from the following email application(s): </p>
    <p> - Outlook (2010, 2013 and 2016) </p>
    <p> Support for other applications will be coming in the future. </p>
    <h4>What is included in the report?</h4>
    <p>
      <u>Work Time</u>
    </p>
    <p>
      Total time worked. Includes the time tracked on the pc, meetings, and calls (if available).
    </p>
    <p>
      <u>Time in Email</u>
    </p>
    <p>
      Total time spent in email applications.
    </p>
    <p>
      <u>Time in Emails %</u>
    </p>
    <p>
      Percentage of time spent in email out of total worked time
    </p>
    <p>
      <u>Emails Sent</u>
    </p>
    <p>
      Number of emails sent.
    </p>
    <p>
      <u>Emails Received</u>
    </p>
    <p>
      Number of emails received.
    </p>
    <p>
      <u>In the morning</u>
    </p>
    <p>
      Percentage of time spent on email until 12:00 pm.
    </p>
    <p>
      <u>In the afternoon</u>
    </p>
    <p>
      Percentage of time spent on email after 12:00 pm.
    </p>`,
  },
  calls: {
    title: 'Calls',
    hint: 'WorkSmart analyzes your voice/video calls applications to let you know how you spend your time during calls.',
    insight: `
    <p> WorkSmart analyzes your voice/video calls applications to let you know how you spend your time during calls. </p>
    <p>
      WorkSmart contains a sensor to track activity from the following calling application(s): </p>
    <p> - Skype, Zoom </p>
    <p> Support for other applications will be coming in the future. </p>
    <h4>What is included in the report?</h4>
    <p>
      <u>Work Time</u>
    </p>
    <p>
      Total time worked. Includes the time tracked on the pc, meetings, and calls (if available).
    </p>
    <p>
      <u>Time in Calls</u>
    </p>
    <p>
      Total time spent on calls. This includes only time spent on calls on the applications supported by the WorkSmart sensor.
    </p>
    <p>
      <u>Time in Calls %</u>
    </p>
    <p>
      Percentage of time spent in Calls vs Work Time.
    </p>
    <p>
      <u>Same Company</u>
    </p>
    <p>
      Percentage of time spent on calls with people from the same company as you, based on the email address or Skype id of the
        participants.
    </p>
    <p>
      <u>Outside the Company</u>
    </p>
    <p>
      Percentage of time spent in meetings with at least one person from outside the company, based on the email address or Skype
        id of the participants.
    </p>
    <p>
      <u>Calls Made</u>
    </p>
    <p>
      Number of calls started by the user.
    </p>
    <p>
      <u>Calls Received</u>
    </p>
    <p>
      Number of calls received by the user.
    </p>
    <p>
      <u>In the morning</u>
    </p>
    <p>
      Percentage of time spent on calls before 12:00pm.
    </p>
    <p>
      <u>In the afternoon</u>
    </p>
    <p>
      Percentage of time spent on calls after 12:00pm.
    </p>`,
  },
  im: {
    title: 'IM',
    hint: 'WorkSmart analyzes your Instant Messaging applications to let you know how you spend your time while chatting.',
    insight: `
    <p> WorkSmart analyzes your Instant Messaging applications to let you know how you spend your time while chatting. </p>
    <p>
      WorkSmart contains a sensor to track activity from the following IM application(s): </p>
    <p> - Slack </p>
    <p> Support for other applications will be coming in the future. </p>
    <h4>What is included in the report?</h4>
    <p>
      <u>Work Time</u>
    </p>
    <p>
      Total time worked. Includes the time tracked on the pc, meetings, and calls (if available).
    </p>
    <p>
      <u>Time in IM</u>
    </p>
    <p>
      Total time spent on Instant Messaging (Chat) applications.
    </p>
    <p>
      <u>Time in IM %</u>
    </p>
    <p>
      Percentage of time spent in IM applications vs Work Time.
    </p>
    <p>
      <u>Same Team</u>
    </p>
    <p>
      Percentage of messages sent to people of the same team as the user. In group chats, a message is counted once for every
        reader.

    </p>
    <p>
      <u>Outside the Team</u>
    </p>
    <p>
      Percentage of messages sent to people outside the team of the user. In group chats, a message is counted once for every
        reader.

    </p>
    <p>
      <u>Messages Sent</u>
    </p>
    <p>
      Number of messages sent by the user. In group chats, each message sent counts as one.
    </p>
    <p>
      <u>Messages Received</u>
    </p>
    <p>
      Number of messages received by the user.
    </p>
    <p>
      <u>In the morning</u>
    </p>
    <p>
      Percentage of instant messages sent before 12:00pm.
    </p>
    <p>
      <u>In the afternoon</u>
    </p>
    <p>
      Percentage of instant messages sent after 12:00pm.
    </p>`,
  },
  intensity: {
    title: 'Intensity',
    hint:
      'WorkSmart analyzes how intense the work of their users is, by counting the number of keystrokes and mouse clicks per minutes (Note: We do not collect which keys are pressed).',
    insight: `
  <p> WorkSmart analyzes how 'intense' the work of their users is, by counting the number of keystrokes and mouse clicks per minutes
    (Note: We do not collect which keys are pressed).</p>
  <h4> Some important definitions:</h4>
  <p>
    <u>Intense timecard:</u>
  </p>
  <p>
    10-minute timecard with more than 30 keystrokes + mouse clicks per minutes on average.
  </p>
  <p>
    <u>Intense time:</u>
  </p>
  <p>
    Total time of intense activity as the sum of the minutes in all intense timecards.
  </p>
  <h4>What is included in the report?</h4>
  <p>
    <u>Work Time</u>
  </p>
  <p>
    Total time worked. Includes the time tracked on the pc, meetings, and calls (if available).
  </p>
  <p>
    <u>Intense Time</u>
  </p>
  <p>
    Total Intense time of the user.
  </p>
  <p>
    <u>Intense Time %</u>
  </p>
  <p>
    Total Intense time, as a percentage of the total work time.
  </p>
  <p>
    <u>In the morning</u>
  </p>
  <p>
    Percentage of Intense time before 12:00pm (local time).
  </p>
  <p>
    <u>In the afternoon</u>
  </p>
  <p>
    Percentage of Intense time after 12:00pm (local time).
  </p>
  <p>
    <u>Most Intense App.</u>
  </p>
  <p>
    The application with the highest number of keystrokes+mouse clicks for the user.
  </p>
  <p>
    <u>Most Intense Category</u>
  </p>
  <p>
    The category with the highest number of keystrokes+mouse clicks for the user.
  </p>`,
  },
  focus: {
    title: 'Focus',
    hint:
      'Deep Work - the activity of focusing on one activity at a time for long periods of time - is proven to maximize productivity. The Focus Insight try to measure how focus are the users on one activity at a time.',
    insight: `
  <p> Deep Work - the activity of focusing on one activity at a time for long periods of time - is proven to maximize productivity.
    The Focus Insight try to measure how focus are the users on one activity at a time. </p>
  <p> Some important definitions: </p>
  <p>
    <u>Predominant Application:</u>
  </p>
  <p>
     The application/website in a timecard, present in the highest amount of minutes. Eg: In a given 10-minute timecard, if
      you spend 5 minutes on Word, 3 minutes on Skype, and 2 on Excel, then the predominant application is Word, and the predominant
      category is Office (the category of Word).
  </p>
  <p>
    <u>Focus streak:</u>
  </p>
  <p>
     Consecutive timecards (greater than 3 consecutive timecards = at least 30 minutes) with the predominant application being
      in the same category (office, email, etc). Eg: The predominant application from 12:00 to 12:20 was Excel, and from 12:20
      until 12:50 was Word, then there was a focus streak of 50 minutes, because both Excel and Word belong to the Office category.

  </p>
  <p>
    <u>Focus time:</u>
  </p>
  <p>
     Total time as the sum of all focus streaks.
  </p>
  </div>
  <h4>What is included in the report?</h4>
  <p>
    <u>Work Time</u>
  </p>
  <p>
    Total time worked. Includes the time tracked on the pc, meetings, and calls (if available).
  </p>
  <p>
    <u>Focus Time</u>
  </p>
  <p>
    Total Focus time of the user.
  </p>
  <p>
    <u>Focus Time %</u>
  </p>
  <p>
    Total Focus time, as a percentage of the total work time.
  </p>
  <p>
    <u>In the morning</u>
  </p>
  <p>
    Percentage of Focus time before 12:00pm (local time).
  </p>
  <p>
    <u>In the afternoon</u>
  </p>
  <p>
    Percentage of Focus time after 12:00pm (local time).
  </p>
  <p>
    <u>Most Focused App</u>
  </p>
  <p>
    The application which was the predominant application inside focus streaks the most often. In other words, the application
      with the highest focus.
  </p>
  <p>
    <u>Most Focused Category</u>
  </p>
  <p>
    The category which was the predominant category inside focus streaks the most often. In other words, the category with
      the highest focus.
  </p>
  <p>
    <u>Main Focus Breaker</u>
  </p>
  <p>
    The application/website which broke the most focus streaks. This means that the Focus Breaker was the predominant application
      of a timecard, which came after a focus streak of a different category. Eg: If you’re on a focus streak of ‘Office’ from
      12:00 until 12:50, and then you spend 7 minutes on Slack (category = Chat), then the focus streak ends, and Slack is
      a ‘focus breaker’.
  </p>`,
  },
};
