FROM mhart/alpine-node:8
LABEL Jordan Addison <jordanaddison@globalfas.com>
COPY . /var/www/
WORKDIR /var/www
RUN apk --no-cache add --virtual native-deps \
  git g++ gcc libgcc libstdc++ linux-headers make python
RUN yarn global add pm2
RUN yarn global add node-gyp
RUN yarn install
RUN npm rebuild bcrypt --build-from-source
EXPOSE 4000
CMD ["pm2-docker","/var/www/server.js"]