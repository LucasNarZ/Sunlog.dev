# ---------- Stage 1: Build ----------
FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build 


# ---------- Stage 2: Runtime ----------
FROM node:23-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]

