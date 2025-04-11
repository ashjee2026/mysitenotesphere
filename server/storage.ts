import { 
  users, 
  classes, 
  subjects, 
  chapters, 
  books, 
  resources, 
  topics,
  type User, 
  type InsertUser,
  type Class,
  type InsertClass,
  type Subject,
  type InsertSubject,
  type Chapter,
  type InsertChapter,
  type Book,
  type InsertBook,
  type Resource,
  type InsertResource,
  type Topic,
  type InsertTopic
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Class operations
  getAllClasses(): Promise<Class[]>;
  getClass(id: number): Promise<Class | undefined>;
  getClassByName(name: string): Promise<Class | undefined>;
  createClass(cls: InsertClass): Promise<Class>;
  
  // Subject operations
  getAllSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  getSubjectsByClassId(classId: number): Promise<Subject[]>;
  getSubjectsByClassName(className: string): Promise<Subject[]>;
  getSubjectByClassAndName(classId: number, name: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  // Chapter operations
  getAllChapters(): Promise<Chapter[]>;
  getChapter(id: number): Promise<Chapter | undefined>;
  getChaptersBySubjectId(subjectId: number): Promise<Chapter[]>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;
  deleteChapter(id: number): Promise<boolean>;
  
  // Book operations
  getAllBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  getBooksByClassId(classId: number): Promise<Book[]>;
  getBooksBySubjectId(subjectId: number): Promise<Book[]>;
  getBooksByClassAndSubject(classId: number, subjectId: number): Promise<Book[]>;
  getFeaturedBooks(): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  deleteBook(id: number): Promise<boolean>;
  
  // Resource operations
  getAllResources(): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  getResourcesByClassId(classId: number): Promise<Resource[]>;
  getResourcesBySubjectId(subjectId: number): Promise<Resource[]>;
  getResourcesByType(type: string): Promise<Resource[]>;
  getResourcesByClassAndSubject(classId: number, subjectId: number): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  deleteResource(id: number): Promise<boolean>;
  
  // Topic operations
  getTopicsByChapterId(chapterId: number): Promise<Topic[]>;
  createTopic(topic: InsertTopic): Promise<Topic>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private classes: Map<number | string, Class>;
  private subjects: Map<number, Subject>;
  private chapters: Map<number, Chapter>;
  private books: Map<number, Book>;
  private resources: Map<number, Resource>;
  private topics: Map<number, Topic>;
  
  private userIdCounter: number;
  private classIdCounter: number;
  private subjectIdCounter: number;
  private chapterIdCounter: number;
  private bookIdCounter: number;
  private resourceIdCounter: number;
  private topicIdCounter: number;

  constructor() {
    this.users = new Map();
    this.classes = new Map();
    this.subjects = new Map();
    this.chapters = new Map();
    this.books = new Map();
    this.resources = new Map();
    this.topics = new Map();
    
    this.userIdCounter = 1;
    this.classIdCounter = 1;
    this.subjectIdCounter = 1;
    this.chapterIdCounter = 1;
    this.bookIdCounter = 1;
    this.resourceIdCounter = 1;
    this.topicIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Class methods
  async getAllClasses(): Promise<Class[]> {
    return Array.from(this.classes.values())
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async getClass(id: number): Promise<Class | undefined> {
    return this.classes.get(id);
  }

  async getClassByName(name: string): Promise<Class | undefined> {
    return Array.from(this.classes.values()).find(
      (cls) => cls.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createClass(insertClass: InsertClass): Promise<Class> {
    const id = this.classIdCounter++;
    const cls: Class = { ...insertClass, id };
    this.classes.set(id, cls);
    return cls;
  }

  // Subject methods
  async getAllSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async getSubjectsByClassId(classId: number): Promise<Subject[]> {
    return Array.from(this.subjects.values()).filter(
      (subject) => subject.classId === classId
    );
  }

  async getSubjectsByClassName(className: string): Promise<Subject[]> {
    const cls = await this.getClassByName(className);
    if (!cls) return [];
    return this.getSubjectsByClassId(cls.id as number);
  }

  async getSubjectByClassAndName(classId: number, name: string): Promise<Subject | undefined> {
    return Array.from(this.subjects.values()).find(
      (subject) => subject.classId === classId && subject.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = this.subjectIdCounter++;
    const subject: Subject = { ...insertSubject, id };
    this.subjects.set(id, subject);
    return subject;
  }

  // Chapter methods
  async getAllChapters(): Promise<Chapter[]> {
    return Array.from(this.chapters.values())
      .sort((a, b) => a.order - b.order);
  }

  async getChapter(id: number): Promise<Chapter | undefined> {
    return this.chapters.get(id);
  }

  async getChaptersBySubjectId(subjectId: number): Promise<Chapter[]> {
    return Array.from(this.chapters.values())
      .filter((chapter) => chapter.subjectId === subjectId)
      .sort((a, b) => a.order - b.order);
  }

  async createChapter(insertChapter: InsertChapter): Promise<Chapter> {
    const id = this.chapterIdCounter++;
    const chapter: Chapter = { ...insertChapter, id };
    this.chapters.set(id, chapter);
    return chapter;
  }

  async deleteChapter(id: number): Promise<boolean> {
    return this.chapters.delete(id);
  }

  // Book methods
  async getAllBooks(): Promise<Book[]> {
    return Array.from(this.books.values());
  }

  async getBook(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async getBooksByClassId(classId: number): Promise<Book[]> {
    return Array.from(this.books.values()).filter(
      (book) => book.classId === classId
    );
  }

  async getBooksBySubjectId(subjectId: number): Promise<Book[]> {
    return Array.from(this.books.values()).filter(
      (book) => book.subjectId === subjectId
    );
  }

  async getBooksByClassAndSubject(classId: number, subjectId: number): Promise<Book[]> {
    return Array.from(this.books.values()).filter(
      (book) => book.classId === classId && book.subjectId === subjectId
    );
  }

  async getFeaturedBooks(): Promise<Book[]> {
    return Array.from(this.books.values()).filter(
      (book) => book.featured
    );
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.bookIdCounter++;
    const book: Book = { ...insertBook, id };
    this.books.set(id, book);
    return book;
  }

  async deleteBook(id: number): Promise<boolean> {
    return this.books.delete(id);
  }

  // Resource methods
  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getResourcesByClassId(classId: number): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      (resource) => resource.classId === classId
    );
  }

  async getResourcesBySubjectId(subjectId: number): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      (resource) => resource.subjectId === subjectId
    );
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      (resource) => resource.type === type
    );
  }

  async getResourcesByClassAndSubject(classId: number, subjectId: number): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      (resource) => resource.classId === classId && resource.subjectId === subjectId
    );
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const resource: Resource = { ...insertResource, id };
    this.resources.set(id, resource);
    return resource;
  }

  async deleteResource(id: number): Promise<boolean> {
    return this.resources.delete(id);
  }

  // Topic methods
  async getTopicsByChapterId(chapterId: number): Promise<Topic[]> {
    return Array.from(this.topics.values())
      .filter((topic) => topic.chapterId === chapterId)
      .sort((a, b) => a.order - b.order);
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = this.topicIdCounter++;
    const topic: Topic = { ...insertTopic, id };
    this.topics.set(id, topic);
    return topic;
  }
}

// Create and export a singleton instance
export const storage = new MemStorage();
