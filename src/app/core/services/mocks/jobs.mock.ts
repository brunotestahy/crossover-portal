import { Job } from 'app/core/models/hire/';

export const SAMPLE_JOB: Partial<Job>[] = [
  {
    'id': 3575,
    'applicationType': 'DEFAULT',
    'salary': 20.00,
    'yearSalary': 40,
    'salaryType': 'WEEKLY',
    'salaryUnit': 'HOUR',
    'status': 'ACTIVE',
    'title': '\'Application Services Engineer\'',
    'type': 'GENERIC',
    'activationDate': '2018-04-25T10:50:28.000+0000',
    'workingHoursPerWeek': 40,
  },
  {
    'id': 3137,
    'applicationType': 'NATIVE',
    'applicationFlow': {
      'id': 6,
      'name': 'Moodle and 5Q',
      'flowDefinitionType': 'HACKERRANK_FIVEQ',
    },
    'flowType': 'HACKERRANK_FIVEQ',
    'imageUrl': 'crossover-uploads-production/images/job_3137_image_607aeacb536d4cfed12bdd8a49f42238.png',
    'salary': 100.00,
    'yearSalary': 200,
    'salaryType': 'WEEKLY',
    'salaryUnit': 'HOUR',
    'status': 'ACTIVE',
    'title': 'Account Executive',
    'type': 'GENERIC',
    'activationDate': '2018-02-22T05:28:45.000+0000',
    'workingHoursPerWeek': 40,
  },
  {
    'id': 2645,
    'applicationType': 'NATIVE',
    'applicationFlow': {
      'id': 8,
      'name': 'Moodle and TT',
      'flowDefinitionType': 'HACKERRANK_ASSIGNMENT',
    },
    'flowType': 'HACKERRANK_ASSIGNMENT',
    'imageUrl': 'crossover-uploads-production/images/job_2645_image_9ac5eec70b6a35d543f106d3b81cc96e.png',
    'salary': 50.00,
    'yearSalary': 100,
    'salaryType': 'WEEKLY',
    'salaryUnit': 'HOUR',
    'status': 'ON_HOLD',
    'title': 'Android Chief Software Architect',
    'type': 'CUSTOM',
    'activationDate': '2017-11-20T17:22:26.000+0000',
    'workingHoursPerWeek': 40,
  },
];

export const TESTS_MOCK = [
  {
    "test": {
      "type": "FIVEQ",
      "id": 3123,
      "name": "Velocity Account Exec",
      "questions": [
        {
          "sequenceNumber": 1,
          "question": "<span id=\"docs-internal-guid-ef98fc93-2180-0f24-4d78-73a100e4cd9e\"><span style=\"font-size: 16px; font-family: Arial; color: rgb(45, 42, 40); background-color: transparent; vertical-align: baseline; white-space: pre-wrap;\">What challenges are you looking for in this account executive position?</span></span>",
          "rubric": "Would want to see someone looking for career growth, sales success and a desire to contribute to the company's bottom line."
        },
        {
          "sequenceNumber": 2,
          "question": "<span id=\"docs-internal-guid-ef98fc93-2180-3a65-e0f5-c314c647e449\"><span style=\"font-size: 16px; font-family: Arial; color: rgb(45, 42, 40); background-color: transparent; vertical-align: baseline; white-space: pre-wrap;\">Describe a typical work week for an account executive position.</span></span>",
          "rubric": "Things to look for;\nHigher percent of calls/meetings \nWillingness to go onsite with a client\nResearch time to be prepared for client calls\nInternal meetings"
        },
        {
          "sequenceNumber": 3,
          "question": "<span id=\"docs-internal-guid-ef98fc93-2180-8dbc-3bbf-e6ee4492db3e\"><span style=\"font-size: 16px; font-family: Arial; color: rgb(62, 62, 62); background-color: transparent; vertical-align: baseline; white-space: pre-wrap;\">How do you keep up to date on your target market?</span></span>",
          "rubric": "Want to see that they use resources such as LinkedIn, Hoovers or some other type of business data tool."
        },
      ]
    },
    "weight": 2,
    "numberOfCandidates": 863,
    "numberOfAcceptedCandidates": 551,
    "numberOfRejectedCandidates": 8
  },
];

