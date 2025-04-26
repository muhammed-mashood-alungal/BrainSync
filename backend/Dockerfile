ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build 

EXPOSE 5000

CMD [ "npm" , "start" ]



