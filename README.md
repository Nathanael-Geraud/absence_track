# Application de Gestion des Absences Scolaires

Cette application permet aux enseignants d'enregistrer les absences des élèves et d'envoyer automatiquement des notifications SMS aux parents via l'API Twilio.

## Fonctionnalités principales

- Gestion des classes et des élèves
- Enregistrement des absences par matière
- Notifications SMS automatiques aux parents
- Tableaux de bord et statistiques
- Historique des absences par élève
- Interface responsive et intuitive

## Technologies utilisées

- **Frontend** : React, TypeScript, TailwindCSS, Shadcn/UI
- **Backend** : Node.js, Express, TypeScript
- **Base de données** : PostgreSQL (avec option mémoire pour développement)
- **Notifications** : API Twilio pour les SMS
- **Authentification** : Sessions avec Passport.js

## Architecture

L'application est divisée en deux parties déployables séparément :
- Frontend : Application React hébergée sur Netlify
- Backend : API NodeJS/Express hébergée sur Heroku/Render/Railway

## Déploiement sur Netlify (Frontend)

1. Créez un compte sur [Netlify](https://www.netlify.com/) si ce n'est pas déjà fait
2. Depuis le Dashboard Netlify, cliquez sur "New site from Git"
3. Sélectionnez votre dépôt Git
4. Les paramètres de build sont déjà configurés dans le fichier `netlify.toml` :
   - Build command : `cd client && npm run build`
   - Publish directory : `dist/public`
5. Ajoutez les variables d'environnement :
   - `VITE_API_URL` : URL de votre backend (ex: https://votre-app-backend.herokuapp.com)
6. Cliquez sur "Deploy site"

**Remarque importante :** Si vous rencontrez des problèmes de build liés aux chemins d'importation avec l'alias `@/`, modifiez tous les imports dans les fichiers client pour utiliser des chemins relatifs à la place (comme nous l'avons fait pour les composants toast et toaster).

## Déploiement du Backend

### Option 1 : Heroku

1. Créez un compte sur [Heroku](https://www.heroku.com/) si ce n'est pas déjà fait
2. Installez [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Connectez-vous à Heroku :
   ```
   heroku login
   ```
4. Créez une application Heroku :
   ```
   heroku create votre-app-backend
   ```
5. Configurez les variables d'environnement :
   ```
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=votre_secret_de_session
   heroku config:set CORS_ORIGIN=https://votre-app-frontend.netlify.app
   heroku config:set TWILIO_ACCOUNT_SID=votre_account_sid
   heroku config:set TWILIO_AUTH_TOKEN=votre_auth_token
   heroku config:set TWILIO_PHONE_NUMBER=votre_numero_twilio
   ```
6. Si vous utilisez une base de données PostgreSQL :
   ```
   heroku addons:create heroku-postgresql:hobby-dev
   ```
7. Déployez votre application :
   ```
   git push heroku main
   ```

### Option 2 : Render

1. Créez un compte sur [Render](https://render.com/)
2. Depuis le Dashboard, cliquez sur "New Web Service"
3. Connectez votre dépôt Git
4. Configurez le service :
   - Name : votre-app-backend
   - Build Command : `npm install`
   - Start Command : `npm start`
5. Ajoutez les variables d'environnement (identiques à celles de Heroku)
6. Cliquez sur "Create Web Service"

## Variables d'environnement requises

### Backend
- `NODE_ENV` : 'production' en production
- `PORT` : Port sur lequel le serveur s'exécute (souvent défini automatiquement)
- `SESSION_SECRET` : Clé secrète pour les sessions
- `CORS_ORIGIN` : URL de votre frontend (ex: https://votre-app.netlify.app)
- `TWILIO_ACCOUNT_SID` : SID de votre compte Twilio
- `TWILIO_AUTH_TOKEN` : Token d'authentification Twilio
- `TWILIO_PHONE_NUMBER` : Numéro de téléphone Twilio (format international +33XXXXXXXXX)
- `TWILIO_TEST_TO_NUMBER` : (Optionnel) Numéro pour les tests en développement

Si vous utilisez PostgreSQL:
- `DATABASE_URL` : URL de connexion à votre base de données PostgreSQL

### Frontend
- `VITE_API_URL` : URL de votre backend (ex: https://votre-app-backend.herokuapp.com)

Un fichier `.env.example` est fourni dans le dossier `server` comme modèle pour configurer votre propre fichier `.env`.

## Après le déploiement

1. Vérifiez que le frontend et le backend communiquent correctement
2. Testez l'envoi de SMS avec Twilio
3. Assurez-vous que l'authentification fonctionne correctement

## Problèmes courants

- **Erreurs CORS** : Vérifiez que la variable `CORS_ORIGIN` correspond exactement à l'URL de votre frontend
- **Problèmes d'authentification** : Les cookies de session peuvent ne pas fonctionner entre domaines. Envisagez d'utiliser JWT pour l'authentification en production.
- **SMS non envoyés** : Vérifiez vos identifiants Twilio et assurez-vous que votre compte est actif. Notez que les comptes d'essai Twilio ont des limitations.
- **Erreurs de build Netlify** : Si vous rencontrez des erreurs liées aux imports avec l'alias `@/`, convertissez les imports en chemins relatifs.

## Note sur les builds Netlify

Pour résoudre les problèmes de build sur Netlify concernant les alias d'importation (`@/`), nous avons:

1. Créé une configuration Vite spécifique pour le client
2. Ajouté un fichier de configuration Netlify (`netlify.toml`)
3. Remplacé certains imports utilisant l'alias `@/` par des chemins relatifs

Si vous modifiez le code et ajoutez de nouveaux fichiers, assurez-vous de suivre cette même approche.

## Configuration Twilio

L'application utilise Twilio pour envoyer des SMS aux parents d'élèves. Quelques points importants:

- L'application essaie d'utiliser un identifiant d'expéditeur alphanumérique "GestiAbs" pour plus de professionnalisme
- Pour les comptes d'essai Twilio, cette fonctionnalité est désactivée automatiquement
- Un service de simulation de SMS est disponible pour les tests de développement
- Les numéros de téléphone doivent être au format international (ex: +33612345678)

## Développement local

1. Clonez le dépôt
2. Installez les dépendances : `npm install`
3. Copiez `.env.example` vers `.env` dans le dossier `server` et configurez les variables
4. Démarrez l'application : `npm run dev`