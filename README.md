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

L'application peut maintenant être entièrement déployée sur Netlify :
- Frontend : Application React hébergée sur Netlify
- Backend : API NodeJS/Express hébergée en tant que fonctions Netlify (serverless)
- Base de données : Utilisation de Neon PostgreSQL pour la base de données en production (optionnelle)

Cette architecture tout-en-un simplifie considérablement le déploiement et la maintenance.

## Déploiement complet sur Netlify (Frontend + Backend)

1. Créez un compte sur [Netlify](https://www.netlify.com/) si ce n'est pas déjà fait
2. Depuis le Dashboard Netlify, cliquez sur "New site from Git"
3. Sélectionnez votre dépôt Git
4. Configurez les paramètres de build :
   - Build command : `./deploy-netlify.sh`
   - Publish directory : `dist/public`
   - Les fonctions serverless seront automatiquement détectées dans `dist/netlify-functions`
5. Ajoutez les variables d'environnement (dans "Site settings > Environment variables") :
   - `SESSION_SECRET` : Une chaîne aléatoire sécurisée pour les sessions
   - `TWILIO_ACCOUNT_SID` : SID de votre compte Twilio
   - `TWILIO_AUTH_TOKEN` : Token d'authentification Twilio
   - `TWILIO_PHONE_NUMBER` : Numéro de téléphone Twilio (format international +33XXXXXXXXX)
   - `NETLIFY` : `true` (pour indiquer l'environnement Netlify)
   - Ajoutez `DATABASE_URL` si vous utilisez une base de données PostgreSQL
6. Cliquez sur "Deploy site"

**Remarque :** Le script `deploy-netlify.sh` préparera tous les fichiers nécessaires pour le déploiement complet, à la fois pour le frontend et les fonctions serverless du backend.

## Déploiement Base de Données (optionnel)

Pour une application en production, il est recommandé d'utiliser une base de données PostgreSQL persistante :

### Option recommandée : Neon Database

1. Créez un compte sur [Neon](https://neon.tech/)
2. Créez un nouveau projet
3. Récupérez la chaîne de connexion depuis l'interface Neon
4. Ajoutez-la comme variable d'environnement `DATABASE_URL` dans les paramètres de votre site Netlify

### Alternatives

Vous pouvez également utiliser d'autres fournisseurs PostgreSQL comme :
- Supabase
- Railway
- Heroku Postgres

## Variables d'environnement requises

### Déploiement Netlify unifié
Pour le déploiement complet sur Netlify (frontend + backend serverless), configurez ces variables dans les paramètres de votre site Netlify :

- `SESSION_SECRET` : Clé secrète pour les sessions
- `NETLIFY` : `true` (pour indiquer l'environnement Netlify)
- `TWILIO_ACCOUNT_SID` : SID de votre compte Twilio
- `TWILIO_AUTH_TOKEN` : Token d'authentification Twilio
- `TWILIO_PHONE_NUMBER` : Numéro de téléphone Twilio (format international +33XXXXXXXXX)
- `TWILIO_TEST_TO_NUMBER` : (Optionnel) Numéro pour les tests en développement
- `DATABASE_URL` : (Optionnel) URL de connexion à votre base de données PostgreSQL

### Développement local
Pour le développement local, configurez ces variables dans le fichier `.env` :

- `SESSION_SECRET` : Clé secrète pour les sessions
- `TWILIO_ACCOUNT_SID` : SID de votre compte Twilio
- `TWILIO_AUTH_TOKEN` : Token d'authentification Twilio
- `TWILIO_PHONE_NUMBER` : Numéro de téléphone Twilio (format international +33XXXXXXXXX)
- `TWILIO_TEST_TO_NUMBER` : (Optionnel) Numéro pour les tests en développement

Un fichier `.env.example` est fourni à la racine du projet comme modèle pour configurer votre propre fichier `.env`.

## Après le déploiement

1. Vérifiez que le frontend et le backend communiquent correctement
2. Testez l'envoi de SMS avec Twilio
3. Assurez-vous que l'authentification fonctionne correctement

## Problèmes courants

- **SMS non envoyés** : Vérifiez vos identifiants Twilio et assurez-vous que votre compte est actif. Notez que les comptes d'essai Twilio ont des limitations.
- **Erreurs de build Netlify** : Si vous rencontrez des erreurs liées aux imports avec l'alias `@/`, convertissez les imports en chemins relatifs.
- **Problèmes de sessions** : Les fonctions serverless Netlify nécessitent une méthode de persistance des sessions. Par défaut, nous utilisons une solution en mémoire, mais pour la production, envisagez d'utiliser une base de données PostgreSQL pour les sessions.
- **Timeout des fonctions** : Les fonctions Netlify ont une limite de 10 secondes d'exécution. Si vous rencontrez des timeouts, optimisez vos requêtes ou envisagez d'utiliser Netlify Background Functions pour les opérations longues.

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
3. Copiez `.env.example` vers `.env` à la racine du projet et configurez les variables
4. Démarrez l'application : `npm run dev`

## Avantages du déploiement unifié sur Netlify

La configuration actuelle offre plusieurs avantages par rapport au déploiement séparé :

1. **Simplification** : Un seul service à gérer au lieu de deux (frontend et backend)
2. **Réduction des coûts** : Un seul hébergement payant à maintenir
3. **Performance** : Les fonctions serverless s'adaptent automatiquement à la charge
4. **Sécurité** : Pas de problèmes CORS entre domaines
5. **Facilité de maintenance** : Une seule base de code à déployer, un seul pipeline CI/CD

Pour les applications avec un trafic modéré, cette solution offre un excellent équilibre entre performance, coût et facilité de déploiement.