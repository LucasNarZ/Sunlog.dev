FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

# RUN npm run build
CMD ["npm", "run", "dev"]
# CMD ["npm", "start"]