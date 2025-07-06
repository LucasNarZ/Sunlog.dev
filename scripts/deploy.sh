#!/bin/bash

cd ~/The-Learning-Experience
git checkout -- .
git pull --rebase origin main
sudo docker compose down
npm run install-all
sudo docker compose up -d --build
