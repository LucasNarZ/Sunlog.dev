#!/bin/bash
set -e

cd ~/Sunlog.dev

git fetch origin
git reset --hard origin/main

docker compose -f docker-compose.prod.yml pull

docker compose -f docker-compose.prod.yml down

docker compose -f docker-compose.prod.yml up -d

cd backend
npx sequelize-cli db:migrate

