# ---- Stage 1: Builder ----
FROM node:23-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# ---- Stage 2: Runner ----
FROM node:23-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV INTERNAL_API_URL=http://nginx/api

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3001

CMD ["npm", "start"]

