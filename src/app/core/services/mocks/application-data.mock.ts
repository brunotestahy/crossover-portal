import { JobApplication } from 'app/core/models/application';

export const APPLICATION_DATA_MOCK: JobApplication = {
  'id': 1520494364,
  'createdOn': '2018-03-10T07:22:24.000+0000',
  'updatedOn': '2018-03-10T07:23:41.000+0000',
  'resumeFile': {
    'id': 1228566,
    'label': 'Resume',
    'name': 'monster-cv-template-chef.pdf',
    'internal': false,
    'resume': true,
    'notResume': false,
  },
  'candidate': {
    'type': 'CANDIDATE',
    'userAvatars': [
      {
        'id': 1426764,
        'type': 'CANDIDATE',
      },
    ],
    'id': 1426764,
    'averageRatings': 0.0,
    'workedHours': 0.0,
    'billedHours': 0.0,
    'connections': [],
    'agreementAccepted': false,
    'intercomId': '5a7b17203c5bce3797ed6df7',
    'userSecurity': {
      'linkedInLogin': false,
      'enabled': false,
      'accountNonExpired': true,
      'accountNonLocked': true,
      'credentialsNonExpired': true,
      'securityQuestion': 'Sample',
    },
    'candidate': true,
    'personal': false,
    'printableName': 'A W',
    'email': '32855-ut@awork.com',
    'photoUrl': '',
    'location': {
      'country': {
        'id': 7,
        'name': 'Angola',
        'code': 'ao',
        'allowed': true,
        'zipFormat': '',
      },
      'timeZone': {
        'id': 248,
        'name': 'Africa/Lagos',
        'offset': 3600000,
        'standardOffset': 3600000,
        'hourlyOffset': '+01:00',
      },
      'phone': '+44 000 000 000',
    },
    'manager': false,
    'companyAdmin': false,
    'firstName': 'A',
    'lastName': 'W',
    'userId': 770500,
    'skypeId': 'blablaCar',
    'avatarTypes': [
      'CANDIDATE',
      'PERSONAL',
    ],
    'busySlots': [],
    'appFeatures': [],
  },
  'job': {
    'id': 2685,
    'title': '.NET Chief Software Architect (Telecom)',
    'trackerRequired': false,
    'applicationFlow': {
      'id': 8,
      'name': 'Moodle and TT',
      'flowDefinitionType': 'HACKERRANK_ASSIGNMENT',
    },
    'jbpEnabled': false,
    'outboundEnabled': false,
    'activationDate': '2017-06-23T23:14:37.000+0000',
    'workingHoursPerWeek': 40,
    'label': {
      'id': 11,
      'name': 'C# (.NET)',
    },
    'autoEndorse': false,
    'testSetupCompleted': false,
    'flowType': 'HACKERRANK_ASSIGNMENT',
    'imageUrl': '',
    'recruiter': {
      'type': 'CANDIDATE',
      'userAvatars': [
        {
          'id': 1426764,
          'type': 'CANDIDATE',
        },
      ],
      'id': 1426764,
      'averageRatings': 0.0,
      'workedHours': 0.0,
      'billedHours': 0.0,
      'connections': [],
      'agreementAccepted': false,
      'intercomId': '5a7b17203c5bce3797ed6df7',
      'userSecurity': {
        'linkedInLogin': false,
        'enabled': false,
        'accountNonExpired': true,
        'accountNonLocked': true,
        'credentialsNonExpired': true,
        'securityQuestion': 'Sample',
      },
      'candidate': true,
      'personal': false,
      'printableName': 'A W',
      'email': '32855-ut@awork.com',
      'photoUrl': '',
      'location': {
        'country': {
          'id': 7,
          'name': 'Angola',
          'code': 'ao',
          'allowed': true,
          'zipFormat': '',
        },
        'timeZone': {
          'id': 248,
          'name': 'Africa/Lagos',
          'offset': 3600000,
          'standardOffset': 3600000,
          'hourlyOffset': '+01:00',
        },
        'phone': '+44 000 000 000',
      },
      'manager': false,
      'companyAdmin': false,
      'firstName': 'A',
      'lastName': 'W',
      'userId': 770500,
      'skypeId': 'blablaCar',
      'avatarTypes': [
        'CANDIDATE',
        'PERSONAL',
      ],
      'busySlots': [],
      'appFeatures': [],
    },
  },
  'status': 'IN_PROGRESS',
  'applicationType': 'NATIVE',
  'testScores': [
    {
      'test': {
        'type': 'MANDATORY_ATTRIBUTES',
        'id': 3712,
      },
      'score': 0.0,
      'maxScore': 1,
      'result': 'ACCEPTED',
      'percentage': 0,
      'invertedPercentile': 0,
    },
    {
      'test': {
        'type': 'RESUME_KEYWORD',
        'id': 3714,
      },
      'score': 1.0,
      'maxScore': 100,
      'result': 'ACCEPTED',
      'percentage': 1,
      'invertedPercentile': 0,
    },
    {
      'test': {
        'type': 'RESUME_RUBRIC',
        'id': 3713,
      },
      'score': 0.0,
      'maxScore': 100,
      'result': 'ACCEPTED',
      'percentage': 0,
      'invertedPercentile': 0,
    },
  ],
  'testInstances': [
    {
      'id': 0,
      'test': {
        'type': 'MANDATORY_ATTRIBUTES',
        'id': 3712,
      },
      'username': '',
      'password': '',
      'url': '',
    },
    {
      'id': 0,
      'test': {
        'type': 'RESUME_KEYWORD',
        'id': 3714,
      },
      'username': '',
      'password': '',
      'url': '',
    },
    {
      'id': 0,
      'test': {
        'type': 'RESUME_RUBRIC',
        'id': 3713,
      },
      'username': '',
      'password': '',
      'url': '',
    },
  ],
  'score': 0.0,
  'yearsOfExperience': 0,
  'applicationFlow': {
    'id': 8,
    'name': 'Moodle and TT',
    'flowDefinitionType': 'HACKERRANK_ASSIGNMENT',
  },
  'task': 'candidateProvidesContactInformation1',
  'variants': [],
};

