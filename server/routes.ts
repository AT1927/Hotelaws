import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes are handled by the external Lambda functions
  // The frontend will make direct API calls to the Lambda endpoints
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "EnchantStay Hotel Management System" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
