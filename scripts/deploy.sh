#!/bin/bash

cd ~/The-Learning-Experience
git checkout -- .
git pull --rebase origin main
sudo docker compose down
npm run install-all
cd backend && NODE_ENV=production npx sequelize-cli migrate:db
cd ..
sudo BRANCH=main docker compose up -d --build
