FROM node:8.16-alpine

RUN mkdir /app
WORKDIR /app

RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*

COPY ./package.json package.json

RUN npm install pm2 -g

RUN npm install

COPY . .

CMD ["pm2-runtime", "start", "bin/www", "--name", "dashboard-backend"]

LABEL maintainer="Evgenii Koniakhin <eugene2238@gmail.com>" \
      version="1.0"
