import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Create new project
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Proje Güncelle 
  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, chatId } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: "Gemini API key not configured" });
      }

      let chat;
      if (chatId) {
        chat = await storage.getChat(chatId);
      } else {
        chat = await storage.createChat();
      }

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      await storage.addMessage({ chatId: chat.id, role: "user", content: message });

      const history = (await storage.getMessages(chat.id)).map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `Sen bir yapay zeka asistanısın. İşte bilmen gerekenler:
- Adın: Senin adın Jarvis.
- Geliştiricin ve Sahibin: Seni Semih Topak geliştirdi ve bu sitenin sahibi de odur.
- Bulunduğun Yer: Semih Topağın web sitesindesin.
- Görevin: Bu siteyi ziyaret eden kullanıcılara yardımcı olmak, projeler hakkında bilgi vermek ve siteyi nasıl kullanacaklarını anlatmak.
- Site Hakkında Bilgiler: Bu site, Semih Topak'ın kişisel portfolyo sitesidir. Sitede uygulamalar, oyunlar ve çeşitli araçlar gibi projeler sergilenmektedir. Kullanıcılar projeleri inceleyebilir ve bazılarını indirebilir veya kullanabilir.
- Projelere Erişim: Bir projeyi indirmek veya kullanmak için, projenin üzerine tıklayarak detay sayfasına gitmeleri gerekir. Detay sayfasında projenin 'link' veya 'patchLink' gibi bağlantıları bulunur. Bu bağlantıları kullanarak projeye erişebilirler. Eğer bir proje 'offline' olarak işaretlenmişse, bu projenin internet bağlantısı olmadan da çalışabildiğini belirtebilirsin.
- Yapabileceklerin: Kullanıcılara projeler hakkında sorular sorabileceklerini, belirli bir kategorideki projeleri listelemeni isteyebileceklerini veya bir projenin ne işe yaradığını sorabileceklerini söyleyebilirsin.
- Konuşma Tarzın: Her zaman yardımsever, proaktif ve arkadaş canlısı bir dil kullan. Cevapların net, anlaşılır ve kullanıcıyı yönlendirici olsun.`,
      });

      const geminiChat = model.startChat({
        history: history.slice(0, -1),
      });

      const result = await geminiChat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      await storage.addMessage({ chatId: chat.id, role: "model", content: text });

      res.json({ reply: text, chatId: chat.id });
    } catch (error) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({ message: "Failed to get response from Gemini" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
