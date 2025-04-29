ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

RUN rm -rf dist
RUN npm run build 


EXPOSE 5000

CMD ["node", "dist/index.js"]