export const FIVEQ_JOB_MOCK = {
  'id': 3575,
  'applicationType': 'DEFAULT',
  'salary': 20.00,
  'yearSalary': 40,
  'salaryType': 'WEEKLY',
  'salaryUnit': 'HOUR',
  'status': 'ACTIVE',
  'title': '\'Application Services Engineer\'',
  'type': 'GENERIC',
  'activationDate': '2018-04-25T10:50:28.000+0000',
  'workingHoursPerWeek': 40,
  "tests": [
    {
      "test": {
        "type": "HACKER_RANK",
        "id": 9,
        "name": "Software Engineer - PHP [12]",
        "status": "ACTIVE"
      },
      "weight": 1,
      "numberOfCandidates": 1528,
      "numberOfAcceptedCandidates": 896,
      "numberOfRejectedCandidates": 0
    },
    {
      "test": {
        "type": "FIVEQ",
        "id": 5113,
        "name": "VP of Outside Sales - Q1-2018",
        "status": "ACTIVE",
        "description": "Please answer the following question in order to complete your application.<br>",
        "questions": [
          {
            "id": 2140,
            "sequenceNumber": 1,
            "question": "<span id=\"docs-internal-guid-2c35221c-bbdc-9413-6990-ee19d697469e\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">ESW Capital is looking to hire the best Field Account Executives that have deep experience selling enterprise software. &nbsp;Please describe your last field role in enterprise software sales, ARR, deal timeline and your performance amongst your peers. &nbsp;If we call your previous sales management - will they endorse your sales capabilities as top 1% globally?</span></span>"
          },
          {
            "id": 2141,
            "sequenceNumber": 2,
            "question": "<span id=\"docs-internal-guid-2c35221c-bbdd-105e-4b67-6a4c0b85fa17\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">The best Field Account Executives are incredibly metrics focused and manage their time wisely. &nbsp;Please describe what productivity metrics you analyze to drive your own performance - and provide a sample breakdown of your sales process and how you spend your day/week.</span></span>"
          },
          {
            "id": 2142,
            "sequenceNumber": 3,
            "question": "<span id=\"docs-internal-guid-2c35221c-bbdd-7379-3b17-03bdc01eb117\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">A customer that you were recently introduced to is considering beginning an RFP process to replace the solution they’ve had for 8 years and that we acquired 2 years ago. What questions would you ask to better understand the situation? &nbsp;How could you turn this into an upsell opportunity? &nbsp;Please provide at least five examples of exploratory topics you would want to gather more data around, and how you would use that gathered information to craft a business storyline around the value that can be gained from your solution.</span></span>"
          },
          {
            "id": 2143,
            "sequenceNumber": 4,
            "question": "<span id=\"docs-internal-guid-2c35221c-bbdd-a3ee-7f56-cad0ed32ddbb\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">A new customer is pushing hard for a demo of the product. &nbsp;Where does the demo fall in the cadence of you selling the solution? &nbsp;What parts of the sales process need to be executed both before and after the demo in order to get the sale?</span></span>"
          },
          {
            "id": 2144,
            "sequenceNumber": 5,
            "question": "<span id=\"docs-internal-guid-2c35221c-bbde-0ed7-d3aa-bb3b216b16b7\">An important part of ESW Capital’s strategy is to convince the acquired company’s customers that they are in better hands now than previously. This vision must reassure customers and get them excited for the future of the acquired company’s product and service. &nbsp;In 2-3 minutes - record a video of your presentation as if you were meeting the CEO of a customer who relies heavily on the acquired company by ESW. &nbsp;Your goal is to paint the vision of the future and convince the customer to renew their contract.</span><div><span><span style=\"text-indent: 36pt;\"><br></span></span></div><div><span><span style=\"text-indent: 36pt;\">The presentation needs to be a slide deck.</span></span></div><div><br></div><div>To record your presentation, please use <a href=\"https://screencast-o-matic.com\">https://screencast-o-matic.com</a>&nbsp;(visit&nbsp;<a href=\"https://screencast-o-matic.com/download\" style=\"\">https://screencast-o-matic.com/download</a> to download the app).</div>"
          },
          {
            "id": 2145,
            "sequenceNumber": 6,
            "question": "<p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">CCAT Test</span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><span id=\"docs-internal-guid-a45f3465-4cf0-0a1b-e562-98f2a819257c\"><br></span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">Please use the below link to complete the CCAT Test which is also mandatory in order to be considered for the final interview stage. </span><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\"><span style=\"font-weight: bold;\">Make sure you use your same name/email used to apply for this position.</span> </span><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">We will automatically look up your CCAT scores using this email address so it is vital the email addresses match.</span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><br></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">Please note that the test lasts for 15 minutes and cannot be paused, so once you start it you will have to finish it. So make sure you are at a quiet environment where you can take it with no interruptions/distractions. Make sure you answer as many questions as possible even if you cannot complete them all.</span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><br></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><a href=\"http://www.ondemandassessment.com/verify/apply/eBDeDmS/DhnwEbnT\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; text-decoration-skip-ink: none; vertical-align: baseline;\">http://www.ondemandassessment.com/verify/apply/eBDeDmS/DhnwEbnT</span></a></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><br></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">Note: If you’ve already taken CCAT with Crossover using the same email address, there is no need to take CCAT again.&nbsp;</span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><br></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">Criteria Cognitive Aptitude Test</span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><br></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">The CCAT measures cognitive aptitude, or general intelligence. This test provides an indication of a subject’s ability to solve problems, digest and apply information, learn new skills, and think critically. Cognitive aptitude is one of the most accurate job predictors of job success for any position.</span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><br></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">In the space below, you may enter anything you like to submit the test.</span></p>"
          }
        ]
      },
      "weight": 1,
      "numberOfCandidates": 792,
      "numberOfAcceptedCandidates": 380,
      "numberOfRejectedCandidates": 0
    },
    {
      "test": {
        "type": "AM_ENDORSEMENT",
        "id": 2000,
        "name": "AM Endorsement",
        "status": "ACTIVE"
      },
      "weight": 0,
      "numberOfCandidates": 0,
      "numberOfAcceptedCandidates": 78,
      "numberOfRejectedCandidates": 43
    },
    {
      "test": {
        "type": "RESUME_RUBRIC",
        "id": 4568,
        "name": "Resume Rubric-1509651853087",
        "status": "ACTIVE",
        "resumeRubrics": [
          {
            "id": 4049,
            "resumeRubric": {
              "id": 2930,
              "name": "Software Sales",
              "description": "Has 5+ years of experience in selling software? Yes - 100, No - 1",
              "type": "CUSTOM",
              "values": []
            },
            "weight": 10
          }
        ]
      },
      "weight": 2,
      "numberOfCandidates": 2289,
      "numberOfAcceptedCandidates": 2289,
      "numberOfRejectedCandidates": 0
    },
    {
      "test": {
        "type": "RESUME_KEYWORD",
        "id": 4570,
        "name": "ResumeKeywordTest-1509654100358",
        "status": "ACTIVE",
        "weightedKeywords": [
          {
            "keyword": "enterprise",
            "weight": 50
          },
          {
            "keyword": "fortune",
            "weight": 100
          },
          {
            "keyword": "leader",
            "weight": 20
          },
          {
            "keyword": "sales",
            "weight": 100
          },
          {
            "keyword": "software",
            "weight": 20
          }
        ],
        "highThreshold": 150,
        "bizSchoolRubric": {
          "id": 3971,
          "resumeRubric": {
            "id": 966,
            "name": "Top B-Schools",
            "description": "Top B-Schools",
            "type": "PRE_DEFINED",
            "values": [
              "Harvard Business School",
              "Stanford University - Graduate School of Business",
              "Wharton School of the University of Pennsylvania",
              "University of Chicago - Booth School of Business",
              "MIT Sloan School of Management",
              "Kellogg School of Management",
              "Haas School of Business, University of California Berkeley",
              "Columbia Business School",
              "Dartmouth College - Tuck School of Business",
              "New York University – Stern School of Business",
              "University of Michigan – Ross School of Business",
              "University of Virginia – Darden School of Business",
              "Yale School of Management",
              "Duke University – Fuqua School of Business",
              "University of Texas – McCombs School of Business",
              "University of California Los Angeles (UCLA), Anderson School of Management",
              "Cornell University – Johnson Graduate School of Management",
              "Carnegie Mellon – Tepper School of Business",
              "University of North Carolina – Kenan-Flagler Business School",
              "Emory University – Goizueta Business School",
              "Indiana University - ​Kelley School of Business",
              "Washington University in St. Louis - Olin Business School",
              "Brigham Young University - Marriott School",
              "University of Maryland - Smith School of Business",
              "University of Iowa - Henry B. Tippie College of Business - University of Iowa",
              "INSEAD (Singapore)",
              "NUS Business School, National University of Singapore",
              "Indian Institute of Management Ahmedabad",
              "Indian Institute of Management Kolkata (or Calcutta)",
              "Indian Institute of Management Bangalore",
              "Indian Institute of Management Lucknow",
              "Indian School of Business, Hyderabad",
              "BiMBA: Beijing International MBA, Peking University",
              "Nanyang Business School, Singapore",
              "China Europe International Business School (CEIBS)",
              "Fudan University",
              "University of Hong Kong",
              "Graduate School of Business, Seoul National University",
              "HKUST Business School, Hong Kong",
              "Management Development Institute, Gurgaon",
              "Faculty of Management Studies (FMS), Delhi University",
              "SP Jain Institute of Management & Research",
              "XLRI Jamshedpur",
              "Fudan University Shanghai",
              "Asian Institute of Management, Manila",
              "London Business School",
              "Saïd Business School, Oxford University",
              "Judge Business School, University of Cambridge",
              "Imperial College Business School, Imperial College London",
              "Cranfield School of Management",
              "Warwick Business School, University of Warwick",
              "Manchester Business School, The University of Manchester",
              "INSEAD",
              "IMD, Lausanne (IMEDE)",
              "IESE Business School, University of Navarra, Spain",
              "Rotterdam School of Management"
            ]
          },
          "weight": 2
        },
        "techSchoolRubric": {
          "id": 3972,
          "resumeRubric": {
            "id": 967,
            "name": "Top Engineering Schools",
            "description": "Top Engineering Schools",
            "type": "PRE_DEFINED",
            "values": [
              "Massachusetts Institute of Technology",
              "Stanford University",
              "University of California, Berkeley",
              "California Institute of Technology",
              "Georgia Institute of Technology",
              "University of Illinois - Urbana-Champaign",
              "Carnegie Mellon University",
              "Cornell University",
              "University of Michigan - Ann Arbor",
              "Purdue University - West Lafayette",
              "University of Texas - Austin",
              "Princeton University",
              "Northwestern University",
              "University of Wisconsin - Madison",
              "Texas A&M University, College Station",
              "Virginia Tech",
              "Johns Hopkins University",
              "Rice University",
              "Columbia University",
              "Duke University",
              "Pennsylvania State University",
              "University of California, Los Angeles",
              "Harvard University",
              "University of Maryland College Park",
              "University of Minnesota Twin Cities",
              "Massachusetts Institute of Technology",
              "Stanford University",
              "ETH Zurich",
              "University of Cambridge",
              "University of California, Berkeley",
              "Imperial College London",
              "National University of Singapore",
              "California Institute of Technology (Caltech)",
              "Nanyang Technological University",
              "Ecole Polytechnique Federale de Lausanne (EPFL)",
              "Georgia Institute of Technology (Georgia Tech)"
            ]
          },
          "weight": 2
        },
        "experienceRubricWeight": 2,
        "normalizedHighThreshold": 50.67568
      },
      "weight": 1,
      "numberOfCandidates": 2251,
      "numberOfAcceptedCandidates": 2251,
      "numberOfRejectedCandidates": 0
    },
    {
      "test": {
        "type": "MANDATORY_ATTRIBUTES",
        "id": 4569,
        "name": "MandatoryAttributesTest-1509654100344",
        "status": "ACTIVE",
        "skills": [
          "sales",
          "enterprise",
          "software"
        ],
        "educations": [],
        "countries": []
      },
      "weight": 0,
      "numberOfCandidates": 2251,
      "numberOfAcceptedCandidates": 2251,
      "numberOfRejectedCandidates": 0
    },
    {
      "test": {
        "type": "AVERAGE_SCORE",
        "id": 3009,
        "name": "Average Score Test",
        "status": "ACTIVE"
      },
      "weight": 0,
      "numberOfCandidates": 0,
      "numberOfAcceptedCandidates": 886,
      "numberOfRejectedCandidates": 0
    },
    {
      "test": {
        "type": "TALENT_ADVOCATE",
        "id": 3299,
        "name": "Default Talent Advocate Test",
        "status": "ACTIVE"
      },
      "weight": 0,
      "numberOfCandidates": 78,
      "numberOfAcceptedCandidates": 78,
      "numberOfRejectedCandidates": 0
    }
  ],
};

