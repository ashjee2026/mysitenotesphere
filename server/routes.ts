import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { format } from "date-fns";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories API endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to get category" });
    }
  });

  // Resource types API endpoints
  app.get("/api/resource-types", async (req, res) => {
    try {
      const types = await storage.getAllResourceTypes();
      res.json(types);
    } catch (error) {
      res.status(500).json({ message: "Failed to get resource types" });
    }
  });

  // Resources API endpoints
  app.get("/api/resources/featured", async (req, res) => {
    try {
      const resources = await storage.getFeaturedResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to get featured resources" });
    }
  });

  app.get("/api/resources/recent", async (req, res) => {
    try {
      const resources = await storage.getRecentResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent resources" });
    }
  });

  app.get("/api/categories/:categoryId/resources", async (req, res) => {
    try {
      const resources = await storage.getResourcesByCategory(req.params.categoryId);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to get resources for category" });
    }
  });

  app.get("/api/resources/:id/download", async (req, res) => {
    try {
      const resourceId = parseInt(req.params.id);
      const resource = await storage.getResourceById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      // For this demo, instead of serving a real file (since we don't have one),
      // we'll create a simple text file with the resource info
      const content = `
        NoteSphere Resource
        -----------------
        Title: ${resource.title}
        Description: ${resource.description}
        Category: ${resource.categoryName}
        Type: ${resource.typeName}
        
        This is a sample PDF content for demonstration purposes.
        In a real application, this would be the actual PDF file content.
      `;
      
      // Create temp dir if it doesn't exist
      const tempDir = path.join(import.meta.dirname, "temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      
      // Create a temporary file to serve
      const tempFilePath = path.join(tempDir, `${resource.fileName}`);
      fs.writeFileSync(tempFilePath, content);
      
      res.download(tempFilePath, resource.fileName, (err) => {
        // Delete the temp file after sending
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
        if (err) {
          res.status(500).json({ message: "Download failed" });
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to download resource" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
