#!/bin/bash
set -e

cd ~/Sunlog.dev

git fetch origin
git reset --hard origin/main

aws ecr get-login-password --region us-east-1 \
| docker login --username AWS --password-stdin 242201312839.dkr.ecr.us-east-1.amazonaws.com

docker compose -f docker-compose.prod.yml pull

docker compose -f docker-compose.prod.yml down

docker compose -f docker-compose.prod.yml up -d

cd backend
npx sequelize-cli db:migrate

