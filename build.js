#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🚀 Démarrage du build pour Netlify...');

// Création des dossiers nécessaires
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(distDir, 'public');
const functionsDir = path.join(distDir, 'netlify-functions');

// Supprime le dossier dist s'il existe déjà
if (fs.existsSync(distDir)) {
  console.log('📁 Nettoyage du dossier dist...');
  fs.rmSync(distDir, { recursive: true, force: true });
}

// Crée les dossiers nécessaires
console.log('📁 Création des dossiers de build...');
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(functionsDir, { recursive: true });

// Exécute le build du frontend
console.log('🏗️ Build du frontend...');
exec('cd client && npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Erreur lors du build du frontend: ${error.message}`);
    process.exit(1);
  }
  
  if (stderr) {
    console.error(`⚠️ Avertissements du build frontend: ${stderr}`);
  }
  
  console.log(stdout);
  console.log('✅ Build du frontend terminé');
  
  // Copie les fichiers du frontend dans le dossier public
  console.log('📦 Copie des fichiers du frontend vers dist/public...');
  copyFolderSync(path.join(__dirname, 'client', 'dist'), publicDir);
  
  // Crée le fichier de la fonction API
  console.log('🔧 Création de la fonction Netlify pour l\'API...');
  
  const functionCode = `
// Ce fichier est généré automatiquement par le script de build
const { handler } = require('../../server/netlify-api');
exports.handler = handler;
`;

  fs.writeFileSync(path.join(functionsDir, 'api.js'), functionCode);
  
  console.log('✅ Build complet pour Netlify terminé avec succès!');
  console.log('📦 Les fichiers de build se trouvent dans le dossier dist/');
});

// Fonction pour copier un dossier de manière récursive
function copyFolderSync(source, target) {
  // Crée le dossier cible s'il n'existe pas
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // Lit le contenu du dossier source
  const files = fs.readdirSync(source);

  // Copie chaque fichier/dossier
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      // Récursion pour les sous-dossiers
      copyFolderSync(sourcePath, targetPath);
    } else {
      // Copie du fichier
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}