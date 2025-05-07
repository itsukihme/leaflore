import { users, type User, type InsertUser, type Application, type InsertApplication, applications } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Application methods
  createApplication(application: InsertApplication & { ipAddress?: string }): Promise<Application>;
  getApplicationsByUsername(username: string): Promise<Application[]>;
  getRecentApplications(limit: number): Promise<Application[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private applications: Map<number, Application>;
  userCurrentId: number;
  applicationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
    this.userCurrentId = 1;
    this.applicationCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Application methods
  async createApplication(applicationData: InsertApplication & { ipAddress?: string }): Promise<Application> {
    const id = this.applicationCurrentId++;
    const application: Application = {
      ...applicationData,
      id,
      createdAt: new Date(),
    };
    this.applications.set(id, application);
    return application;
  }
  
  async getApplicationsByUsername(username: string): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (app) => app.username === username
    ).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  
  async getRecentApplications(limit: number): Promise<Application[]> {
    return Array.from(this.applications.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
