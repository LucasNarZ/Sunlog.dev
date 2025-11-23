#!/bin/bash
set -e

cd ~/The-Learning-Experience

git fetch origin
git reset --hard origin/main

sudo docker compose -f docker-compose.prod.yml down

npm run install-all

sudo docker compose -f docker-compose.prod.yml pull
sudo docker compose -f docker-compose.prod.yml up -d

cd backend
npx sequelize-cli db:migrate

