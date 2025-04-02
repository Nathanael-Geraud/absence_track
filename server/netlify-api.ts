import express, { Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { registerRoutes } from "./routes";
import cors from 'cors';

// Définir la variable d'environnement pour indiquer que nous sommes dans Netlify
process.env.NETLIFY = 'true';

// Créez l'application Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuration CORS améliorée pour Netlify Functions
const corsOptions = {
  // En production, on acceptera uniquement les requêtes du même domaine
  // Pour les fonctions Netlify, cela fonctionne car les fonctions sont hébergées sur le même domaine que le frontend
  origin: true, // Cela permet au navigateur d'envoyer l'en-tête Origin et nous répondrons avec le même
  credentials: true, // IMPORTANT: permet l'envoi des cookies de session
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  maxAge: 86400 // Mettre en cache les pré-vérifications CORS pendant 24 heures
};
app.use(cors(corsOptions));

// Middleware de journalisation détaillée pour faciliter le debugging
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[Netlify Function] ${req.method} ${req.path} started`);
  console.log(`[Netlify Function] Cookies reçus: ${req.headers.cookie || 'aucun'}`);

  // Journalisation de la complétion de la requête
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[Netlify Function] ${req.method} ${req.path} ${res.statusCode} completed in ${duration}ms`);
  });

  next();
});

// Nous enregistrons les routes API sur la fonction Netlify
(async () => {
  try {
    // Définir explicitement que nous sommes en environnement Netlify
    console.log("[Netlify Function] Initialisation en mode Netlify Functions");
    
    // Nous n'avons pas besoin de créer un serveur HTTP ici, donc nous ignorons le retour
    await registerRoutes(app);
    
    // Middleware de gestion des erreurs amélioré
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      
      console.error(`[Netlify Function] ERREUR - ${status}: ${message}`);
      if (err.stack) {
        console.error(`[Netlify Function] Stack trace: ${err.stack}`);
      }
      
      res.status(status).json({ 
        message,
        status,
        timestamp: new Date().toISOString()
      });
    });
    
    console.log("[Netlify Function] Routes API enregistrées avec succès");
  } catch (error) {
    console.error("[Netlify Function] Erreur lors de l'initialisation:", error);
  }
})();

// Configuration serverless optimisée pour la gestion des sessions
const handler = serverless(app, {
  basePath: "/api",
  request: {
    // Augmenter la taille maximale des cookies pour les sessions
    maxCookieSize: 20000,
    // Permettre les grands corps de requête
    maxBodySize: '5mb'
  }
});

export { handler };