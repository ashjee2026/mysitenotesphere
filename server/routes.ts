import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertClassSchema, 
  insertSubjectSchema, 
  insertBookSchema,
  insertChapterSchema,
  insertResourceSchema,
  insertTopicSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // In a real app, we would create a session here
      // For simplicity, we'll just return the user
      return res.status(200).json({ id: user.id, username: user.username, isAdmin: user.isAdmin });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/me", async (req, res) => {
    try {
      // In a real app, we would check for a session or token
      // For now, we'll return a mock admin user
      const adminUser = await storage.getUserByUsername("admin");
      if (adminUser) {
        return res.status(200).json({ 
          id: adminUser.id, 
          username: adminUser.username, 
          isAdmin: adminUser.isAdmin 
        });
      }
      return res.status(401).json({ message: "Not authenticated" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Classes routes
  app.get("/api/classes", async (req, res) => {
    try {
      const classes = await storage.getAllClasses();
      return res.status(200).json(classes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/classes/:id", async (req, res) => {
    try {
      const id = req.params.id;
      // Handle both numeric and string IDs (for JEE, NEET etc.)
      const classItem = !isNaN(Number(id)) 
        ? await storage.getClass(Number(id))
        : await storage.getClassByName(id);

      if (!classItem) {
        return res.status(404).json({ message: "Class not found" });
      }
      
      return res.status(200).json(classItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/classes", async (req, res) => {
    try {
      const validation = insertClassSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message });
      }
      
      const newClass = await storage.createClass(validation.data);
      return res.status(201).json(newClass);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Subjects routes
  app.get("/api/subjects", async (req, res) => {
    try {
      const subjects = await storage.getAllSubjects();
      return res.status(200).json(subjects);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/subjects/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid subject ID" });
      }
      
      const subject = await storage.getSubject(id);
      
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
      
      return res.status(200).json(subject);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/classes/:classId/subjects", async (req, res) => {
    try {
      const classId = req.params.classId;
      
      // Handle both numeric and string IDs (for JEE, NEET etc.)
      const subjects = !isNaN(Number(classId))
        ? await storage.getSubjectsByClassId(Number(classId))
        : await storage.getSubjectsByClassName(classId);
      
      return res.status(200).json(subjects);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/subjects", async (req, res) => {
    try {
      const validation = insertSubjectSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message });
      }
      
      const newSubject = await storage.createSubject(validation.data);
      return res.status(201).json(newSubject);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Books routes
  app.get("/api/books", async (req, res) => {
    try {
      const { classId, subjectId } = req.query;
      
      let books;
      if (classId && subjectId) {
        books = await storage.getBooksByClassAndSubject(
          Number(classId), 
          Number(subjectId)
        );
      } else if (classId) {
        books = await storage.getBooksByClassId(Number(classId));
      } else {
        books = await storage.getAllBooks();
      }
      
      return res.status(200).json(books);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/books/featured", async (req, res) => {
    try {
      const featuredBooks = await storage.getFeaturedBooks();
      return res.status(200).json(featuredBooks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
      
      const book = await storage.getBook(id);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      return res.status(200).json(book);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/books", async (req, res) => {
    try {
      const validation = insertBookSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message });
      }
      
      const newBook = await storage.createBook(validation.data);
      return res.status(201).json(newBook);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/books/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
      
      const success = await storage.deleteBook(id);
      
      if (!success) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Chapters routes
  app.get("/api/chapters", async (req, res) => {
    try {
      const { subjectId } = req.query;
      
      let chapters;
      if (subjectId) {
        chapters = await storage.getChaptersBySubjectId(Number(subjectId));
      } else {
        chapters = await storage.getAllChapters();
      }
      
      return res.status(200).json(chapters);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/subjects/:subjectId/chapters", async (req, res) => {
    try {
      const subjectId = Number(req.params.subjectId);
      
      if (isNaN(subjectId)) {
        return res.status(400).json({ message: "Invalid subject ID" });
      }
      
      const chapters = await storage.getChaptersBySubjectId(subjectId);
      return res.status(200).json(chapters);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/chapters/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid chapter ID" });
      }
      
      const chapter = await storage.getChapter(id);
      
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      
      return res.status(200).json(chapter);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/chapters", async (req, res) => {
    try {
      const validation = insertChapterSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message });
      }
      
      const newChapter = await storage.createChapter(validation.data);
      return res.status(201).json(newChapter);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/chapters/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid chapter ID" });
      }
      
      const success = await storage.deleteChapter(id);
      
      if (!success) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      
      return res.status(200).json({ message: "Chapter deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Resources routes
  app.get("/api/resources", async (req, res) => {
    try {
      const { classId, subjectId, type } = req.query;
      
      let resources;
      if (classId && subjectId) {
        resources = await storage.getResourcesByClassAndSubject(
          Number(classId), 
          Number(subjectId)
        );
      } else if (classId) {
        resources = await storage.getResourcesByClassId(Number(classId));
      } else if (type) {
        resources = await storage.getResourcesByType(type as string);
      } else {
        resources = await storage.getAllResources();
      }
      
      return res.status(200).json(resources);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/subjects/:subjectId/resources", async (req, res) => {
    try {
      const subjectId = Number(req.params.subjectId);
      
      if (isNaN(subjectId)) {
        return res.status(400).json({ message: "Invalid subject ID" });
      }
      
      const resources = await storage.getResourcesBySubjectId(subjectId);
      return res.status(200).json(resources);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      const resource = await storage.getResource(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      return res.status(200).json(resource);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const validation = insertResourceSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message });
      }
      
      const newResource = await storage.createResource(validation.data);
      return res.status(201).json(newResource);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/resources/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      const success = await storage.deleteResource(id);
      
      if (!success) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      return res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Topics routes
  app.get("/api/chapters/:chapterId/topics", async (req, res) => {
    try {
      const chapterId = Number(req.params.chapterId);
      
      if (isNaN(chapterId)) {
        return res.status(400).json({ message: "Invalid chapter ID" });
      }
      
      const topics = await storage.getTopicsByChapterId(chapterId);
      return res.status(200).json(topics);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/topics", async (req, res) => {
    try {
      const validation = insertTopicSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.message });
      }
      
      const newTopic = await storage.createTopic(validation.data);
      return res.status(201).json(newTopic);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const totalBooks = (await storage.getAllBooks()).length;
      const totalClasses = (await storage.getAllClasses()).length;
      const totalSubjects = (await storage.getAllSubjects()).length;
      const recentBooks = await storage.getFeaturedBooks();
      
      return res.status(200).json({
        totalBooks,
        totalClasses,
        totalSubjects,
        recentBooks: recentBooks.slice(0, 5),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Setup initial data if empty
  await setupInitialData();

  return httpServer;
}

async function setupInitialData() {
  try {
    // Check if we have any classes
    const classes = await storage.getAllClasses();
    if (classes.length === 0) {
      // Add default admin user
      await storage.createUser({
        username: "admin",
        password: "admin123",
        isAdmin: true,
      });

      // Add class levels
      const classPromises = [
        storage.createClass({ 
          name: "10", 
          description: "10th Standard", 
          icon: "book-mark-line", 
          order: 1,
          displayOrder: 1
        }),
        storage.createClass({ 
          name: "11", 
          description: "11th Standard", 
          icon: "book-mark-line", 
          order: 2,
          displayOrder: 2
        }),
        storage.createClass({ 
          name: "12", 
          description: "12th Standard", 
          icon: "book-mark-line", 
          order: 3,
          displayOrder: 3
        }),
        storage.createClass({ 
          name: "JEE", 
          description: "JEE Preparation", 
          icon: "file-list-3-line", 
          order: 4,
          displayOrder: 4 
        }),
        storage.createClass({ 
          name: "NEET", 
          description: "NEET Preparation", 
          icon: "medicine-bottle-line", 
          order: 5,
          displayOrder: 5
        }),
      ];

      await Promise.all(classPromises);

      // Add some subjects
      const class10 = await storage.getClassByName("10");
      const class11 = await storage.getClassByName("11");
      const class12 = await storage.getClassByName("12");
      const jee = await storage.getClassByName("JEE");
      const neet = await storage.getClassByName("NEET");

      if (class10 && class11 && class12 && jee && neet) {
        const subjectPromises = [
          // 10th subjects
          storage.createSubject({ 
            classId: class10.id, 
            name: "Mathematics", 
            description: "10th Mathematics", 
            icon: "ruler-line" 
          }),
          storage.createSubject({ 
            classId: class10.id, 
            name: "Science", 
            description: "10th Science", 
            icon: "flask-line" 
          }),
          storage.createSubject({ 
            classId: class10.id, 
            name: "Social Studies", 
            description: "10th Social Studies", 
            icon: "earth-line" 
          }),
          storage.createSubject({ 
            classId: class10.id, 
            name: "English", 
            description: "10th English", 
            icon: "book-open-line" 
          }),
          
          // 11th subjects
          storage.createSubject({ 
            classId: class11.id, 
            name: "Physics", 
            description: "11th Physics", 
            icon: "pulse-line" 
          }),
          storage.createSubject({ 
            classId: class11.id, 
            name: "Chemistry", 
            description: "11th Chemistry", 
            icon: "test-tube-line" 
          }),
          storage.createSubject({ 
            classId: class11.id, 
            name: "Mathematics", 
            description: "11th Mathematics", 
            icon: "ruler-line" 
          }),
          storage.createSubject({ 
            classId: class11.id, 
            name: "Biology", 
            description: "11th Biology", 
            icon: "seedling-line" 
          }),
          
          // 12th subjects
          storage.createSubject({ 
            classId: class12.id, 
            name: "Physics", 
            description: "12th Physics", 
            icon: "pulse-line" 
          }),
          storage.createSubject({ 
            classId: class12.id, 
            name: "Chemistry", 
            description: "12th Chemistry", 
            icon: "test-tube-line" 
          }),
          storage.createSubject({ 
            classId: class12.id, 
            name: "Mathematics", 
            description: "12th Mathematics", 
            icon: "ruler-line" 
          }),
          storage.createSubject({ 
            classId: class12.id, 
            name: "Biology", 
            description: "12th Biology", 
            icon: "seedling-line" 
          }),
          
          // JEE subjects
          storage.createSubject({ 
            classId: jee.id, 
            name: "Physics", 
            description: "JEE Physics", 
            icon: "pulse-line" 
          }),
          storage.createSubject({ 
            classId: jee.id, 
            name: "Chemistry", 
            description: "JEE Chemistry", 
            icon: "test-tube-line" 
          }),
          storage.createSubject({ 
            classId: jee.id, 
            name: "Mathematics", 
            description: "JEE Mathematics", 
            icon: "ruler-line" 
          }),
          
          // NEET subjects
          storage.createSubject({ 
            classId: neet.id, 
            name: "Physics", 
            description: "NEET Physics", 
            icon: "pulse-line" 
          }),
          storage.createSubject({ 
            classId: neet.id, 
            name: "Chemistry", 
            description: "NEET Chemistry", 
            icon: "test-tube-line" 
          }),
          storage.createSubject({ 
            classId: neet.id, 
            name: "Biology", 
            description: "NEET Biology", 
            icon: "seedling-line" 
          }),
        ];

        await Promise.all(subjectPromises);

        // Add sample featured books
        const physics11 = await storage.getSubjectByClassAndName(class11.id, "Physics");
        
        if (physics11) {
          const booksPromises = [
            storage.createBook({
              title: "Physics NCERT Textbook",
              author: "Class 11 - Part 1",
              description: "Official NCERT textbook for Class 11 Physics",
              coverImage: "https://images.unsplash.com/photo-1608228088998-57828365d486?ixlib=rb-4.0.3&auto=format&fit=crop",
              fileUrl: "https://example.com/physics-ncert.pdf",
              format: "PDF",
              subjectId: physics11.id,
              classId: class11.id,
              featured: true,
              downloads: 4200,
              type: "book",
            }),
            storage.createBook({
              title: "Concepts of Physics",
              author: "HC Verma - Volume 1",
              description: "A comprehensive book covering fundamental physics concepts",
              coverImage: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?ixlib=rb-4.0.3&auto=format&fit=crop",
              fileUrl: "",
              subjectId: physics11.id,
              classId: class11.id,
              featured: true,
              rating: "4.9",
              downloads: 10500,
              type: "book",
            }),
          ];

          await Promise.all(booksPromises);

          // Add sample chapters
          await storage.createChapter({
            subjectId: physics11.id,
            name: "Chapter 1: Physical World",
            description: "Introduction to physics and its applications",
            lessons: 4,
            practices: 2,
            status: "completed",
            order: 1,
          });

          await storage.createChapter({
            subjectId: physics11.id,
            name: "Chapter 2: Units and Measurements",
            description: "Understanding the importance of measurements in physics",
            lessons: 6,
            practices: 3,
            status: "completed",
            order: 2,
          });

          await storage.createChapter({
            subjectId: physics11.id,
            name: "Chapter 3: Motion in a Straight Line",
            description: "Concepts of kinematics in one dimension",
            lessons: 5,
            practices: 4,
            status: "in-progress",
            order: 3,
          });

          // Add sample resources
          await storage.createResource({
            title: "Video Lectures",
            description: "Comprehensive video lectures for Class 11 Physics",
            type: "video",
            icon: "youtube-line",
            count: 42,
            metadata: "42 videos • 5 playlists",
            subjectId: physics11.id,
            classId: class11.id,
          });

          await storage.createResource({
            title: "Previous Year Papers",
            description: "Collection of past examination papers",
            type: "paper",
            icon: "file-paper-2-line",
            count: 20,
            metadata: "10 years • 20 papers",
            subjectId: physics11.id,
            classId: class11.id,
          });

          await storage.createResource({
            title: "Virtual Lab Experiments",
            description: "Interactive virtual physics lab experiments",
            type: "experiment",
            icon: "flask-line",
            count: 15,
            metadata: "15 simulations • Interactive",
            subjectId: physics11.id,
            classId: class11.id,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error setting up initial data:", error);
  }
}
