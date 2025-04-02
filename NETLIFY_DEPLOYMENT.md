# Guide de déploiement sur Netlify

Ce document détaille les étapes nécessaires pour déployer l'application GestiAbsences sur Netlify.

## Prérequis

- Un compte [Netlify](https://app.netlify.com/)
- Git installé sur votre machine

## Procédure de déploiement

### 1. Configuration des variables d'environnement

Avant le déploiement, vous devez configurer les variables d'environnement dans l'interface de Netlify. Voici les variables requises:

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `SESSION_SECRET` | Clé secrète pour sécuriser les sessions (chaîne aléatoire d'au moins 32 caractères) | Oui |
| `TWILIO_ACCOUNT_SID` | Identifiant de votre compte Twilio | Oui, pour les notifications SMS |
| `TWILIO_AUTH_TOKEN` | Token d'authentification Twilio | Oui, pour les notifications SMS |
| `TWILIO_PHONE_NUMBER` | Numéro de téléphone Twilio (avec code pays, ex: +33612345678) | Oui, pour les notifications SMS |
| `TWILIO_TEST_TO_NUMBER` | Numéro de test (avec un compte Twilio d'essai) | Non |
| `NETLIFY` | À définir comme "true" | Oui |

### 2. Déploiement via le script

Utilisez le script de déploiement fourni:

```bash
./deploy-netlify.sh
```

Ce script effectue les opérations suivantes:
1. Construit le frontend
2. Préparation du dossier de déploiement
3. Déploiement sur Netlify

### 3. Déploiement manuel

Si vous préférez déployer manuellement:

1. Construisez l'application frontend:
   ```bash
   npm run build:client
   ```

2. Préparez le dossier de déploiement:
   ```bash
   # Créer le dossier de déploiement
   mkdir -p netlify_deploy

   # Copier les fichiers du client (frontend)
   cp -r client/dist/* netlify_deploy/

   # Créer le dossier netlify/functions
   mkdir -p netlify_deploy/netlify/functions

   # Copier les fichiers nécessaires pour les fonctions serverless
   cp -r server netlify_deploy/netlify/functions/api/
   cp -r shared netlify_deploy/netlify/functions/api/
   cp netlify.toml netlify_deploy/
   cp package.json netlify_deploy/netlify/functions/api/
   ```

3. Déployez sur Netlify:
   ```bash
   cd netlify_deploy
   npx netlify deploy --prod
   ```

### 4. Connecter à un dépôt Git

Pour un déploiement continu, connectez votre dépôt Git à Netlify:

1. Dans le tableau de bord Netlify, allez à "Site settings" > "Build & deploy"
2. Cliquez sur "Link site to Git"
3. Choisissez votre fournisseur Git (GitHub, GitLab, etc.)
4. Sélectionnez votre dépôt
5. Configurez les options de déploiement:
   - Build command: `npm run build && npm run build:netlify`
   - Publish directory: `netlify_deploy`

## Vérification du déploiement

Une fois déployée, votre application sera accessible à l'URL fournie par Netlify (généralement `https://votre-site-xxxx.netlify.app`).

1. Vérifiez que vous pouvez vous connecter avec l'utilisateur par défaut:
   - Email: `prof@ecole.fr`
   - Mot de passe: `password`

2. Vérifiez que les fonctionnalités principales fonctionnent:
   - Navigation dans l'application
   - Gestion des élèves et des classes
   - Enregistrement des absences
   - Envoi de notifications SMS (si configuré avec Twilio)

## Dépannage

### Problèmes d'authentification

Si vous rencontrez des problèmes d'authentification:

1. Vérifiez que `SESSION_SECRET` est correctement défini dans les variables d'environnement
2. Assurez-vous que `NETLIFY=true` est configuré
3. Vérifiez les journaux des fonctions Netlify pour des erreurs spécifiques

### Problèmes de notifications SMS

Si les notifications SMS ne fonctionnent pas:

1. Vérifiez que les variables Twilio sont correctement configurées
2. Pour les comptes d'essai Twilio, assurez-vous que les numéros de destination sont vérifiés
3. Consultez les journaux pour les erreurs liées à Twilio

## Support

Pour toute question ou problème, veuillez créer une issue sur le dépôt du projet ou contacter l'équipe de développement.