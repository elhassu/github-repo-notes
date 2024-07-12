FROM node:22-alpine3.19 as build
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY ./ ./

RUN npm run build

FROM node:22-alpine3.19 as production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json ./
COPY .env ./

RUN npm install --only=production

EXPOSE 3001

COPY --from=build /usr/src/app/dist ./dist

CMD ["npm", "start"]