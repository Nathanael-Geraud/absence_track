#!/bin/bash
# Script pour construire uniquement le frontend pour Netlify

# Construire uniquement le client
cd client && vite build

# Revenir à la racine
cd ..
