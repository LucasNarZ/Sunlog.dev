FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ARG BRANCH=main
ENV BRANCH=$BRANCH

CMD if [ "$BRANCH" = "main" ]; then npm run build && npm run start:prod; else npm run start:dev; fi
