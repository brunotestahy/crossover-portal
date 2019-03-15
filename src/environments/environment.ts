// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiPath: 'https://api-qa.crossover.com/api',
  isPrototype: false,
  mapsKey: 'AIzaSyD4Z6YC9eNez37qZdYR9qwiErfXZ8_ZotY',
  recaptchaKey: '6LdrjgETAAAAAJVg-pDJIoLirA-Z-REYL4rKTWjY',
  linkedIn: {
    apiKey: '75eoxem6btvsyc',
    oauthUrl: 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code',
  },
};
