FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

ARG BRANCH=main
ENV BRANCH=$BRANCH
CMD if [ "$BRANCH" = "main" ]; then npm run build && npm run start; else npm run dev; fi
