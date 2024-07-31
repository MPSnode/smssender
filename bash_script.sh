#!/bin/bash

# Konfigurasi Git
git init
git add .
git commit -m "Initial commit"

# Menghubungkan repository lokal ke GitHub
git remote add origin https://github.com/MPSnode/smssender.git

# Mengunggah ke GitHub
git push -u origin master

# Login ke Heroku
heroku login

# Membuat aplikasi Heroku
heroku create my-twilio-sms-app

# Menambahkan remote Heroku
git remote add heroku https://git.heroku.com/my-twilio-sms-app.git

# Mendorong kode ke Heroku
git push heroku master

# Menyiapkan variabel lingkungan di Heroku
heroku config:set FLASK_ENV=production
