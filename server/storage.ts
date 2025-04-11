import { Category, InsertResourceFile, InsertUser, ResourceFile, ResourceType, User } from "../shared/schema";
import { format } from "date-fns";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resource categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  
  // Resource types
  getAllResourceTypes(): Promise<ResourceType[]>;
  getResourceTypeById(id: string): Promise<ResourceType | undefined>;
  
  // Resources
  getAllResources(): Promise<ResourceFile[]>;
  getResourceById(id: number): Promise<ResourceFile | undefined>;
  getFeaturedResources(): Promise<ResourceFile[]>;
  getRecentResources(): Promise<ResourceFile[]>;
  getResourcesByCategory(categoryId: string): Promise<ResourceFile[]>;
  createResource(resource: InsertResourceFile): Promise<ResourceFile>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private resourceTypes: Map<string, ResourceType>;
  private resources: Map<number, ResourceFile>;
  private users: Map<number, User>;
  private nextUserId: number = 1;
  private nextResourceId: number = 13; // Starting after the sample data
  sessionStore: session.Store;

  constructor() {
    this.categories = new Map();
    this.resourceTypes = new Map();
    this.resources = new Map();
    this.users = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const now = new Date();
    const newUser: User = {
      id,
      username: user.username,
      password: user.password,
      isAdmin: user.isAdmin || false,
      createdAt: now.toISOString(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  // Resource type methods
  async getAllResourceTypes(): Promise<ResourceType[]> {
    return Array.from(this.resourceTypes.values());
  }

  async getResourceTypeById(id: string): Promise<ResourceType | undefined> {
    return this.resourceTypes.get(id);
  }

  // Resource methods
  async getAllResources(): Promise<ResourceFile[]> {
    return Array.from(this.resources.values());
  }

  async getResourceById(id: number): Promise<ResourceFile | undefined> {
    return this.resources.get(id);
  }

  async getFeaturedResources(): Promise<ResourceFile[]> {
    return Array.from(this.resources.values())
      .filter(resource => resource.isFeatured)
      .slice(0, 3);
  }

  async getRecentResources(): Promise<ResourceFile[]> {
    return Array.from(this.resources.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  async getResourcesByCategory(categoryId: string): Promise<ResourceFile[]> {
    return Array.from(this.resources.values())
      .filter(resource => resource.categoryId === categoryId);
  }

  async createResource(resource: InsertResourceFile): Promise<ResourceFile> {
    const id = this.nextResourceId++;
    const now = new Date().toISOString();
    
    const newResource: ResourceFile = {
      id,
      title: resource.title,
      description: resource.description,
      fileSize: resource.fileSize,
      fileName: resource.fileName,
      filePath: resource.filePath,
      categoryId: resource.categoryId,
      categoryName: resource.categoryName,
      typeId: resource.typeId,
      typeName: resource.typeName,
      isFeatured: resource.isFeatured ?? false,
      uploadedBy: resource.uploadedBy ?? null,
      createdAt: now,
      updatedAt: now
    };
    
    this.resources.set(id, newResource);
    return newResource;
  }

  private initializeSampleData() {
    // Initialize categories
    const categories: Category[] = [
      {
        id: "class-10",
        name: "Class 10th",
        description: "Complete study materials for all subjects of 10th standard."
      },
      {
        id: "class-11",
        name: "Class 11th",
        description: "Comprehensive resources for all 11th standard subjects."
      },
      {
        id: "class-12",
        name: "Class 12th",
        description: "Complete study materials for board exam preparation."
      },
      {
        id: "jee",
        name: "JEE",
        description: "Specialized materials for JEE Main and Advanced preparation."
      },
      {
        id: "neet",
        name: "NEET",
        description: "Comprehensive study materials for medical entrance preparation."
      }
    ];

    categories.forEach(category => {
      this.categories.set(category.id, category);
    });

    // Initialize resource types
    const resourceTypes: ResourceType[] = [
      {
        id: "textbooks",
        name: "Textbooks",
        description: "Standard textbooks and reference materials for all subjects and classes."
      },
      {
        id: "notes",
        name: "Notes",
        description: "Comprehensive handwritten and digital notes covering all important topics."
      },
      {
        id: "question-banks",
        name: "Question Banks",
        description: "Previous year papers and practice questions with detailed solutions."
      },
      {
        id: "revision",
        name: "Revision Materials",
        description: "Quick revision sheets, formula collections, and summary notes."
      }
    ];

    resourceTypes.forEach(type => {
      this.resourceTypes.set(type.id, type);
    });

    // Create admin user
    const adminUser: User = {
      id: 0,
      username: "admin",
      password: "5dca0fe479c932566dca8ab9541450cd9e627ad529e98d5468664e380b06c801c4ecdc16af16f5262f6974dbba33509331d3a5358c43b7773d585b6d56d1e01f.3bdb9fd635eefd4c2fb7e5abcd860ea7", // 'admin123'
      isAdmin: true,
      createdAt: "2023-01-01"
    };
    this.users.set(0, adminUser);
    this.nextUserId = 1;

    // Initialize resources
    const resources: ResourceFile[] = [
      {
        id: 1,
        title: "Physics NCERT Solutions",
        description: "Complete solutions for NCERT Physics Class 12 with detailed explanations and diagrams.",
        fileSize: "8.2 MB",
        fileName: "physics_ncert_solutions_class12.pdf",
        filePath: "/resources/class-12/physics_ncert_solutions_class12.pdf",
        categoryId: "class-12",
        categoryName: "Class 12th",
        typeId: "textbooks",
        typeName: "Textbooks",
        isFeatured: true,
        createdAt: "2023-06-15",
        updatedAt: "2023-06-15",
        uploadedBy: 0
      },
      {
        id: 2,
        title: "Mathematics Formula Book",
        description: "Comprehensive collection of all important formulas for JEE Mathematics.",
        fileSize: "5.7 MB",
        fileName: "jee_mathematics_formulas.pdf",
        filePath: "/resources/jee/jee_mathematics_formulas.pdf",
        categoryId: "jee",
        categoryName: "JEE",
        typeId: "revision",
        typeName: "Revision Materials",
        isFeatured: true,
        createdAt: "2023-08-20",
        updatedAt: "2023-08-20",
        uploadedBy: 0
      },
      {
        id: 3,
        title: "Biology Topic-wise MCQs",
        description: "Topic-wise collection of important multiple choice questions for NEET Biology preparation.",
        fileSize: "12.3 MB",
        fileName: "neet_biology_mcqs.pdf",
        filePath: "/resources/neet/neet_biology_mcqs.pdf",
        categoryId: "neet",
        categoryName: "NEET",
        typeId: "question-banks",
        typeName: "Question Banks",
        isFeatured: true,
        createdAt: "2023-07-10",
        updatedAt: "2023-07-10",
        uploadedBy: 0
      },
      {
        id: 4,
        title: "Chemistry Revision Notes",
        description: "Comprehensive revision notes for Class 12 Chemistry covering all chapters.",
        fileSize: "6.5 MB",
        fileName: "chemistry_revision_notes_class12.pdf",
        filePath: "/resources/class-12/chemistry_revision_notes_class12.pdf",
        categoryId: "class-12",
        categoryName: "Class 12th",
        typeId: "notes",
        typeName: "Notes",
        isFeatured: false,
        createdAt: "2023-09-15",
        updatedAt: "2023-09-15",
        uploadedBy: 0
      },
      {
        id: 5,
        title: "JEE Physics Sample Papers",
        description: "Collection of previous year JEE Physics papers with detailed solutions.",
        fileSize: "9.8 MB",
        fileName: "jee_physics_sample_papers.pdf",
        filePath: "/resources/jee/jee_physics_sample_papers.pdf",
        categoryId: "jee",
        categoryName: "JEE",
        typeId: "question-banks",
        typeName: "Question Banks",
        isFeatured: false,
        createdAt: "2023-09-12",
        updatedAt: "2023-09-12",
        uploadedBy: 0
      },
      {
        id: 6,
        title: "Human Physiology Diagrams",
        description: "Detailed diagrams of human physiology systems for NEET preparation.",
        fileSize: "7.3 MB",
        fileName: "neet_human_physiology_diagrams.pdf",
        filePath: "/resources/neet/neet_human_physiology_diagrams.pdf",
        categoryId: "neet",
        categoryName: "NEET",
        typeId: "revision",
        typeName: "Revision Materials",
        isFeatured: false,
        createdAt: "2023-09-10",
        updatedAt: "2023-09-10",
        uploadedBy: 0
      },
      {
        id: 7,
        title: "Mathematics NCERT Solutions",
        description: "Complete solutions for NCERT Mathematics Class 10 with step-by-step explanations.",
        fileSize: "4.6 MB",
        fileName: "mathematics_ncert_solutions_class10.pdf",
        filePath: "/resources/class-10/mathematics_ncert_solutions_class10.pdf",
        categoryId: "class-10",
        categoryName: "Class 10th",
        typeId: "textbooks",
        typeName: "Textbooks",
        isFeatured: false,
        createdAt: "2023-09-08",
        updatedAt: "2023-09-08",
        uploadedBy: 0
      },
      {
        id: 8,
        title: "English Literature Notes",
        description: "Comprehensive notes on Class 11 English Literature with summaries and analysis.",
        fileSize: "3.9 MB",
        fileName: "english_literature_notes_class11.pdf",
        filePath: "/resources/class-11/english_literature_notes_class11.pdf",
        categoryId: "class-11",
        categoryName: "Class 11th",
        typeId: "notes",
        typeName: "Notes",
        isFeatured: false,
        createdAt: "2023-09-05",
        updatedAt: "2023-09-05",
        uploadedBy: 0
      },
      {
        id: 9,
        title: "Science Chapter Notes Class 10",
        description: "Detailed chapter notes for Class 10 Science covering Physics, Chemistry and Biology portions.",
        fileSize: "5.5 MB",
        fileName: "science_notes_class10.pdf",
        filePath: "/resources/class-10/science_notes_class10.pdf",
        categoryId: "class-10",
        categoryName: "Class 10th",
        typeId: "notes",
        typeName: "Notes",
        isFeatured: false,
        createdAt: "2023-08-28",
        updatedAt: "2023-08-28",
        uploadedBy: 0
      },
      {
        id: 10,
        title: "Physics Numerical Problems Class 11",
        description: "Collection of important numerical problems for Class 11 Physics with solutions.",
        fileSize: "7.1 MB",
        fileName: "physics_numericals_class11.pdf",
        filePath: "/resources/class-11/physics_numericals_class11.pdf",
        categoryId: "class-11",
        categoryName: "Class 11th",
        typeId: "question-banks",
        typeName: "Question Banks",
        isFeatured: false,
        createdAt: "2023-08-15",
        updatedAt: "2023-08-15",
        uploadedBy: 0
      },
      {
        id: 11,
        title: "JEE Chemistry Quick Revision",
        description: "Quick revision notes for JEE Chemistry with important reactions and concepts.",
        fileSize: "6.3 MB",
        fileName: "jee_chemistry_revision.pdf",
        filePath: "/resources/jee/jee_chemistry_revision.pdf",
        categoryId: "jee",
        categoryName: "JEE",
        typeId: "revision",
        typeName: "Revision Materials",
        isFeatured: false,
        createdAt: "2023-07-25",
        updatedAt: "2023-07-25",
        uploadedBy: 0
      },
      {
        id: 12,
        title: "NEET Botany Important Questions",
        description: "Important questions for NEET Botany with detailed answers and explanations.",
        fileSize: "8.9 MB",
        fileName: "neet_botany_questions.pdf",
        filePath: "/resources/neet/neet_botany_questions.pdf",
        categoryId: "neet",
        categoryName: "NEET",
        typeId: "question-banks",
        typeName: "Question Banks",
        isFeatured: false,
        createdAt: "2023-07-18",
        updatedAt: "2023-07-18",
        uploadedBy: 0
      }
    ];

    // Add uploadedBy field to all resources
    resources.forEach(resource => {
      // Ensure all resources have the uploadedBy field set to admin user
      if (!('uploadedBy' in resource)) {
        (resource as ResourceFile).uploadedBy = 0;
      }
      this.resources.set(resource.id, resource);
    });
  }
}

export const storage = new MemStorage();
