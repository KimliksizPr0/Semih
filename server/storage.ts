import { users, projects, type User, type InsertUser, type Project, type InsertProject } from "@shared/schema";
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECTS_FILE = join(__dirname, 'projects.json');

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
}

export class JsonFileStorage implements IStorage {
  private projects: Map<number, Project>;
  private currentProjectId: number;

  constructor() {
    this.projects = new Map();
    this.currentProjectId = 1;
    this.loadProjects(); // Load projects on initialization
  }

  private async loadProjects() {
    try {
      const data = await fs.readFile(PROJECTS_FILE, 'utf8');
      const parsedProjects: Project[] = JSON.parse(data);
      this.projects = new Map(parsedProjects.map(p => [p.id, p]));
      this.currentProjectId = parsedProjects.length > 0 
        ? Math.max(...parsedProjects.map(p => p.id)) + 1 
        : 1;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('projects.json not found, starting with empty projects.');
        this.projects = new Map();
        this.currentProjectId = 1;
      } else {
        console.error('Failed to load projects from file:', error);
        // Optionally, re-throw or handle more gracefully
      }
    }
  }

  private async saveProjects() {
    try {
      const projectsArray = Array.from(this.projects.values());
      await fs.writeFile(PROJECTS_FILE, JSON.stringify(projectsArray, null, 2), 'utf8');
    } catch (error) {
      console.error('Failed to save projects to file:', error);
    }
  }

  // User methods (unchanged, as they are not part of this persistence)
  async getUser(id: number): Promise<User | undefined> {
    // For simplicity, users are still in-memory or not implemented for file storage
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // For simplicity, users are still in-memory or not implemented for file storage
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // For simplicity, users are still in-memory or not implemented for file storage
    return { id: 0, username: insertUser.username, password: insertUser.password };
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => b.id - a.id);
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      id,
      name: insertProject.name,
      description: insertProject.description,
      category: insertProject.category,
      icon: insertProject.icon || "fas fa-file",
      link: insertProject.link || "#",
      offline: insertProject.offline ?? false,
      createdAt: new Date() 
    };
    this.projects.set(id, project);
    await this.saveProjects(); // Save after creation
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) return undefined;

    const updatedProject: Project = { ...existingProject, ...updateData, createdAt: existingProject.createdAt };
    this.projects.set(id, updatedProject);
    await this.saveProjects(); // Save after update
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const deleted = this.projects.delete(id);
    if (deleted) {
      await this.saveProjects(); // Save after deletion
    }
    return deleted;
  }
}

export const storage = new JsonFileStorage();