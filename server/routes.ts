import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { insertModeratorApplicationSchema } from "@shared/schema";
import { z } from "zod";
import rateLimit from "express-rate-limit";

// Discord webhook URL
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/1369614118184816642/Vmk1oXGafBW7RtzSeZOkr2n6j771svKi5MOlSrRrcc7jTnfI5lQsdtEF9xZ2Am2DF3qK";

// Rate limiting middleware - 1 submission per 15 minutes
const applicationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1, // 1 submission per window
  standardHeaders: true,
  message: {
    message: "Too many applications submitted. Please try again in 15 minutes."
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for submitting an application
  app.post("/api/apply", applicationRateLimit, async (req, res) => {
    try {
      // Validate the request body
      const validatedData = insertModeratorApplicationSchema.parse(req.body);
      
      // Prepare data for Discord webhook
      const webhookData = {
        embeds: [{
          title: "New Moderator Application",
          color: 5763719, // Light green in decimal
          fields: [
            { name: "Discord Username", value: validatedData.discordUsername },
            { name: "About Yourself", value: validatedData.aboutYourself },
            { name: "Why Join", value: validatedData.whyJoin },
            { name: "Timezone", value: validatedData.timezone },
            { name: "Activity Level", value: validatedData.activityLevel },
            { name: "Professionalism (1-10)", value: validatedData.professionalism.toString() },
            { name: "Joke", value: validatedData.joke }
          ],
          timestamp: new Date().toISOString()
        }]
      };
      
      // Send to Discord webhook
      await axios.post(DISCORD_WEBHOOK_URL, webhookData);
      
      // Save application to storage (with timestamp)
      const applicationToInsert = {
        ...validatedData,
        submittedAt: new Date().toISOString()
      };
      
      // Return success
      res.status(200).json({ message: "Application submitted successfully!" });
    } catch (error: any) {
      console.error("Error submitting application:", error);
      
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      // Handle webhook errors from axios
      if (error?.response && typeof error.response === 'object') {
        const status = error.response.status || 500;
        const statusText = error.response.statusText || 'Error';
        return res.status(status).json({ 
          message: `Discord webhook error: ${status} ${statusText}` 
        });
      }
      
      // Generic error
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
