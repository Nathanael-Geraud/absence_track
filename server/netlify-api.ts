import express, { Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { registerRoutes } from "./routes";
import cors from 'cors';

// Créez l'application Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuration CORS
const corsOptions = {
  origin: '*', // Dans les fonctions Netlify, nous pouvons être plus permissifs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Middleware de journalisation
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`Netlify Function - ${req.method} ${req.path} started`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`Netlify Function - ${req.method} ${req.path} ${res.statusCode} completed in ${duration}ms`);
  });

  next();
});

// Nous enregistrons uniquement les routes API sur la fonction netlify
(async () => {
  try {
    // Nous n'avons pas besoin de créer un serveur HTTP ici, donc nous ignorons le retour
    await registerRoutes(app);
    
    // Middleware de gestion des erreurs
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      
      console.error(`Netlify Function Error - ${message}`);
      res.status(status).json({ message });
    });
    
    console.log("API routes registered for Netlify Functions");
  } catch (error) {
    console.error("Error setting up API routes:", error);
  }
})();

// Préfixe toutes les routes avec /api pour la fonction Netlify
const handler = serverless(app, {
  basePath: "/api"
});

export { handler };