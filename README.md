# Application de Gestion des Absences Scolaires

Cette application permet aux enseignants d'enregistrer les absences des élèves et d'envoyer automatiquement des notifications SMS aux parents.

## Architecture

L'application est divisée en deux parties :
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
- `TWILIO_PHONE_NUMBER` : Numéro de téléphone Twilio

### Frontend
- `VITE_API_URL` : URL de votre backend

## Après le déploiement

1. Vérifiez que le frontend et le backend communiquent correctement
2. Testez l'envoi de SMS avec Twilio
3. Assurez-vous que l'authentification fonctionne correctement

## Problèmes courants

- **Erreurs CORS** : Vérifiez que la variable `CORS_ORIGIN` correspond exactement à l'URL de votre frontend
- **Problèmes d'authentification** : Les cookies de session peuvent ne pas fonctionner entre domaines. Envisagez d'utiliser JWT pour l'authentification en production.
- **SMS non envoyés** : Vérifiez vos identifiants Twilio et assurez-vous que votre compte est actif