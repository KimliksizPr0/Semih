import { users, projects, chats, messages, type User, type InsertUser, type Project, type InsertProject, type Chat, type InsertChat, type Message, type InsertMessage } from "@shared/schema";
import * as fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECTS_FILE = join(__dirname, 'projects.json');
const CHATS_FILE = join(__dirname, 'chats.json');
const MESSAGES_FILE = join(__dirname, 'messages.json');

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

  // Chat methods
  createChat(): Promise<Chat>;
  getChat(id: number): Promise<Chat | undefined>;
  getMessages(chatId: number): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
}

export class JsonFileStorage implements IStorage {
  private projects: Map<number, Project>;
  private chats: Map<number, Chat>;
  private messages: Map<number, Message>;
  private currentProjectId: number;
  private currentChatId: number;
  private currentMessageId: number;

  constructor() {
    this.projects = new Map();
    this.chats = new Map();
    this.messages = new Map();
    this.currentProjectId = 1;
    this.currentChatId = 1;
    this.currentMessageId = 1;
    this.loadProjects();
    this.loadChats();
    this.loadMessages();
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

  private async loadChats() {
    try {
      const data = await fs.readFile(CHATS_FILE, 'utf8');
      const parsedChats: Chat[] = JSON.parse(data);
      this.chats = new Map(parsedChats.map(c => [c.id, c]));
      this.currentChatId = parsedChats.length > 0
        ? Math.max(...parsedChats.map(c => c.id)) + 1
        : 1;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('chats.json not found, starting with empty chats.');
        this.chats = new Map();
        this.currentChatId = 1;
      } else {
        console.error('Failed to load chats from file:', error);
      }
    }
  }

  private async saveChats() {
    try {
      const chatsArray = Array.from(this.chats.values());
      await fs.writeFile(CHATS_FILE, JSON.stringify(chatsArray, null, 2), 'utf8');
    } catch (error) {
      console.error('Failed to save chats to file:', error);
    }
  }

  private async loadMessages() {
    try {
      const data = await fs.readFile(MESSAGES_FILE, 'utf8');
      const parsedMessages: Message[] = JSON.parse(data);
      // Group messages by chatId
      this.messages = new Map();
      for (const message of parsedMessages) {
        if (!this.messages.has(message.chatId)) {
          this.messages.set(message.chatId, []);
        }
        this.messages.get(message.chatId)!.push(message);
      }
      this.currentMessageId = parsedMessages.length > 0
        ? Math.max(...parsedMessages.map(m => m.id)) + 1
        : 1;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('messages.json not found, starting with empty messages.');
        this.messages = new Map();
        this.currentMessageId = 1;
      } else {
        console.error('Failed to load messages from file:', error);
      }
    }
  }

  private async saveMessages() {
    try {
      const allMessages = Array.from(this.messages.values()).flat();
      await fs.writeFile(MESSAGES_FILE, JSON.stringify(allMessages, null, 2), 'utf8');
    } catch (error) {
      console.error('Failed to save messages to file:', error);
    }
  }

  // User methods (unchanged)
  async getUser(id: number): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return { id: 0, username: insertUser.username, password: insertUser.password };
  }

  // Project methods (unchanged)
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
    await this.saveProjects();
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) return undefined;

    const updatedProject: Project = { ...existingProject, ...updateData, createdAt: existingProject.createdAt };
    this.projects.set(id, updatedProject);
    await this.saveProjects();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const deleted = this.projects.delete(id);
    if (deleted) {
      await this.saveProjects();
    }
    return deleted;
  }

  // Chat methods
  async createChat(): Promise<Chat> {
    const id = this.currentChatId++;
    const chat: Chat = { id, createdAt: new Date() };
    this.chats.set(id, chat);
    await this.saveChats();
    return chat;
  }

  async getChat(id: number): Promise<Chat | undefined> {
    return this.chats.get(id);
  }

  async getMessages(chatId: number): Promise<Message[]> {
    return this.messages.get(chatId) || [];
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      id,
      chatId: insertMessage.chatId,
      role: insertMessage.role,
      content: insertMessage.content,
      createdAt: new Date(),
    };
        if (!this.messages.has(message.chatId)) {
      this.messages.set(message.chatId, []);
    }
    this.messages.get(message.chatId)!.push(message);
    await this.saveMessages();
    return message;
  }
}

export const storage = new JsonFileStorage();