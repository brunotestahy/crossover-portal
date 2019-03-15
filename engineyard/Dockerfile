FROM node:8
MAINTAINER maxim.zaytsev@aurea.com
WORKDIR /usr/src/xo-easier-ui

# Copy frontend
COPY bandcamp-easier-ui/ /usr/src/xo-easier-ui

# Prepare start script
COPY bandcamp-easier-ui/engineyard/start.sh /usr/src

# Default port to be exposed.
EXPOSE 4000

# Run the app.
RUN chmod u+x /usr/src/start.sh
CMD sh -c '/usr/src/start.sh'
