#!/bin/bash

# Ce script prépare les fichiers nécessaires pour un déploiement sur Render.com
# Après l'exécution, vous devrez télécharger ces fichiers dans votre dépôt GitHub,
# puis connecter ce dépôt à Render.com

# Créer un fichier render.yaml pour configuration déclarative
cat <<EOT > render.yaml
services:
  - type: web
    name: gesti-absences-api
    runtime: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SESSION_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        sync: false
      - key: TWILIO_ACCOUNT_SID
        sync: false
      - key: TWILIO_AUTH_TOKEN
        sync: false
      - key: TWILIO_PHONE_NUMBER
        sync: false
      - key: TWILIO_TEST_TO_NUMBER
        sync: false
        
databases:
  - name: gesti-absences-db
    plan: free
    databaseName: gesti_absences
    user: gesti_absences_user
EOT

# Afficher les instructions
echo "==================================================================================="
echo "Préparation pour le déploiement sur Render.com terminée!"
echo "==================================================================================="
echo ""
echo "Fichier render.yaml créé. Pour déployer votre application:"
echo ""
echo "1. Poussez ce fichier vers votre dépôt GitHub (ou GitLab/Bitbucket)"
echo "   git add render.yaml"
echo "   git commit -m \"Add Render configuration\""
echo "   git push"
echo ""
echo "2. Connectez-vous à Render.com et sélectionnez \"New Blueprint Instance\""
echo ""
echo "3. Sélectionnez votre dépôt GitHub et suivez les instructions"
echo ""
echo "4. Après le déploiement, configurez les variables d'environnement manquantes:"
echo "   - CORS_ORIGIN: URL de votre frontend sur Netlify"
echo "   - TWILIO_ACCOUNT_SID: Votre SID de compte Twilio"
echo "   - TWILIO_AUTH_TOKEN: Votre jeton d'authentification Twilio"
echo "   - TWILIO_PHONE_NUMBER: Votre numéro de téléphone Twilio"
echo ""
echo "Note: Render connectera automatiquement la base de données PostgreSQL"
echo "à votre application via la variable d'environnement DATABASE_URL"
echo "==================================================================================="