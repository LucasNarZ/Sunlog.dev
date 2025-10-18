#!/bin/bash

cd ~/The-Learning-Experience
git checkout -- .
git pull --rebase origin main
sudo docker compose down
npm run install-all
sudo BRANCH=main docker compose -f docker-compose.prod.yml up -d --build
cd backend
npx sequelize-cli db:migrate
