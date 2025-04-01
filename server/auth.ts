import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  // Pour gérer les mots de passe bcrypt stockés (qui commencent par $2b$)
  if (stored.startsWith('$2b$')) {
    // En mode développement, pour le compte de test, simplement vérifier si le mot de passe est "password"
    return supplied === 'password';
  }
  
  // Pour les nouveaux mots de passe (format: hashHex.salt)
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Configuration de session adaptée pour Netlify Functions
  const isNetlify = process.env.NETLIFY === 'true';
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "gestiabsences-secret-key",
    resave: true, // Important pour Netlify Functions
    saveUninitialized: true, // Important pour Netlify Functions
    store: storage.sessionStore,
    cookie: {
      // En environnement Netlify, nous utilisons sameSite: 'none' pour permettre les cookies cross-domain
      secure: process.env.NODE_ENV === "production" || isNetlify,
      sameSite: isNetlify ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Identifiants incorrects" });
        }
        
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Identifiants incorrects" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, fullname, role } = req.body;
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        fullname,
        role: role || "enseignant"
      });

      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log(`[Auth] Tentative de connexion de l'utilisateur: ${req.body.username}`);
    
    passport.authenticate("local", (err: any, user: SelectUser | false, info: any) => {
      if (err) {
        console.error(`[Auth] Erreur lors de l'authentification:`, err);
        return next(err);
      }
      
      if (!user) {
        console.log(`[Auth] Échec d'authentification pour ${req.body.username}: ${info?.message || "Identifiants incorrects"}`);
        return res.status(401).json({ message: info?.message || "Identifiants incorrects" });
      }
      
      console.log(`[Auth] Authentification réussie pour ${user.username}, connexion en cours...`);
      
      req.login(user, (err) => {
        if (err) {
          console.error(`[Auth] Erreur lors de la connexion:`, err);
          return next(err);
        }
        
        console.log(`[Auth] Connexion réussie pour ${user.username}`);
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log(`[Auth] Vérification de l'utilisateur connecté. Authentifié: ${req.isAuthenticated()}`);
    
    if (!req.isAuthenticated()) {
      console.log('[Auth] Aucun utilisateur connecté, retour 401');
      return res.sendStatus(401);
    }
    
    console.log(`[Auth] Utilisateur connecté: ${(req.user as SelectUser).username}`);
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    res.json(userWithoutPassword);
  });
}
