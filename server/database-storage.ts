import { 
  users, classes, subjects, chapters, books, resources, topics,
  type User, type InsertUser,
  type Class, type InsertClass,
  type Subject, type InsertSubject,
  type Chapter, type InsertChapter,
  type Book, type InsertBook,
  type Resource, type InsertResource,
  type Topic, type InsertTopic
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import { IStorage } from "./storage";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      isAdmin: insertUser.isAdmin ?? false
    }).returning();
    return user;
  }

  // Class operations
  async getAllClasses(): Promise<Class[]> {
    return db.select().from(classes).orderBy(classes.order);
  }

  async getClass(id: number): Promise<Class | undefined> {
    const [cls] = await db.select().from(classes).where(eq(classes.id, id));
    return cls;
  }

  async getClassByName(name: string): Promise<Class | undefined> {
    const [cls] = await db.select().from(classes).where(eq(classes.name, name));
    return cls;
  }

  async createClass(insertClass: InsertClass): Promise<Class> {
    const [cls] = await db.insert(classes).values({
      ...insertClass,
      description: insertClass.description ?? null,
    }).returning();
    return cls;
  }

  // Subject operations
  async getAllSubjects(): Promise<Subject[]> {
    return db.select().from(subjects);
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject;
  }

  async getSubjectsByClassId(classId: number): Promise<Subject[]> {
    return db.select().from(subjects).where(eq(subjects.classId, classId));
  }

  async getSubjectsByClassName(className: string): Promise<Subject[]> {
    const cls = await this.getClassByName(className);
    if (!cls) return [];
    return this.getSubjectsByClassId(cls.id);
  }

  async getSubjectByClassAndName(classId: number, name: string): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects)
      .where(and(
        eq(subjects.classId, classId),
        eq(subjects.name, name)
      ));
    return subject;
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const [subject] = await db.insert(subjects).values({
      ...insertSubject,
      description: insertSubject.description ?? null,
      icon: insertSubject.icon ?? null,
    }).returning();
    return subject;
  }

  // Chapter operations
  async getAllChapters(): Promise<Chapter[]> {
    return db.select().from(chapters).orderBy(chapters.order);
  }

  async getChapter(id: number): Promise<Chapter | undefined> {
    const [chapter] = await db.select().from(chapters).where(eq(chapters.id, id));
    return chapter;
  }

  async getChaptersBySubjectId(subjectId: number): Promise<Chapter[]> {
    return db.select().from(chapters)
      .where(eq(chapters.subjectId, subjectId))
      .orderBy(chapters.order);
  }

  async createChapter(insertChapter: InsertChapter): Promise<Chapter> {
    const [chapter] = await db.insert(chapters).values({
      ...insertChapter,
      description: insertChapter.description ?? null,
    }).returning();
    return chapter;
  }

  async deleteChapter(id: number): Promise<boolean> {
    const result = await db.delete(chapters).where(eq(chapters.id, id)).returning();
    return result.length > 0;
  }

  // Book operations
  async getAllBooks(): Promise<Book[]> {
    return db.select().from(books);
  }

  async getBook(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async getBooksByClassId(classId: number): Promise<Book[]> {
    return db.select().from(books).where(eq(books.classId, classId));
  }

  async getBooksBySubjectId(subjectId: number): Promise<Book[]> {
    return db.select().from(books).where(eq(books.subjectId, subjectId));
  }

  async getBooksByClassAndSubject(classId: number, subjectId: number): Promise<Book[]> {
    return db.select().from(books)
      .where(and(
        eq(books.classId, classId),
        eq(books.subjectId, subjectId)
      ));
  }

  async getFeaturedBooks(): Promise<Book[]> {
    return db.select().from(books).where(eq(books.featured, true));
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const now = new Date();
    const [book] = await db.insert(books).values({
      ...insertBook,
      author: insertBook.author ?? null,
      coverImage: insertBook.coverImage ?? null,
      pageCount: insertBook.pageCount ?? null,
      featured: insertBook.featured ?? false,
      downloadCount: 0,
      topics: insertBook.topics ?? [],
      rating: insertBook.rating ?? null,
      createdAt: now
    }).returning();
    return book;
  }

  async deleteBook(id: number): Promise<boolean> {
    const result = await db.delete(books).where(eq(books.id, id)).returning();
    return result.length > 0;
  }

  // Resource operations
  async getAllResources(): Promise<Resource[]> {
    return db.select().from(resources);
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async getResourcesByClassId(classId: number): Promise<Resource[]> {
    return db.select().from(resources).where(eq(resources.classId, classId));
  }

  async getResourcesBySubjectId(subjectId: number): Promise<Resource[]> {
    return db.select().from(resources).where(eq(resources.subjectId, subjectId));
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return db.select().from(resources).where(eq(resources.type, type));
  }

  async getResourcesByClassAndSubject(classId: number, subjectId: number): Promise<Resource[]> {
    return db.select().from(resources)
      .where(and(
        eq(resources.classId, classId),
        eq(resources.subjectId, subjectId)
      ));
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const now = new Date();
    const [resource] = await db.insert(resources).values({
      ...insertResource,
      description: insertResource.description ?? null,
      featured: insertResource.featured ?? false,
      chapterId: insertResource.chapterId ?? null,
      createdAt: now
    }).returning();
    return resource;
  }

  async deleteResource(id: number): Promise<boolean> {
    const result = await db.delete(resources).where(eq(resources.id, id)).returning();
    return result.length > 0;
  }

  // Topic operations
  async getTopicsByChapterId(chapterId: number): Promise<Topic[]> {
    return db.select().from(topics).where(eq(topics.chapterId, chapterId)).orderBy(topics.order);
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const [topic] = await db.insert(topics).values({
      ...insertTopic,
      description: insertTopic.description ?? null,
    }).returning();
    return topic;
  }
}