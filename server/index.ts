import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth";
import blogRoutes from "./routes/blog";
import carRoutes from "./routes/car";
import contactRoutes from "./routes/contact";
import brandRoutes from "./routes/brand";
import modelRoutes from "./routes/model";
import yearRoutes from "./routes/year";
import driveTypeRoutes from "./routes/drive-type";
import favoritesRoutes from "./routes/favorites";
import viewsRoutes from "./routes/views";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Serve static files from public directory
  app.use(express.static(path.join(process.cwd(), 'public')));
  
  app.use("/api/auth", authRoutes);
  app.use("/api/blogs", blogRoutes);
  app.use("/api/cars", carRoutes);
  app.use("/api/contacts", contactRoutes);
  app.use("/api/brands", brandRoutes);
  app.use("/api/models", modelRoutes);
  app.use("/api/years", yearRoutes);
  app.use("/api/drive-types", driveTypeRoutes);
  app.use("/api/favorites", favoritesRoutes);
  app.use("/api/views", viewsRoutes);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });


  // Error handling middleware
  app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.code === 'ECONNABORTED' || err.code === 'ECONNRESET') {
      console.warn('Request aborted by client');
      return;
    }
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
    next(err);
  });

  return app;
}
