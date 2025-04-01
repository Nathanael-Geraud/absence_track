#!/bin/bash

# Ce script aide à déployer l'application sur Heroku
# Usage: ./deploy-heroku.sh <nom-application-heroku>

# Vérifier que le nom de l'application est fourni
if [ -z "$1" ]; then
  echo "Erreur: Vous devez spécifier un nom d'application Heroku"
  echo "Usage: ./deploy-heroku.sh <nom-application-heroku>"
  exit 1
fi

APP_NAME=$1

# Vérifier que Heroku CLI est installé
if ! command -v heroku &> /dev/null; then
  echo "Erreur: Heroku CLI n'est pas installé"
  echo "Veuillez l'installer: https://devcenter.heroku.com/articles/heroku-cli"
  exit 1
fi

# Vérifier si l'utilisateur est connecté à Heroku
HEROKU_AUTH=$(heroku auth:whoami 2>&1)
if [[ $HEROKU_AUTH == *"not logged in"* ]]; then
  echo "Vous n'êtes pas connecté à Heroku. Connexion..."
  heroku login
fi

# Vérifier si l'application existe déjà
APP_EXISTS=$(heroku apps:info --app $APP_NAME 2>&1)
if [[ $APP_EXISTS == *"Couldn't find that app"* ]]; then
  echo "Création de l'application Heroku: $APP_NAME"
  heroku create $APP_NAME
else
  echo "L'application $APP_NAME existe déjà"
fi

# Ajouter les variables d'environnement
echo "Configuration des variables d'environnement..."

# Lire le fichier .env ou .env.example s'il existe
ENV_FILE="./server/.env"
if [ ! -f "$ENV_FILE" ]; then
  ENV_FILE="./server/.env.example"
  if [ ! -f "$ENV_FILE" ]; then
    echo "Avertissement: Aucun fichier .env ou .env.example trouvé dans ./server/"
  fi
fi

# Si nous avons un fichier .env ou .env.example, configurer les variables d'environnement
if [ -f "$ENV_FILE" ]; then
  echo "Lecture des variables depuis $ENV_FILE"
  
  # Demander l'URL du frontend
  read -p "URL du frontend (ex: https://votre-app.netlify.app): " FRONTEND_URL
  
  # Définir les variables d'environnement de base
  heroku config:set NODE_ENV=production --app $APP_NAME
  heroku config:set CORS_ORIGIN=$FRONTEND_URL --app $APP_NAME
  
  # Générer un secret de session aléatoire
  SESSION_SECRET=$(openssl rand -hex 32)
  heroku config:set SESSION_SECRET=$SESSION_SECRET --app $APP_NAME
  
  # Demander les identifiants Twilio
  read -p "Twilio Account SID: " TWILIO_ACCOUNT_SID
  read -p "Twilio Auth Token: " TWILIO_AUTH_TOKEN
  read -p "Twilio Phone Number (format international): " TWILIO_PHONE_NUMBER
  
  heroku config:set TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID --app $APP_NAME
  heroku config:set TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN --app $APP_NAME
  heroku config:set TWILIO_PHONE_NUMBER=$TWILIO_PHONE_NUMBER --app $APP_NAME
  
  # Optionnel: numéro de test
  read -p "Numéro de test pour Twilio (optionnel): " TWILIO_TEST_TO_NUMBER
  if [ ! -z "$TWILIO_TEST_TO_NUMBER" ]; then
    heroku config:set TWILIO_TEST_TO_NUMBER=$TWILIO_TEST_TO_NUMBER --app $APP_NAME
  fi
  
  # Demander si une base de données PostgreSQL est nécessaire
  read -p "Voulez-vous ajouter une base de données PostgreSQL? (o/n): " ADD_POSTGRES
  if [[ $ADD_POSTGRES == "o" || $ADD_POSTGRES == "O" ]]; then
    echo "Ajout de l'addon PostgreSQL..."
    heroku addons:create heroku-postgresql:hobby-dev --app $APP_NAME
    echo "Base de données PostgreSQL ajoutée"
  fi
fi

# Configurer les buildpacks
echo "Configuration des buildpacks..."
heroku buildpacks:set heroku/nodejs --app $APP_NAME

# Configurer le git remote si nécessaire
if ! git remote | grep -q "heroku"; then
  echo "Configuration du remote git Heroku..."
  heroku git:remote -a $APP_NAME
fi

# Déployer l'application
echo "Déploiement de l'application sur Heroku..."
git push heroku main

# Afficher l'URL de l'application
echo "Déploiement terminé!"
echo "Votre API est maintenant disponible à l'adresse:"
echo "https://$APP_NAME.herokuapp.com"
echo ""
echo "N'oubliez pas de configurer votre frontend avec VITE_API_URL=https://$APP_NAME.herokuapp.com"

exit 0