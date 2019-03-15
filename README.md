# Crossover

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.5.

## Project setup

You must execute the following command on the target system, in order to get the base rules:

`npm config set '@devfactory:registry' http://nexus-rapid-proto.devfactory.com/repository/npm/`
`npm config set '@easier:registry' http://nexus-rapid-proto.devfactory.com/repository/npm-proto/`

After that, you can run `npm install`.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
The `npm start` will start the application for QA environment (check below).

## iPhone BrowserStack Testing

BrowserStack has a restrict set of ports for Safari. The 4200 is not included on this pack, so it must be server on port 4000

Seems like the iOS / MacOS versions running on BrowserStack has some kind of restriction with localhost name. So we will add a host called `iphone-test` to the hosts file (`/private/etc/hosts` on Mac, `/etc/hosts` on Linux and `C:\Windows\system32\drivers\etc\hosts` on Windows; (you must edit these files with admin privileges, otherwise it will not allow the changes to be stored, e.g.: sudo nano /private/etc/hosts).

Example entry for Mac's host file:
127.0.0.1    iphone-test

Once done, you may start the iPhone-ready server instance by executing `npm run start-iphone`; as it finishes, access the URL `http://iphone-test:4000` on BrowserStack (do not forget to type the `http://` prefix).

## UI dockerization

Easier QA team test features utilising virtualised instances of the branches through Engine Yard tooling. The same setup provided by us to them can also be utilised for running the UI inside a Docker container on our dev environments, utilising the commands below to create and run the docker image:

```
cd <root of the code repository, not of the Easier folder>
docker build -f bandcamp-easier-ui/engineyard/Dockerfile -t <alias of your image> .
docker run --name <name of your container> -p 4000:4000 <alias of your image>
```

The commands above will start the UI in production mode at the port 4000.

P.S.: you must increase your memory limit on Docker GUI. It would be nice to get at least 6 GB.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist/` directory. The default build is for on production mode.

Notes:
* The TeamCity build will automatically run: `npm run lint`, `npm run test-coverage` and `npm run build` so it is recommended to double check them locally first.
* The TSLint rule `"lines-between-class-members": true`, doesn't work if the line break marker used is CRLF.

## Environments

There are 3 environments defined:
* dev: Local environment (meant for prototype team). It does points to localhost for the backend.
* qa: QA environment (meant for easier team). It does point to QA backend server (api-qa.crossover.com).
* prod: Production environment (easier team). It does point to PROD backend server (api.crossover.com).

You can run the different commands with -environment=XXX option to raise or build for each one.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).
To calculate the test coverage you can use `npm run test-coverage` and the result will be shown on the coverage folder created.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## DevSpaces

- Install all prerequisites as stated in [DevSpaces Documentation](http://devspaces-docs.ey.devfactory.com)
- Windows 10? Take a look here too: [Ubuntu on Windows 10](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
- Create new image on [DevSpaces](https://devspaces.ey.devfactory.com) using source image registry2.swarm.devfactory.com/devfactory/workspaces_mohamed--foly_xodev:latest
- Create new dev space configuration based on above image and add port 4200
- Bind the source code to the dev space using 'cndevspaces bind [DEVSPACE_NAME]'
- Start container using 'cndevspaces exec'
- Check the port mapped to local 8080 port (by executing 'cndevspaces info' command).
- Inside container run 'bash start.sh' to start the server. Application will be available on the host and url shown in previous step ('cndevspaces info')


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
