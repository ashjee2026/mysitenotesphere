import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { format } from "date-fns";
import path from "path";
import fs from "fs";
import multer from "multer";
import { setupAuth } from "./auth";
import { isAdmin } from "./admin-middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up auth routes
  setupAuth(app);
  
  // Configure multer for file uploads
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
  
  const upload = multer({ 
    storage: multerStorage, 
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
    fileFilter: (req, file, cb) => {
      // Only allow PDFs
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'));
      }
    }
  });
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

  // Admin resource upload endpoint
  app.post('/api/admin/resources', isAdmin, upload.single('pdfFile'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const { title, description, categoryId, typeId, isFeatured } = req.body;
      
      // Get category and type names
      const category = await storage.getCategoryById(categoryId);
      const type = await storage.getResourceTypeById(typeId);
      
      if (!category) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      
      if (!type) {
        return res.status(400).json({ message: 'Invalid resource type' });
      }
      
      // Calculate file size in KB or MB for display
      const fileSizeInBytes = req.file.size;
      let fileSize;
      if (fileSizeInBytes > 1024 * 1024) {
        fileSize = (fileSizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
      } else {
        fileSize = (fileSizeInBytes / 1024).toFixed(1) + ' KB';
      }
      
      // Create new resource
      const newResource = await storage.createResource({
        title,
        description,
        fileSize,
        fileName: req.file.filename,
        filePath: `/uploads/${req.file.filename}`,
        categoryId,
        categoryName: category.name,
        typeId,
        typeName: type.name,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        uploadedBy: (req.user as any).id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      res.status(201).json(newResource);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to upload resource' });
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