export const GRADING_DATA = [
  {
    "id": 1026357,
    "createdOn": "2018-06-23T05:40:09.000+0000",
    "updatedOn": "2018-06-23T07:39:37.000+0000",
    "resumeFile": {
      "id": 1367699,
      "label": "Resume",
      "name": "Satyajit Samantasinghar_Resume_Latest.pdf.pdf",
      "internal": false,
      "resume": true,
      "notResume": false
    },
    "candidate": {
      "type": "CANDIDATE",
      "id": 1637611,
      "averageRatings": 0,
      "workedHours": 0,
      "billedHours": 0,
      "languages": [],
      "certifications": [],
      "educations": [],
      "employments": [],
      "connections": [],
      "skills": [],
      "skypeId": "satyajit469",
      "agreementAccepted": false,
      "availability": "IMMEDIATELY",
      "intercomId": "5b2ddd75c7574f2d90af0b71",
      "printableName": "Satyajit Samantasinghar",
      "userSecurity": {
        "linkedInLogin": false,
        "enabled": true,
        "accountNonExpired": true,
        "accountNonLocked": true,
        "credentialsNonExpired": true
      },
      "email": "satyajitsamantasinghar@gmail.com",
      "personal": false,
      "candidate": true,
      "location": {
        "country": {
          "id": 101,
          "name": "India",
          "code": "in",
          "allowed": true,
          "zipFormat": "\\d{6}"
        },
        "timeZone": {
          "id": 419,
          "name": "Asia/Kolkata",
          "standardOffset": 19800000,
          "hourlyOffset": "+05:30",
          "offset": 19800000
        }
      },
      "avatarTypes": [
        "CANDIDATE",
        "PERSONAL"
      ],
      "userId": 825114,
      "firstName": "Satyajit",
      "lastName": "Samantasinghar",
      "photoUrl": "https://crossover-uploads-production.s3.amazonaws.com/images/8b39f142dd4c3994d1360fe9c175d884.jpg",
      "busySlots": [],
      "userAvatars": [
        {
          "id": 1637612,
          "type": "PERSONAL"
        },
        {
          "id": 1637611,
          "type": "CANDIDATE"
        }
      ],
      "summary": "MASKED Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu risus vitae lectus euismod sagittis vitae ut arcu. Suspendisse tempus sollicitudin lorem. Maecenas vitae orci eu tortor hendrerit vehicula ac at leo. Sed a enim ac orci ultricies suscipit. Vestibulum porttitor justo lobortis orci vehicula consectetur. Donec sit amet dolor blandit, facilisis tellus in, pellentesque augue. Pellentesque tempus, dolor a consequat gravida, lorem odio sollicitudin dolor, eu fringilla diam mi at libero. Fusce accumsan eu libero nec porttitor. Mauris sit amet mi risus. Nullam interdum dapibus laoreet.",
      "appFeatures": [],
      "manager": false,
      "companyAdmin": false
    },
    "job": {
      "id": 3137,
      "imageUrl": "crossover-uploads-production/images/job_3137_image_607aeacb536d4cfed12bdd8a49f42238.png",
      "title": "Account Executive",
      "salary": 100,
      "salaryType": "WEEKLY",
      "salaryUnit": "HOUR",
      "trackerRequired": false,
      "status": "ACTIVE",
      "applicationType": "NATIVE",
      "tests": [
        {
          "test": {
            "type": "HACKER_RANK",
            "id": 9,
            "name": "Software Engineer - PHP [12]",
            "status": "ACTIVE"
          },
          "weight": 1,
          "numberOfCandidates": 0,
          "numberOfAcceptedCandidates": 0,
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
          "numberOfCandidates": 0,
          "numberOfAcceptedCandidates": 0,
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
          "numberOfAcceptedCandidates": 0,
          "numberOfRejectedCandidates": 0
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
          "numberOfCandidates": 0,
          "numberOfAcceptedCandidates": 0,
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
          "numberOfCandidates": 0,
          "numberOfAcceptedCandidates": 0,
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
          "numberOfCandidates": 0,
          "numberOfAcceptedCandidates": 0,
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
          "numberOfAcceptedCandidates": 0,
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
          "numberOfCandidates": 0,
          "numberOfAcceptedCandidates": 0,
          "numberOfRejectedCandidates": 0
        }
      ],
      "type": "GENERIC",
      "preMarketplaceQuestionnaire": {
        "id": 0
      },
      "recruiter": {
        "type": "RECRUITER",
        "id": 33731,
        "printableName": "Valeria Cavaliere",
        "avatarTypes": [
          "CANDIDATE",
          "MANAGER",
          "COMPANY_ADMIN",
          "ADMIN",
          "RECRUITER",
          "ACCOUNT_MANAGER",
          "RECRUITMENT_ANALYST",
          "ENFORCER",
          "JOB_BOARD_POSTER",
          "OUTBOUND_RECRUITER",
          "PERSONAL"
        ],
        "userId": 1158,
        "firstName": "Valeria",
        "lastName": "Cavaliere",
        "email": "valeria.cavaliere@crossover.com",
        "userSecurity": {
          "linkedInLogin": false,
          "enabled": true,
          "accountNonExpired": true,
          "accountNonLocked": true,
          "credentialsNonExpired": true
        },
        "photoUrl": "https://crossover-uploads-production.s3.amazonaws.com/images/dcc979f54293b164d8e97c03f4be757d.jpg",
        "busySlots": [],
        "userAvatars": [
          {
            "id": 72238,
            "type": "ADMIN"
          },
          {
            "id": 1442251,
            "type": "JOB_BOARD_POSTER"
          },
          {
            "id": 922372,
            "type": "PERSONAL"
          },
          {
            "id": 296,
            "type": "COMPANY_ADMIN"
          },
          {
            "id": 1442249,
            "type": "RECRUITMENT_ANALYST"
          },
          {
            "id": 330341,
            "type": "ACCOUNT_MANAGER"
          },
          {
            "id": 33731,
            "type": "RECRUITER"
          },
          {
            "id": 1442252,
            "type": "OUTBOUND_RECRUITER"
          },
          {
            "id": 1158,
            "type": "CANDIDATE"
          },
          {
            "id": 1442250,
            "type": "ENFORCER"
          },
          {
            "id": 296,
            "type": "MANAGER"
          }
        ],
        "headline": "Team Lead at Crossover",
        "summary": "MASKED Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu risus vitae lectus euismod sagittis vitae ut arcu. Suspendisse tempus sollicitudin lorem. Maecenas vitae orci eu tortor hendrerit vehicula ac at leo. Sed a enim ac orci ultricies suscipit. Vestibulum porttitor justo lobortis orci vehicula consectetur. Donec sit amet dolor blandit, facilisis tellus in, pellentesque augue. Pellentesque tempus, dolor a consequat gravida, lorem odio sollicitudin dolor, eu fringilla diam mi at libero. Fusce accumsan eu libero nec porttitor. Mauris sit amet mi risus. Nullam interdum dapibus laoreet.",
        "appFeatures": [
          {
            "appFeature": "TEAM_DASHBOARD"
          },
          {
            "appFeature": "POLLS"
          }
        ],
        "personal": false,
        "manager": false,
        "companyAdmin": false,
        "candidate": false,
        "location": {
          "country": {
            "id": 108,
            "name": "Italy",
            "code": "it",
            "allowed": true,
            "zipFormat": "\\d{5}"
          },
          "timeZone": {
            "id": 402,
            "name": "Europe/Rome",
            "standardOffset": 3600000,
            "hourlyOffset": "+02:00",
            "offset": 7200000
          },
          "city": "San Fili",
          "latitude": 39.340149,
          "longitude": 16.145987
        }
      },
      "accountManager": {
        "type": "ACCOUNT_MANAGER",
        "id": 624063,
        "demand": 0,
        "printableName": "Claudiu Stiube",
        "avatarTypes": [
          "CANDIDATE",
          "MANAGER",
          "ACCOUNT_MANAGER",
          "PERSONAL"
        ],
        "userId": 582494,
        "firstName": "Claudiu",
        "lastName": "Stiube",
        "email": "claudiu.stiube@crossover.com",
        "userSecurity": {
          "linkedInLogin": false,
          "enabled": true,
          "accountNonExpired": true,
          "accountNonLocked": true,
          "credentialsNonExpired": true
        },
        "photoUrl": "https://crossover-uploads-production.s3.amazonaws.com/images/18f9766d1eff05e8244f8ec529e2d2be.jpeg",
        "busySlots": [],
        "userAvatars": [
          {
            "id": 624063,
            "type": "ACCOUNT_MANAGER"
          },
          {
            "id": 650129,
            "type": "ADMIN"
          },
          {
            "id": 650131,
            "type": "ENFORCER"
          },
          {
            "id": 582058,
            "type": "CANDIDATE"
          },
          {
            "id": 1036374,
            "type": "PERSONAL"
          },
          {
            "id": 650130,
            "type": "RECRUITMENT_ANALYST"
          },
          {
            "id": 627125,
            "type": "MANAGER"
          }
        ],
        "headline": "Account Manager",
        "summary": "MASKED Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu risus vitae lectus euismod sagittis vitae ut arcu. Suspendisse tempus sollicitudin lorem. Maecenas vitae orci eu tortor hendrerit vehicula ac at leo. Sed a enim ac orci ultricies suscipit. Vestibulum porttitor justo lobortis orci vehicula consectetur. Donec sit amet dolor blandit, facilisis tellus in, pellentesque augue. Pellentesque tempus, dolor a consequat gravida, lorem odio sollicitudin dolor, eu fringilla diam mi at libero. Fusce accumsan eu libero nec porttitor. Mauris sit amet mi risus. Nullam interdum dapibus laoreet.",
        "appFeatures": [],
        "personal": false,
        "manager": false,
        "companyAdmin": false,
        "candidate": false,
        "location": {
          "country": {
            "id": 179,
            "name": "Romania",
            "code": "ro",
            "allowed": true,
            "zipFormat": "\\d{6}"
          },
          "timeZone": {
            "id": 144,
            "name": "Europe/Bucharest",
            "standardOffset": 7200000,
            "hourlyOffset": "+03:00",
            "offset": 10800000
          },
          "city": "Oradea",
          "latitude": 47.046501,
          "longitude": 21.918944
        }
      },
      "applicationFlow": {
        "id": 6,
        "name": "Moodle and 5Q",
        "flowDefinitionType": "HACKERRANK_FIVEQ"
      },
      "demand": 3,
      "visibleManagers": [],
      "calibration": {
        "id": 0,
        "descriptionApprovedOn": "2017-11-07T22:00:00.000+0000",
        "testApprovedOn": "2017-11-07T22:00:00.000+0000",
        "testApprovalStatus": "APPROVED",
        "descriptionApprovalRequestedBy": {
          "type": "ACCOUNT_MANAGER",
          "id": 624063,
          "demand": 0,
          "printableName": "Claudiu Stiube",
          "avatarTypes": [
            "CANDIDATE",
            "MANAGER",
            "ACCOUNT_MANAGER",
            "PERSONAL"
          ],
          "userId": 582494,
          "firstName": "Claudiu",
          "lastName": "Stiube",
          "email": "claudiu.stiube@crossover.com",
          "userSecurity": {
            "linkedInLogin": false,
            "enabled": true,
            "accountNonExpired": true,
            "accountNonLocked": true,
            "credentialsNonExpired": true
          },
          "photoUrl": "https://crossover-uploads-production.s3.amazonaws.com/images/18f9766d1eff05e8244f8ec529e2d2be.jpeg",
          "busySlots": [],
          "userAvatars": [
            {
              "id": 624063,
              "type": "ACCOUNT_MANAGER"
            },
            {
              "id": 650129,
              "type": "ADMIN"
            },
            {
              "id": 650131,
              "type": "ENFORCER"
            },
            {
              "id": 582058,
              "type": "CANDIDATE"
            },
            {
              "id": 1036374,
              "type": "PERSONAL"
            },
            {
              "id": 650130,
              "type": "RECRUITMENT_ANALYST"
            },
            {
              "id": 627125,
              "type": "MANAGER"
            }
          ],
          "headline": "Account Manager",
          "summary": "MASKED Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu risus vitae lectus euismod sagittis vitae ut arcu. Suspendisse tempus sollicitudin lorem. Maecenas vitae orci eu tortor hendrerit vehicula ac at leo. Sed a enim ac orci ultricies suscipit. Vestibulum porttitor justo lobortis orci vehicula consectetur. Donec sit amet dolor blandit, facilisis tellus in, pellentesque augue. Pellentesque tempus, dolor a consequat gravida, lorem odio sollicitudin dolor, eu fringilla diam mi at libero. Fusce accumsan eu libero nec porttitor. Mauris sit amet mi risus. Nullam interdum dapibus laoreet.",
          "appFeatures": [],
          "personal": false,
          "manager": false,
          "companyAdmin": false,
          "candidate": false,
          "location": {
            "country": {
              "id": 179,
              "name": "Romania",
              "code": "ro",
              "allowed": true,
              "zipFormat": "\\d{6}"
            },
            "timeZone": {
              "id": 144,
              "name": "Europe/Bucharest",
              "standardOffset": 7200000,
              "hourlyOffset": "+03:00",
              "offset": 10800000
            },
            "city": "Oradea",
            "latitude": 47.046501,
            "longitude": 21.918944
          }
        },
        "testApprovalRequestedBy": {
          "type": "ACCOUNT_MANAGER",
          "id": 624063,
          "demand": 0,
          "printableName": "Claudiu Stiube",
          "avatarTypes": [
            "CANDIDATE",
            "MANAGER",
            "ACCOUNT_MANAGER",
            "PERSONAL"
          ],
          "userId": 582494,
          "firstName": "Claudiu",
          "lastName": "Stiube",
          "email": "claudiu.stiube@crossover.com",
          "userSecurity": {
            "linkedInLogin": false,
            "enabled": true,
            "accountNonExpired": true,
            "accountNonLocked": true,
            "credentialsNonExpired": true
          },
          "photoUrl": "https://crossover-uploads-production.s3.amazonaws.com/images/18f9766d1eff05e8244f8ec529e2d2be.jpeg",
          "busySlots": [],
          "userAvatars": [
            {
              "id": 624063,
              "type": "ACCOUNT_MANAGER"
            },
            {
              "id": 650129,
              "type": "ADMIN"
            },
            {
              "id": 650131,
              "type": "ENFORCER"
            },
            {
              "id": 582058,
              "type": "CANDIDATE"
            },
            {
              "id": 1036374,
              "type": "PERSONAL"
            },
            {
              "id": 650130,
              "type": "RECRUITMENT_ANALYST"
            },
            {
              "id": 627125,
              "type": "MANAGER"
            }
          ],
          "headline": "Account Manager",
          "summary": "MASKED Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu risus vitae lectus euismod sagittis vitae ut arcu. Suspendisse tempus sollicitudin lorem. Maecenas vitae orci eu tortor hendrerit vehicula ac at leo. Sed a enim ac orci ultricies suscipit. Vestibulum porttitor justo lobortis orci vehicula consectetur. Donec sit amet dolor blandit, facilisis tellus in, pellentesque augue. Pellentesque tempus, dolor a consequat gravida, lorem odio sollicitudin dolor, eu fringilla diam mi at libero. Fusce accumsan eu libero nec porttitor. Mauris sit amet mi risus. Nullam interdum dapibus laoreet.",
          "appFeatures": [],
          "personal": false,
          "manager": false,
          "companyAdmin": false,
          "candidate": false,
          "location": {
            "country": {
              "id": 179,
              "name": "Romania",
              "code": "ro",
              "allowed": true,
              "zipFormat": "\\d{6}"
            },
            "timeZone": {
              "id": 144,
              "name": "Europe/Bucharest",
              "standardOffset": 7200000,
              "hourlyOffset": "+03:00",
              "offset": 10800000
            },
            "city": "Oradea",
            "latitude": 47.046501,
            "longitude": 21.918944
          }
        }
      },
      "sourcingInstructions": "",
      "jbpInstructions": "",
      "outboundInstructions": "",
      "jbpEnabled": false,
      "outboundEnabled": false,
      "activationDate": "2018-02-22T05:28:45.000+0000",
      "workingHoursPerWeek": 40,
      "label": {
        "id": 2,
        "name": "Sales"
      },
      "autoEndorse": false,
      "flowType": "HACKERRANK_FIVEQ",
      "yearSalary": 200,
      "testSetupCompleted": true,
      "finalTest": {
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
      }
    },
    "status": "IN_PROGRESS",
    "campaign": "AvailableJobs",
    "applicationType": "NATIVE",
    "files": [
      {
        "id": 1367699,
        "label": "Resume",
        "name": "Satyajit Samantasinghar_Resume_Latest.pdf.pdf",
        "internal": false,
        "resume": true,
        "notResume": false
      },
      {
        "id": 1367742,
        "label": "5Qs",
        "name": "fiveq_10263572784752500717724340.html.pdf",
        "internal": true,
        "resume": false,
        "notResume": true
      }
    ],
    "testScores": [
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
        "score": 0,
        "maxScore": 1,
        "result": "ACCEPTED",
        "percentage": 0,
        "invertedPercentile": 0
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
        "score": 10,
        "maxScore": 100,
        "result": "ACCEPTED",
        "percentage": 10,
        "invertedPercentile": 0
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
        "score": 0,
        "maxScore": 100,
        "result": "ACCEPTED",
        "percentage": 0,
        "invertedPercentile": 0
      },
      {
        "test": {
          "type": "HACKER_RANK",
          "id": 9,
          "name": "Software Engineer - PHP [12]",
          "status": "ACTIVE"
        },
        "score": 80,
        "maxScore": 300,
        "result": "ACCEPTED",
        "percentile": 93.45982142857143,
        "percentage": 27,
        "invertedPercentile": 7
      },
      {
        "test": {
          "type": "AVERAGE_SCORE",
          "id": 3009,
          "name": "Average Score Test",
          "status": "ACTIVE"
        },
        "score": 27,
        "maxScore": 100,
        "result": "ACCEPTED",
        "percentile": 92.24604966139955,
        "percentage": 27,
        "invertedPercentile": 8
      }
    ],
    "testsEvaluations": [
      {
        "type": "RESUME_RUBRIC_EVALUATION",
        "id": 1030238,
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
        "resumeRubricScores": []
      },
      {
        "type": "FIVEQ_ANSWER",
        "id": 1030248,
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
        "answers": [
          {
            "sequenceNumber": 1,
            "answer": "MASKED FIVEQ ANSWER",
            "score": 3
          },
          {
            "sequenceNumber": 2,
            "answer": "MASKED FIVEQ ANSWER"
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
    ],
    "testInstances": [
      {
        "id": 0,
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
        }
      },
      {
        "id": 0,
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
        }
      },
      {
        "id": 0,
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
        }
      },
      {
        "id": 0,
        "test": {
          "type": "HACKER_RANK",
          "id": 9,
          "name": "Software Engineer - PHP [12]",
          "status": "ACTIVE"
        },
        "username": "3vt3a5zbmrghdv",
        "password": "x6gy4zXj86",
        "url": "https://techscreen.crossover.com/course/view.php?id=1024"
      },
      {
        "id": 0,
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
        }
      }
    ],
    "score": 9,
    "yearsOfExperience": 10,
    "highestEducationLevel": "BACHELORS",
    "applicationFlow": {
      "id": 6,
      "name": "Moodle and 5Q",
      "flowDefinitionType": "HACKERRANK_FIVEQ"
    },
    "task": "recruitmentAnalystGrades5QTest",
    "taskCreationTime": "2018-06-23T07:39:37.000+0000",
    "termsAccepted": false,
    "variants": []
  },
  {
    "id": 1026357,
    "createdOn": "2018-06-23T05:40:09.000+0000",
    "updatedOn": "2018-06-23T07:39:37.000+0000",
    "resumeFile": {
      "id": 1367699,
      "label": "Resume",
      "name": "Satyajit Samantasinghar_Resume_Latest.pdf.pdf",
      "internal": false,
      "resume": true,
      "notResume": false
    },
    "candidate": {
      "type": "CANDIDATE",
      "id": 1637611,
      "averageRatings": 0,
      "workedHours": 0,
      "billedHours": 0,
      "languages": [],
      "certifications": [],
      "educations": [],
      "employments": [],
      "connections": [],
      "skills": [],
      "skypeId": "satyajit469",
      "agreementAccepted": false,
      "availability": "IMMEDIATELY",
      "intercomId": "5b2ddd75c7574f2d90af0b71",
      "printableName": "Satyajit Samantasinghar",
      "userSecurity": {
        "linkedInLogin": false,
        "enabled": true,
        "accountNonExpired": true,
        "accountNonLocked": true,
        "credentialsNonExpired": true
      },
      "email": "satyajitsamantasinghar@gmail.com",
      "personal": false,
      "candidate": true,
      "location": {
        "country": {
          "id": 101,
          "name": "India",
          "code": "in",
          "allowed": true,
          "zipFormat": "\\d{6}"
        },
        "timeZone": {
          "id": 419,
          "name": "Asia/Kolkata",
          "standardOffset": 19800000,
          "hourlyOffset": "+05:30",
          "offset": 19800000
        }
      },
      "avatarTypes": [
        "CANDIDATE",
        "PERSONAL"
      ],
      "userId": 825114,
      "firstName": "Satyajit",
      "lastName": "Samantasinghar",
      "photoUrl": "https://crossover-uploads-production.s3.amazonaws.com/images/8b39f142dd4c3994d1360fe9c175d884.jpg",
      "busySlots": [],
      "userAvatars": [
        {
          "id": 1637612,
          "type": "PERSONAL"
        },
        {
          "id": 1637611,
          "type": "CANDIDATE"
        }
      ],
      "summary": "MASKED Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu risus vitae lectus euismod sagittis vitae ut arcu. Suspendisse tempus sollicitudin lorem. Maecenas vitae orci eu tortor hendrerit vehicula ac at leo. Sed a enim ac orci ultricies suscipit. Vestibulum porttitor justo lobortis orci vehicula consectetur. Donec sit amet dolor blandit, facilisis tellus in, pellentesque augue. Pellentesque tempus, dolor a consequat gravida, lorem odio sollicitudin dolor, eu fringilla diam mi at libero. Fusce accumsan eu libero nec porttitor. Mauris sit amet mi risus. Nullam interdum dapibus laoreet.",
      "appFeatures": [],
      "manager": false,
      "companyAdmin": false
    },
    "job": {
      "id": 3137,
      "imageUrl": "crossover-uploads-production/images/job_3137_image_607aeacb536d4cfed12bdd8a49f42238.png",
      "title": "Account Executive",
      "salary": 100,
      "salaryType": "WEEKLY",
      "salaryUnit": "HOUR",
      "trackerRequired": false,
      "status": "ACTIVE",
      "applicationType": "NATIVE",
      "tests": [
        {
          "test": {
            "type": "HACKER_RANK",
            "id": 9,
            "name": "Software Engineer - PHP [12]",
            "status": "ACTIVE"
          },
          "weight": 1,
          "numberOfCandidates": 0,
          "numberOfAcceptedCandidates": 0,
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
          "numberOfCandidates": 0,
          "numberOfAcceptedCandidates": 0,
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
          "numberOfAcceptedCandidates": 0,
          "numberOfRejectedCandidates": 0
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
          "numberOfCandidates": 0,
          "numberOfAcceptedCandidates": 0,
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
          "numberOfCandidates": 0,
          "numberOfAcceptedCandidates": 0,
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
          "numberOfCandidates": 0,
          "numberOfAcceptedCandidates": 0,
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
          "numberOfAcceptedCandidates": 0,
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
          "numberOfCandidates": 0,
          "numberOfAcceptedCandidates": 0,
          "numberOfRejectedCandidates": 0
        }
      ],
      "type": "GENERIC",
      "preMarketplaceQuestionnaire": {
        "id": 0
      },
      "recruiter": {
        "type": "RECRUITER",
        "id": 33731,
        "printableName": "Valeria Cavaliere",
        "avatarTypes": [
          "CANDIDATE",
          "MANAGER",
          "COMPANY_ADMIN",
          "ADMIN",
          "RECRUITER",
          "ACCOUNT_MANAGER",
          "RECRUITMENT_ANALYST",
          "ENFORCER",
          "JOB_BOARD_POSTER",
          "OUTBOUND_RECRUITER",
          "PERSONAL"
        ],
        "userId": 1158,
        "firstName": "Valeria",
        "lastName": "Cavaliere",
        "email": "valeria.cavaliere@crossover.com",
        "userSecurity": {
          "linkedInLogin": false,
          "enabled": true,
          "accountNonExpired": true,
          "accountNonLocked": true,
          "credentialsNonExpired": true
        },
        "photoUrl": "https://crossover-uploads-production.s3.amazonaws.com/images/dcc979f54293b164d8e97c03f4be757d.jpg",
        "busySlots": [],
        "userAvatars": [
          {
            "id": 72238,
            "type": "ADMIN"
          },
          {
            "id": 1442251,
            "type": "JOB_BOARD_POSTER"
          },
          {
            "id": 922372,
            "type": "PERSONAL"
          },
          {
            "id": 296,
            "type": "COMPANY_ADMIN"
          },
          {
            "id": 1442249,
            "type": "RECRUITMENT_ANALYST"
          },
          {
            "id": 330341,
            "type": "ACCOUNT_MANAGER"
          },
          {
            "id": 33731,
            "type": "RECRUITER"
          },
          {
            "id": 1442252,
            "type": "OUTBOUND_RECRUITER"
          },
          {
            "id": 1158,
            "type": "CANDIDATE"
          },
          {
            "id": 1442250,
            "type": "ENFORCER"
          },
          {
            "id": 296,
            "type": "MANAGER"
          }
        ],
        "headline": "Team Lead at Crossover",
        "summary": "MASKED Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu risus vitae lectus euismod sagittis vitae ut arcu. Suspendisse tempus sollicitudin lorem. Maecenas vitae orci eu tortor hendrerit vehicula ac at leo. Sed a enim ac orci ultricies suscipit. Vestibulum porttitor justo lobortis orci vehicula consectetur. Donec sit amet dolor blandit, facilisis tellus in, pellentesque augue. Pellentesque tempus, dolor a consequat gravida, lorem odio sollicitudin dolor, eu fringilla diam mi at libero. Fusce accumsan eu libero nec porttitor. Mauris sit amet mi risus. Nullam interdum dapibus laoreet.",
        "appFeatures": [
          {
            "appFeature": "TEAM_DASHBOARD"
          },
          {
            "appFeature": "POLLS"
          }
        ],
        "personal": false,
        "manager": false,
        "companyAdmin": false,
        "candidate": false,
        "location": {
          "country": {
            "id": 108,
            "name": "Italy",
            "code": "it",
            "allowed": true,
            "zipFormat": "\\d{5}"
          },
          "timeZone": {
            "id": 402,
            "name": "Europe/Rome",
            "standardOffset": 3600000,
            "hourlyOffset": "+02:00",
            "offset": 7200000
          },
          "city": "San Fili",
          "latitude": 39.340149,
          "longitude": 16.145987
        }
      },
      "accountManager": {
        "type": "ACCOUNT_MANAGER",
        "id": 624063,
        "demand": 0,
        "printableName": "Claudiu Stiube",
        "avatarTypes": [
          "CANDIDATE",
          "MANAGER",
          "ACCOUNT_MANAGER",
          "PERSONAL"
        ],
        "userId": 582494,
        "firstName": "Claudiu",
        "lastName": "Stiube",
        "email": "claudiu.stiube@crossover.com",
        "userSecurity": {
          "linkedInLogin": false,
          "enabled": true,
          "accountNonExpired": true,
          "accountNonLocked": true,
          "credentialsNonExpired": true
        },
        "photoUrl": "https://crossover-uploads-production.s3.amazonaws.com/images/18f9766d1eff05e8244f8ec529e2d2be.jpeg",
        "busySlots": [],
        "userAvatars": [
          {
            "id": 624063,
            "type": "ACCOUNT_MANAGER"
          },
          {
            "id": 650129,
            "type": "ADMIN"
          },
          {
            "id": 650131,
            "type": "ENFORCER"
          },
          {
            "id": 582058,
            "type": "CANDIDATE"
          },
          {
            "id": 1036374,
            "type": "PERSONAL"
          },
          {
            "id": 650130,
            "type": "RECRUITMENT_ANALYST"
          },
          {
            "id": 627125,
            "type": "MANAGER"
          }
        ],
        "headline": "Account Manager",
        "summary": "MASKED Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu risus vitae lectus euismod sagittis vitae ut arcu. Suspendisse tempus sollicitudin lorem. Maecenas vitae orci eu tortor hendrerit vehicula ac at leo. Sed a enim ac orci ultricies suscipit. Vestibulum porttitor justo lobortis orci vehicula consectetur. Donec sit amet dolor blandit, facilisis tellus in, pellentesque augue. Pellentesque tempus, dolor a consequat gravida, lorem odio sollicitudin dolor, eu fringilla diam mi at libero. Fusce accumsan eu libero nec porttitor. Mauris sit amet mi risus. Nullam interdum dapibus laoreet.",
        "appFeatures": [],
        "personal": false,
        "manager": false,
        "companyAdmin": false,
        "candidate": false,
        "location": {
          "country": {
            "id": 179,
            "name": "Romania",
            "code": "ro",
            "allowed": true,
            "zipFormat": "\\d{6}"
          },
          "timeZone": {
            "id": 144,
            "name": "Europe/Bucharest",
            "standardOffset": 7200000,
            "hourlyOffset": "+03:00",
            "offset": 10800000
          },
          "city": "Oradea",
          "latitude": 47.046501,
          "longitude": 21.918944
        }
      },
      "applicationFlow": {
        "id": 6,
        "name": "Moodle and 5Q",
        "flowDefinitionType": "HACKERRANK_FIVEQ"
      },
      "demand": 3,
      "visibleManagers": [],
      "calibration": {
        "id": 0,
        "descriptionApprovedOn": "2017-11-07T22:00:00.000+0000",
        "testApprovedOn": "2017-11-07T22:00:00.000+0000",
        "testApprovalStatus": "APPROVED",
        "descriptionApprovalRequestedBy": {
          "type": "ACCOUNT_MANAGER",
          "id": 624063,
          "demand": 0,
          "printableName": "Claudiu Stiube",
          "avatarTypes": [
            "CANDIDATE",
            "MANAGER",
            "ACCOUNT_MANAGER",
            "PERSONAL"
          ],
          "userId": 582494,
          "firstName": "Claudiu",
          "lastName": "Stiube",
          "email": "claudiu.stiube@crossover.com",
          "userSecurity": {
            "linkedInLogin": false,
            "enabled": true,
            "accountNonExpired": true,
            "accountNonLocked": true,
            "credentialsNonExpired": true
          },
          "photoUrl": "https://crossover-uploads-production.s3.amazonaws.com/images/18f9766d1eff05e8244f8ec529e2d2be.jpeg",
          "busySlots": [],
          "userAvatars": [
            {
              "id": 624063,
              "type": "ACCOUNT_MANAGER"
            },
            {
              "id": 650129,
              "type": "ADMIN"
            },
            {
              "id": 650131,
              "type": "ENFORCER"
            },
            {
              "id": 582058,
              "type": "CANDIDATE"
            },
            {
              "id": 1036374,
              "type": "PERSONAL"
            },
            {
              "id": 650130,
              "type": "RECRUITMENT_ANALYST"
            },
            {
              "id": 627125,
              "type": "MANAGER"
            }
          ],
          "headline": "Account Manager",
          "summary": "MASKED Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu risus vitae lectus euismod sagittis vitae ut arcu. Suspendisse tempus sollicitudin lorem. Maecenas vitae orci eu tortor hendrerit vehicula ac at leo. Sed a enim ac orci ultricies suscipit. Vestibulum porttitor justo lobortis orci vehicula consectetur. Donec sit amet dolor blandit, facilisis tellus in, pellentesque augue. Pellentesque tempus, dolor a consequat gravida, lorem odio sollicitudin dolor, eu fringilla diam mi at libero. Fusce accumsan eu libero nec porttitor. Mauris sit amet mi risus. Nullam interdum dapibus laoreet.",
          "appFeatures": [],
          "personal": false,
          "manager": false,
          "companyAdmin": false,
          "candidate": false,
          "location": {
            "country": {
              "id": 179,
              "name": "Romania",
              "code": "ro",
              "allowed": true,
              "zipFormat": "\\d{6}"
            },
            "timeZone": {
              "id": 144,
              "name": "Europe/Bucharest",
              "standardOffset": 7200000,
              "hourlyOffset": "+03:00",
              "offset": 10800000
            },
            "city": "Oradea",
            "latitude": 47.046501,
            "longitude": 21.918944
          }
        },
        "testApprovalRequestedBy": {
          "type": "ACCOUNT_MANAGER",
          "id": 624063,
          "demand": 0,
          "printableName": "Claudiu Stiube",
          "avatarTypes": [
            "CANDIDATE",
            "MANAGER",
            "ACCOUNT_MANAGER",
            "PERSONAL"
          ],
          "userId": 582494,
          "firstName": "Claudiu",
          "lastName": "Stiube",
          "email": "claudiu.stiube@crossover.com",
          "userSecurity": {
            "linkedInLogin": false,
            "enabled": true,
            "accountNonExpired": true,
            "accountNonLocked": true,
            "credentialsNonExpired": true
          },
          "photoUrl": "https://crossover-uploads-production.s3.amazonaws.com/images/18f9766d1eff05e8244f8ec529e2d2be.jpeg",
          "busySlots": [],
          "userAvatars": [
            {
              "id": 624063,
              "type": "ACCOUNT_MANAGER"
            },
            {
              "id": 650129,
              "type": "ADMIN"
            },
            {
              "id": 650131,
              "type": "ENFORCER"
            },
            {
              "id": 582058,
              "type": "CANDIDATE"
            },
            {
              "id": 1036374,
              "type": "PERSONAL"
            },
            {
              "id": 650130,
              "type": "RECRUITMENT_ANALYST"
            },
            {
              "id": 627125,
              "type": "MANAGER"
            }
          ],
          "headline": "Account Manager",
          "summary": "MASKED Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu risus vitae lectus euismod sagittis vitae ut arcu. Suspendisse tempus sollicitudin lorem. Maecenas vitae orci eu tortor hendrerit vehicula ac at leo. Sed a enim ac orci ultricies suscipit. Vestibulum porttitor justo lobortis orci vehicula consectetur. Donec sit amet dolor blandit, facilisis tellus in, pellentesque augue. Pellentesque tempus, dolor a consequat gravida, lorem odio sollicitudin dolor, eu fringilla diam mi at libero. Fusce accumsan eu libero nec porttitor. Mauris sit amet mi risus. Nullam interdum dapibus laoreet.",
          "appFeatures": [],
          "personal": false,
          "manager": false,
          "companyAdmin": false,
          "candidate": false,
          "location": {
            "country": {
              "id": 179,
              "name": "Romania",
              "code": "ro",
              "allowed": true,
              "zipFormat": "\\d{6}"
            },
            "timeZone": {
              "id": 144,
              "name": "Europe/Bucharest",
              "standardOffset": 7200000,
              "hourlyOffset": "+03:00",
              "offset": 10800000
            },
            "city": "Oradea",
            "latitude": 47.046501,
            "longitude": 21.918944
          }
        }
      },
      "sourcingInstructions": "",
      "jbpInstructions": "",
      "outboundInstructions": "",
      "jbpEnabled": false,
      "outboundEnabled": false,
      "activationDate": "2018-02-22T05:28:45.000+0000",
      "workingHoursPerWeek": 40,
      "label": {
        "id": 2,
        "name": "Sales"
      },
      "autoEndorse": false,
      "flowType": "HACKERRANK_FIVEQ",
      "yearSalary": 200,
      "testSetupCompleted": true,
      "finalTest": {
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
      }
    },
    "status": "IN_PROGRESS",
    "campaign": "AvailableJobs",
    "applicationType": "NATIVE",
    "files": [
      {
        "id": 1367699,
        "label": "Resume",
        "name": "Satyajit Samantasinghar_Resume_Latest.pdf.pdf",
        "internal": false,
        "resume": true,
        "notResume": false
      },
      {
        "id": 1367742,
        "label": "5Qs",
        "name": "fiveq_10263572784752500717724340.html.pdf",
        "internal": true,
        "resume": false,
        "notResume": true
      }
    ],
    "testScores": [
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
        "score": 0,
        "maxScore": 1,
        "result": "ACCEPTED",
        "percentage": 0,
        "invertedPercentile": 0
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
        "score": 0,
        "maxScore": 100,
        "result": "ACCEPTED",
        "percentage": 10,
        "invertedPercentile": 0
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
        "score": 0,
        "maxScore": 100,
        "result": "ACCEPTED",
        "percentage": 0,
        "invertedPercentile": 0
      },
      {
        "test": {
          "type": "HACKER_RANK",
          "id": 9,
          "name": "Software Engineer - PHP [12]",
          "status": "ACTIVE"
        },
        "score": 80,
        "maxScore": 300,
        "result": "ACCEPTED",
        "percentile": 93.45982142857143,
        "percentage": 27,
        "invertedPercentile": 7
      },
      {
        "test": {
          "type": "AVERAGE_SCORE",
          "id": 3009,
          "name": "Average Score Test",
          "status": "ACTIVE"
        },
        "score": 27,
        "maxScore": 100,
        "result": "ACCEPTED",
        "percentile": 92.24604966139955,
        "percentage": 27,
        "invertedPercentile": 8
      }
    ],
    "testsEvaluations": [
      {
        "type": "RESUME_RUBRIC_EVALUATION",
        "id": 1030238,
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
        "resumeRubricScores": []
      },
      {
        "type": "FIVEQ_ANSWER",
        "id": 1030248,
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
        "answers": [
          {
            "sequenceNumber": 1,
            "answer": "MASKED FIVEQ ANSWER",
            "score": 3
          },
          {
            "sequenceNumber": 2,
            "answer": "MASKED FIVEQ ANSWER"
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
    ],
    "testInstances": [
      {
        "id": 0,
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
        }
      },
      {
        "id": 0,
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
        }
      },
      {
        "id": 0,
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
        }
      },
      {
        "id": 0,
        "test": {
          "type": "HACKER_RANK",
          "id": 9,
          "name": "Software Engineer - PHP [12]",
          "status": "ACTIVE"
        },
        "username": "3vt3a5zbmrghdv",
        "password": "x6gy4zXj86",
        "url": "https://techscreen.crossover.com/course/view.php?id=1024"
      },
      {
        "id": 0,
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
        }
      }
    ],
    "score": 9,
    "yearsOfExperience": 10,
    "highestEducationLevel": "BACHELORS",
    "applicationFlow": {
      "id": 6,
      "name": "Moodle and 5Q",
      "flowDefinitionType": "HACKERRANK_FIVEQ"
    },
    "task": "recruitmentAnalystGrades5QTest",
    "taskCreationTime": "2018-06-23T07:39:37.000+0000",
    "termsAccepted": false,
    "variants": []
  }
];
