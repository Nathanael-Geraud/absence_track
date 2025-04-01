#!/bin/bash

# Script de déploiement pour Netlify
# Ce script prépare les fichiers pour un déploiement complet (frontend + backend) sur Netlify

echo "🚀 Préparation du déploiement pour Netlify..."

# Création des dossiers nécessaires
mkdir -p dist/public
mkdir -p dist/netlify-functions

# Build du frontend
echo "🏗️ Build du frontend..."
cd client
npm run build
cd ..

# Copie des fichiers du frontend dans le dossier public de Netlify
echo "📦 Copie des fichiers du frontend..."
cp -r client/dist/* dist/public/

# Création du fichier de fonction Netlify pour l'API
echo "🔧 Création de la fonction Netlify pour l'API..."
mkdir -p dist/netlify-functions
echo "const { handler } = require('../../server/netlify-api');
exports.handler = handler;" > dist/netlify-functions/api.js

echo "✅ Préparation terminée. Utilisez la commande 'netlify deploy' pour déployer sur Netlify."
echo "📋 Les fichiers se trouvent dans le dossier 'dist/'."