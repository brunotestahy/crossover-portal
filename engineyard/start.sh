#!/usr/bin/env sh
cd /usr/src/xo-easier-ui && rm -rf node_modules
cd /usr/src/xo-easier-ui && npm install
cd /usr/src/xo-easier-ui && npm run start-qa
