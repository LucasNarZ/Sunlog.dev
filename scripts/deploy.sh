#!/bin/bash
set -e

cd ~/Sunlog.dev

git fetch origin
git reset --hard origin/main

sudo docker compose -f docker-compose.prod.yml down

npm run install-all

docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

cd backend
npx sequelize-cli db:migrate

