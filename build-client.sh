#!/bin/bash

# Script de build pour le frontend en production

# Accéder au répertoire client
cd client

# Installer les dépendances
npm install

# Construire le projet
npm run build

# Afficher un message de confirmation
echo "Build client terminé avec succès !"

# Revenir au répertoire principal
cd ..