export const NON_FIVEQ_JOB_MOCK = {
  'id': 3575,
  'applicationType': 'DEFAULT',
  'salary': 20.00,
  'yearSalary': 40,
  'salaryType': 'WEEKLY',
  'salaryUnit': 'HOUR',
  'status': 'ACTIVE',
  'title': '\'Application Services Engineer\'',
  'type': 'GENERIC',
  'activationDate': '2018-04-25T10:50:28.000+0000',
  'workingHoursPerWeek': 40,
  "tests": [
    {
      "test": {
        "type": "HACKER_RANK",
        "id": 9,
        "name": "Software Engineer - PHP [12]",
        "status": "ACTIVE"
      },
      "weight": 1,
      "numberOfCandidates": 1528,
      "numberOfAcceptedCandidates": 896,
      "numberOfRejectedCandidates": 0
    },
    {
      "test": {
        "type": "FIVEQQ",
        "id": 5113,
        "name": "VP of Outside Sales - Q1-2018",
        "status": "ACTIVE",
        "description": "Please answer the following question in order to complete your application.<br>",
        "questions": [
          {
            "id": 2140,
            "sequenceNumber": 1,
            "question": "<span id=\"docs-internal-guid-2c35221c-bbdc-9413-6990-ee19d697469e\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">ESW Capital is looking to hire the best Field Account Executives that have deep experience selling enterprise software. &nbsp;Please describe your last field role in enterprise software sales, ARR, deal timeline and your performance amongst your peers. &nbsp;If we call your previous sales management - will they endorse your sales capabilities as top 1% globally?</span></span>"
          },
          {
            "id": 2141,
            "sequenceNumber": 2,
            "question": "<span id=\"docs-internal-guid-2c35221c-bbdd-105e-4b67-6a4c0b85fa17\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">The best Field Account Executives are incredibly metrics focused and manage their time wisely. &nbsp;Please describe what productivity metrics you analyze to drive your own performance - and provide a sample breakdown of your sales process and how you spend your day/week.</span></span>"
          },
          {
            "id": 2142,
            "sequenceNumber": 3,
            "question": "<span id=\"docs-internal-guid-2c35221c-bbdd-7379-3b17-03bdc01eb117\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">A customer that you were recently introduced to is considering beginning an RFP process to replace the solution they’ve had for 8 years and that we acquired 2 years ago. What questions would you ask to better understand the situation? &nbsp;How could you turn this into an upsell opportunity? &nbsp;Please provide at least five examples of exploratory topics you would want to gather more data around, and how you would use that gathered information to craft a business storyline around the value that can be gained from your solution.</span></span>"
          },
          {
            "id": 2143,
            "sequenceNumber": 4,
            "question": "<span id=\"docs-internal-guid-2c35221c-bbdd-a3ee-7f56-cad0ed32ddbb\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">A new customer is pushing hard for a demo of the product. &nbsp;Where does the demo fall in the cadence of you selling the solution? &nbsp;What parts of the sales process need to be executed both before and after the demo in order to get the sale?</span></span>"
          },
          {
            "id": 2144,
            "sequenceNumber": 5,
            "question": "<span id=\"docs-internal-guid-2c35221c-bbde-0ed7-d3aa-bb3b216b16b7\">An important part of ESW Capital’s strategy is to convince the acquired company’s customers that they are in better hands now than previously. This vision must reassure customers and get them excited for the future of the acquired company’s product and service. &nbsp;In 2-3 minutes - record a video of your presentation as if you were meeting the CEO of a customer who relies heavily on the acquired company by ESW. &nbsp;Your goal is to paint the vision of the future and convince the customer to renew their contract.</span><div><span><span style=\"text-indent: 36pt;\"><br></span></span></div><div><span><span style=\"text-indent: 36pt;\">The presentation needs to be a slide deck.</span></span></div><div><br></div><div>To record your presentation, please use <a href=\"https://screencast-o-matic.com\">https://screencast-o-matic.com</a>&nbsp;(visit&nbsp;<a href=\"https://screencast-o-matic.com/download\" style=\"\">https://screencast-o-matic.com/download</a> to download the app).</div>"
          },
          {
            "id": 2145,
            "sequenceNumber": 6,
            "question": "<p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">CCAT Test</span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><span id=\"docs-internal-guid-a45f3465-4cf0-0a1b-e562-98f2a819257c\"><br></span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">Please use the below link to complete the CCAT Test which is also mandatory in order to be considered for the final interview stage. </span><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\"><span style=\"font-weight: bold;\">Make sure you use your same name/email used to apply for this position.</span> </span><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">We will automatically look up your CCAT scores using this email address so it is vital the email addresses match.</span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><br></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">Please note that the test lasts for 15 minutes and cannot be paused, so once you start it you will have to finish it. So make sure you are at a quiet environment where you can take it with no interruptions/distractions. Make sure you answer as many questions as possible even if you cannot complete them all.</span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><br></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><a href=\"http://www.ondemandassessment.com/verify/apply/eBDeDmS/DhnwEbnT\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; text-decoration-skip-ink: none; vertical-align: baseline;\">http://www.ondemandassessment.com/verify/apply/eBDeDmS/DhnwEbnT</span></a></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><br></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">Note: If you’ve already taken CCAT with Crossover using the same email address, there is no need to take CCAT again.&nbsp;</span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><br></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">Criteria Cognitive Aptitude Test</span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><br></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">The CCAT measures cognitive aptitude, or general intelligence. This test provides an indication of a subject’s ability to solve problems, digest and apply information, learn new skills, and think critically. Cognitive aptitude is one of the most accurate job predictors of job success for any position.</span></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.44;\"><br></p><p dir=\"ltr\" style=\"margin-top: 0pt; margin-bottom: 0pt; line-height: 1.38;\"><span style=\"font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline;\">In the space below, you may enter anything you like to submit the test.</span></p>"
          }
        ]
      },
      "weight": 1,
      "numberOfCandidates": 792,
      "numberOfAcceptedCandidates": 380,
      "numberOfRejectedCandidates": 0
    },
    {
      "test": {
        "type": "AM_ENDORSEMENT",
        "id": 2000,
        "name": "AM Endorsement",
        "status": "ACTIVE"
      },
      "weight": 0,
      "numberOfCandidates": 0,
      "numberOfAcceptedCandidates": 78,
      "numberOfRejectedCandidates": 43
    },
    {
      "test": {
        "type": "RESUME_RUBRIC",
        "id": 4568,
        "name": "Resume Rubric-1509651853087",
        "status": "ACTIVE",
        "resumeRubrics": [
          {
            "id": 4049,
            "resumeRubric": {
              "id": 2930,
              "name": "Software Sales",
              "description": "Has 5+ years of experience in selling software? Yes - 100, No - 1",
              "type": "CUSTOM",
              "values": []
            },
            "weight": 10
          }
        ]
      },
      "weight": 2,
      "numberOfCandidates": 2289,
      "numberOfAcceptedCandidates": 2289,
      "numberOfRejectedCandidates": 0
    },
    {
      "test": {
        "type": "RESUME_KEYWORD",
        "id": 4570,
        "name": "ResumeKeywordTest-1509654100358",
        "status": "ACTIVE",
        "weightedKeywords": [
          {
            "keyword": "enterprise",
            "weight": 50
          },
          {
            "keyword": "fortune",
            "weight": 100
          },
          {
            "keyword": "leader",
            "weight": 20
          },
          {
            "keyword": "sales",
            "weight": 100
          },
          {
            "keyword": "software",
            "weight": 20
          }
        ],
        "highThreshold": 150,
        "bizSchoolRubric": {
          "id": 3971,
          "resumeRubric": {
            "id": 966,
            "name": "Top B-Schools",
            "description": "Top B-Schools",
            "type": "PRE_DEFINED",
            "values": [
              "Harvard Business School",
              "Stanford University - Graduate School of Business",
              "Wharton School of the University of Pennsylvania",
              "University of Chicago - Booth School of Business",
              "MIT Sloan School of Management",
              "Kellogg School of Management",
              "Haas School of Business, University of California Berkeley",
              "Columbia Business School",
              "Dartmouth College - Tuck School of Business",
              "New York University – Stern School of Business",
              "University of Michigan – Ross School of Business",
              "University of Virginia – Darden School of Business",
              "Yale School of Management",
              "Duke University – Fuqua School of Business",
              "University of Texas – McCombs School of Business",
              "University of California Los Angeles (UCLA), Anderson School of Management",
              "Cornell University – Johnson Graduate School of Management",
              "Carnegie Mellon – Tepper School of Business",
              "University of North Carolina – Kenan-Flagler Business School",
              "Emory University – Goizueta Business School",
              "Indiana University - ​Kelley School of Business",
              "Washington University in St. Louis - Olin Business School",
              "Brigham Young University - Marriott School",
              "University of Maryland - Smith School of Business",
              "University of Iowa - Henry B. Tippie College of Business - University of Iowa",
              "INSEAD (Singapore)",
              "NUS Business School, National University of Singapore",
              "Indian Institute of Management Ahmedabad",
              "Indian Institute of Management Kolkata (or Calcutta)",
              "Indian Institute of Management Bangalore",
              "Indian Institute of Management Lucknow",
              "Indian School of Business, Hyderabad",
              "BiMBA: Beijing International MBA, Peking University",
              "Nanyang Business School, Singapore",
              "China Europe International Business School (CEIBS)",
              "Fudan University",
              "University of Hong Kong",
              "Graduate School of Business, Seoul National University",
              "HKUST Business School, Hong Kong",
              "Management Development Institute, Gurgaon",
              "Faculty of Management Studies (FMS), Delhi University",
              "SP Jain Institute of Management & Research",
              "XLRI Jamshedpur",
              "Fudan University Shanghai",
              "Asian Institute of Management, Manila",
              "London Business School",
              "Saïd Business School, Oxford University",
              "Judge Business School, University of Cambridge",
              "Imperial College Business School, Imperial College London",
              "Cranfield School of Management",
              "Warwick Business School, University of Warwick",
              "Manchester Business School, The University of Manchester",
              "INSEAD",
              "IMD, Lausanne (IMEDE)",
              "IESE Business School, University of Navarra, Spain",
              "Rotterdam School of Management"
            ]
          },
          "weight": 2
        },
        "techSchoolRubric": {
          "id": 3972,
          "resumeRubric": {
            "id": 967,
            "name": "Top Engineering Schools",
            "description": "Top Engineering Schools",
            "type": "PRE_DEFINED",
            "values": [
              "Massachusetts Institute of Technology",
              "Stanford University",
              "University of California, Berkeley",
              "California Institute of Technology",
              "Georgia Institute of Technology",
              "University of Illinois - Urbana-Champaign",
              "Carnegie Mellon University",
              "Cornell University",
              "University of Michigan - Ann Arbor",
              "Purdue University - West Lafayette",
              "University of Texas - Austin",
              "Princeton University",
              "Northwestern University",
              "University of Wisconsin - Madison",
              "Texas A&M University, College Station",
              "Virginia Tech",
              "Johns Hopkins University",
              "Rice University",
              "Columbia University",
              "Duke University",
              "Pennsylvania State University",
              "University of California, Los Angeles",
              "Harvard University",
              "University of Maryland College Park",
              "University of Minnesota Twin Cities",
              "Massachusetts Institute of Technology",
              "Stanford University",
              "ETH Zurich",
              "University of Cambridge",
              "University of California, Berkeley",
              "Imperial College London",
              "National University of Singapore",
              "California Institute of Technology (Caltech)",
              "Nanyang Technological University",
              "Ecole Polytechnique Federale de Lausanne (EPFL)",
              "Georgia Institute of Technology (Georgia Tech)"
            ]
          },
          "weight": 2
        },
        "experienceRubricWeight": 2,
        "normalizedHighThreshold": 50.67568
      },
      "weight": 1,
      "numberOfCandidates": 2251,
      "numberOfAcceptedCandidates": 2251,
      "numberOfRejectedCandidates": 0
    },
    {
      "test": {
        "type": "MANDATORY_ATTRIBUTES",
        "id": 4569,
        "name": "MandatoryAttributesTest-1509654100344",
        "status": "ACTIVE",
        "skills": [
          "sales",
          "enterprise",
          "software"
        ],
        "educations": [],
        "countries": []
      },
      "weight": 0,
      "numberOfCandidates": 2251,
      "numberOfAcceptedCandidates": 2251,
      "numberOfRejectedCandidates": 0
    },
    {
      "test": {
        "type": "AVERAGE_SCORE",
        "id": 3009,
        "name": "Average Score Test",
        "status": "ACTIVE"
      },
      "weight": 0,
      "numberOfCandidates": 0,
      "numberOfAcceptedCandidates": 886,
      "numberOfRejectedCandidates": 0
    },
    {
      "test": {
        "type": "TALENT_ADVOCATE",
        "id": 3299,
        "name": "Default Talent Advocate Test",
        "status": "ACTIVE"
      },
      "weight": 0,
      "numberOfCandidates": 78,
      "numberOfAcceptedCandidates": 78,
      "numberOfRejectedCandidates": 0
    }
  ],
};

export const FIVEQ_CANDIDATE_GRADING_MOCK = {
  "id": 1026357,
  "testsEvaluations": [
    {
      "id": 1030248,
      "type": "FIVEQ_ANSWER",
      "answers": [
        {
          "sequenceNumber": 1,
          "answer": "MASKED FIVEQ ANSWER",
          "score": 3
        },
        {
          "sequenceNumber": 2,
          "answer": "MASKED FIVEQ ANSWER",
          "score": 0
        },
        {
          "sequenceNumber": 3,
          "answer": "MASKED FIVEQ ANSWER",
          "score": 1
        },
        {
          "sequenceNumber": 4,
          "answer": "MASKED FIVEQ ANSWER",
          "score": 1
        },
        {
          "sequenceNumber": 5,
          "answer": "MASKED FIVEQ ANSWER",
          "score": 2
        },
        {
          "sequenceNumber": 6,
          "answer": "MASKED FIVEQ ANSWER",
          "score": 1
        }
      ]
    }
  ]
};
