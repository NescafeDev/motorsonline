import path from "path";
import { createServer } from "./index";
import * as express from "express";
import { queryWithRetry } from "./db";

const app = createServer();
const port = process.env.PORT || 3000;

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DB Config:', {
      host: process.env.DB_HOST || 'sql12.freesqldatabase.com',
      user: process.env.DB_USER || 'sql12801757',
      database: process.env.DB_NAME || 'sql12801757',
    });
    
    const result = await queryWithRetry('SELECT 1 as connected');
    console.log('✅ Database connection successful:', result);
    return true;
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, async () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  
  // Test database connection after server starts
  await testDatabaseConnection();
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
